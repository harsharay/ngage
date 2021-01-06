import React, { useState, useEffect } from "react"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom"
import { firestore, createPostDocument } from "../../FirebaseFunctions/firebaseUtils"
import firebase from "firebase/app";
// import { FcGoogle } from "react-icons/fc";
// import { BsArrowRight } from "react-icons/bs";

import { connect } from "react-redux"

import "./Main.css"


const Main = ({ allUserData }) => {
    const apiKey = "aea11fb488e7be30acbfb6e5c48beade"

    let date;

    const [domainName, setDomainName] = useState("")
    const [inputData, setInputData] = useState("")
    const [userData, setUserData] = useState("")
    const [previewData, setPreviewData] = useState({})
    const [pinnedData, setPinnedData] = useState({})
    // const [commentsToThePost, setCommentsToThePost] = useState([])
    const [partOfUrl, setPartOfUrl] = useState("")
    const [redirectLink, setRedirectLink] = useState("")

    useEffect(() => {
        setUserData(allUserData)
        setDomainName(window.location.hostname)
    },[allUserData])

    const handleSaveInputData = e => {
        setInputData(e.target.value)
    }

    const generateLinkPreview = () => {
        date = new Date()
        let seconds = date.getTime()
        console.log(43, seconds)
        setPartOfUrl(String(seconds).substr(6))
        
        if(inputData.length>0) {
            fetch(`https://api.linkpreview.net/?key=${apiKey}&q=${inputData}`)
            .then(data => data.json())
            .then(json => setPreviewData(json))
        }
        createPostDocument(String(seconds).substr(6))
        setInputData("")
        setRedirectLink("")
    }

    const handleAddingPin = async () => {
        setPinnedData(previewData)
        await firestore.doc(`/userData/${userData.uid}`).update({
            userPosts : firebase.firestore.FieldValue.arrayUnion({postId: partOfUrl})
        })
        console.log("Done!")
        

        await firestore.doc(`/ngagePosts/${partOfUrl}`).update({
            postId: partOfUrl,
            title: previewData.title,
            description: previewData.description,
            url: previewData.url,
            image: previewData.image,
            // comments: []
        })
        setRedirectLink(`${domainName}:3000/posts/${partOfUrl}`)
    }

    // const handleGoogleSignin = () => {
    //     googleSignin()
    // }

    // const signOut = () => {
    //     auth.signOut()
    // }

    return (
        <div className="mainBlock">
            <div className="main-info">
                <p>Insert any link below</p>
            </div>
            <div className="textAndButtons">
                <TextField value={inputData} onChange={handleSaveInputData} className="inputField" id="outlined-basic" variant="outlined" InputProps={{className: "textColor"}}/>
                <Button variant="contained" color="primary" onClick={generateLinkPreview}>GO</Button>
            </div>
            { Object.keys(previewData).length>0 && 
                <>
                    <div className="preview">
                        <div className="postMainContent">
                        <img src={previewData.image} alt={previewData.title} />
                        <div className="postMainContent-text">
                            <h1>{previewData.title}</h1>
                            {previewData.description && <p>{previewData.description.slice(0,200)}...</p>}
                            <a href={previewData.url}>{previewData.url}</a>
                        </div>
                </div> 
                    </div> 
                    <div className="preview-Pin">
                        { (Object.keys(previewData).length>0 && userData) ?  
                            <>
                                <Button variant="contained" color="default" className="pin-button" onClick={handleAddingPin}>Create a POST for discussion</Button>
                                { redirectLink && 
                                    <div className="pinRedirectLink">
                                        {/* <p className="pinRedirectLink-content">Pin created at <BsArrowRight /> </p> */}
                                        <Link to={{pathname: "/posts/"+partOfUrl, state:{url : previewData.url, uid : userData.uid }}} className="pinRedirectLink-link" target="_blank">
                                            Check out the post
                                        </Link> 
                                    </div>
                                }
                            </> 
                            :
                            <div>
                                <p className="signInPostAlert">Sign in to create a post</p>
                            </div>
                        }
                    </div>
                </>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
        allUserData : state.userData
    }   
}

export default connect(mapStateToProps)(Main);