import React, { useState, useEffect } from "react"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { firestore } from "../../FirebaseFunctions/firebaseUtils"


const Post = (props) => {

    const [routerPostId, setRouterPostId] = useState("")

    useEffect(() => {
        console.log(props)
        console.log(10, props.match.params.postId)
        console.log(14, props.location.state)
        setRouterPostId(props.match.params.postId)
    },[props])

    let loadPostData = async () => {
        // let reference = await firestore.collection('ngagePosts').where('postId',"==",5474377).get()
        // reference.forEach(item => console.log(19, item.data()))
        // let reference = await firestore.collection('ngagePosts').document('allPostsData').get()
        // console.log(21, reference)
        const collectionRef = firestore.collection('ngagePosts')
        const snapshot = await collectionRef.get()
        snapshot.forEach(doc => {
            if(doc.data().data) {
                doc.data().data.forEach(item => {
                    if(item.postId === props.match.params.postId) {
                        console.log(29,item)
                    }
                })
            }
        })
    }

    useEffect(() => {
        loadPostData()
    },[props])

    return (
        <div>
            <div className="postMainContent">
        
            </div>
            <div className="comments">
                <p className="commentsTitle">Add comments</p>
                <div>
                    <TextField id="outlined-basic" label="Enter your comment" className="commentsInput"/>
                    <Button variant="contained" color="primary">ADD</Button>
                </div>
            </div>
        </div>
    )
}

export default Post;