import React, { useState, useEffect } from "react"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import "./Main.css"


const Main = () => {
    const apiKey = "aea11fb488e7be30acbfb6e5c48beade"

    const [inputData, setInputData] = useState("")
    const [previewData, setPreviewData] = useState({})
    const [pinnedData, setPinnedData] = useState({})
    const [commentsToThePost, setCommentsToThePost] = useState([])

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

    const handleAddingPin = () => {
        setPinnedData(previewData)
    }

    return (
        <div className="mainBlock">
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
                        { Object.keys(previewData).length>0 && <Button variant="contained" color="default" className="pin-button" onClick={handleAddingPin}>Create a PIN</Button> }
                    </div>
                    <div className="comments">
                        <p className="commentsTitle">Add comments</p>
                        <div>
                            <TextField id="outlined-basic" label="Enter your comment" className="commentsInput"/>
                            <Button variant="contained" color="primary">ADD</Button>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Main;