import React, { useState, useEffect } from "react"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { firestore } from "../../FirebaseFunctions/firebaseUtils";
import firebase from "firebase/app";

import "./Post.css"


const Post = (props) => {

    const [routerPostId, setRouterPostId] = useState("")
    const [postData, setPostData] = useState({})
    const [currentComment, setCurrentComment] = useState("")
    const [comments, setComments] = useState([])
    const [retrievedComments, setRetrievedComments] = useState([])

    useEffect(() => {
        // console.log(props)
        // console.log(10, props.match.params.postId)
        // console.log(14, props.location.state)
        setRouterPostId(props.match.params.postId)
    },[props])

    let loadPostData = async () => {
        let reference = await firestore.collection('ngagePosts').where('postId',"==",props.match.params.postId).get()
        reference.forEach(item => setPostData(item.data()))
    }

    useEffect(() => {
        loadPostData()
    },[props])

    const handleCommentsChange = e => {
        let value = e.target.value
        setCurrentComment(value)
    }

    const handleAddingComments = async () => {
        setComments([...comments, currentComment])
        setCurrentComment("")
        // let reference = await firestore.collection('ngagePosts').where('postId',"==", props.match.params.postId).get()
        await firestore.doc(`/ngagePosts/${props.match.params.postId}`).update({
            comments : firebase.firestore.FieldValue.arrayUnion(currentComment)
        })
    }

    const handleRetrieveComments = async () => {
        let reference = await firestore.collection('ngagePosts').where('postId',"==",props.match.params.postId).get()
        reference.forEach(item => {
            // if(item.data()){
            //     console.log(50, item.data())
            // } else {
            //     console.log("no comments")
            // }
            setRetrievedComments([...item.data().comments])
            setComments([...item.data().comments])
        })
    }

    useEffect(() => {
        handleRetrieveComments()
    },[comments])

    return (
        <div className="postPage">
            { postData && 
                <div className="postMainContent">
                    <img src={postData.image} alt={postData.title} />
                    <div className="postMainContent-text">
                        <h1>{postData.title}</h1>
                        {postData.description && <p>{postData.description.slice(0,200)}...</p>}
                        <a href={postData.url}>{postData.url}</a>
                    </div>
                </div> 
            }
            <div className="comments">
                <p className="commentsTitle">Post your comment</p>
                <div>
                    <TextField id="standard-input" label="Enter your comment" className="commentsInput" onChange={handleCommentsChange} value={currentComment}/>
                    <Button variant="contained" color="primary" onClick={handleAddingComments}>ADD</Button>
                </div>
                { comments && 
                    <div className="commentsData">
                        <p className="commentsData-title">All comments</p>
                        { comments.map((comment, index) => {
                            return (
                                <div key={index} className="singleComment">
                                    <p>{comment}</p>
                                </div>
                            )
                        })}
                    </div> 
                }
            </div>
        </div>
    )
}

export default Post;