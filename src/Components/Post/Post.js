import React, { useState, useEffect } from "react"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const Post = (props) => {

    useEffect(() => {
        console.log(props)
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