import React, { useState, useEffect } from "react"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom"
import { auth, createUserDocument, firestore, googleSignin } from "../../FirebaseFunctions/firebaseUtils"
import firebase from "firebase/app";
import { FcGoogle } from "react-icons/fc";

import "./Main.css"


const Main = () => {
    const apiKey = "aea11fb488e7be30acbfb6e5c48beade"

    const [inputData, setInputData] = useState("")
    const [userData, setUserData] = useState("")
    const [previewData, setPreviewData] = useState({})
    const [pinnedData, setPinnedData] = useState({})
    const [commentsToThePost, setCommentsToThePost] = useState([])
    const [displayImage, setDisplayImage] = useState("")

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            setUserData(user)
            createUserDocument(user)
            if(user) {
                setDisplayImage(user.providerData[0].photoUrl)
            }
            console.log(28, user.displayName)
        })
    },[])

    const handleSaveInputData = e => {
        setInputData(e.target.value)
    }

    const generateLinkPreview = () => {
        if(inputData.length>0) {
            fetch(`http://api.linkpreview.net/?key=${apiKey}&q=${inputData}`)
            .then(data => data.json())
            .then(json => setPreviewData(json))
        }
    }

    const handleAddingPin = async () => {
        setPinnedData(previewData)
        await firestore.doc(`/ngagePosts/${userData.uid}`).update({
            postData : firebase.firestore.FieldValue.arrayUnion({
                postTitle : previewData.title,
                postDescription : previewData.description,
                postUrl : previewData.url,
                postImage: previewData.image
            })
        })
        console.log("Done!")
    }

    const handleGoogleSignin = () => {
        googleSignin()
    }

    const signOut = () => {
        auth.signOut()
    }

    return (
        <div className="mainBlock">
            { userData ? 
                <div className="signedDetails">
                    <p>Welcome {userData.displayName}</p> 
                    <Button variant="contained" color="primary" className="googleSignOut" onClick={signOut}>Sign out</Button>
                </div>
                : 
                <Button variant="contained" color="primary" className="googleSignin" onClick={handleGoogleSignin}><FcGoogle className="googleIconSignin"/>Sign in</Button> 
            }
            <div className="textAndButtons">
                <TextField value={inputData} onChange={handleSaveInputData} className="inputField" id="outlined-basic" variant="outlined" />
                <Button variant="contained" color="primary" onClick={generateLinkPreview}>GO</Button>
            </div>
            { Object.keys(previewData).length>0 && 
                <>
                    <div className="preview">
                        <div className="preview-Content">
                        { Object.keys(previewData).length>0 && <img src={previewData.image} alt={previewData.title} className="preview-Image"/> }
                            <div className="preview-Text">
                                <p className="preview-Title">{previewData.title}</p>
                                { Object.keys(previewData).length>0 && <p className="preview-Desc">{previewData.description.slice(0,400)}...</p> }
                                <a href={previewData.url}  title={previewData.title} className="preview-Link" target="_blank" rel="noreferrer">{previewData.url}</a>
                            </div>
                        </div>
                    </div> 
                    <div className="preview-Pin">
                        { (Object.keys(previewData).length>0 && userData) &&  

                        <Link to={{pathname: "/posts/"+encodeURIComponent(previewData.title.replaceAll(" ","")), state:{url : previewData.url }}}>
                            <Button variant="contained" color="default" className="pin-button" onClick={handleAddingPin}>Create a PIN</Button>
                        </Link> 
                        }
                    </div>
                </>
            }
        </div>
    )
}

export default Main;