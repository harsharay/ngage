import React, { useState, useEffect } from "react"
import { firestore } from "../../FirebaseFunctions/firebaseUtils";
import { connect } from "react-redux";
import { Link } from "react-router-dom"
import { MdLink } from "react-icons/md"

import "./MyPosts.css"

const MyPosts = ({ allUserData }) => {

    const [userData, setUserData] = useState([])
    const [allPostIds, setAllPostIds] = useState([])
    const [allPostDetails, setAllPostDetails] = useState([])

    let data = []

    useEffect(() => {
        console.log(18, allUserData)
    },[allUserData])

    useEffect(() => {
        if(allUserData && Object.keys(allUserData).length>0) {
            setUserData(allUserData)
        }
    },[allUserData])

    //Retrieving all the post id's of the user's
    const retrievePostsIds = async () => {
        let reference = await firestore.collection('userData').where("uid","==",allUserData.uid).get()
        reference.forEach(item => {
            setAllPostIds(item.data().userPosts)
        })
    }

    //Calling the retrieval of post id's function
    useEffect(() => {
        if(allUserData && Object.keys(allUserData).length>0) {
            retrievePostsIds()
        }
    },[allUserData])
    

    let loadPostData = async (id) => {
        let reference = await firestore.collection('ngagePosts').where('postId',"==",id).get()
        reference.forEach(item => {
            data.push(item.data())
            // setAllPostDetails(prevValue => {
            //     return {
            //         ...prevValue,
            //         data : [...data , item.data()]
            //     }
            // })
        })
        setAllPostDetails(prevValue => {
            return {
                ...prevValue,
                data
            }
        })
    }

    useEffect(() => {
        if(allPostIds.length>0) {
            allPostIds.forEach(item => {
                loadPostData(item.postId)
            })
            console.log(47, data.length)
        }
    },[allPostIds])





    return (
        <div className="myPostsBlock">
            {allUserData ? 
                <>
                    <p>Your posts</p>
                    { (allPostDetails.data) &&
                        <div className="alLPosts">
                            { allPostDetails.data.map((item, index) => {
                                return (
                                    <div className="singlePost" key={index}>
                                        <Link to={"/posts/"+item.postId} target="_blank">{item.title} <span className="linkIcon"><MdLink /></span></Link>
                                    </div>
                                )
                            })}
                        </div> 
                    }
                </>
            
            : 
                <p className="signIn-Alert-Message">Please sign in</p>}
            
        </div>
    )
}

const mapStateToProps = state => {
    return {
        allUserData: state.userData
    }
}

export default connect(mapStateToProps,null)(MyPosts);