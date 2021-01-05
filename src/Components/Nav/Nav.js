import React,{ useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { connect } from "react-redux"

import { auth, createUserDocument, googleSignin } from "../../FirebaseFunctions/firebaseUtils"
// import firebase from "firebase/app";
import { FcGoogle } from "react-icons/fc";
import Button from '@material-ui/core/Button';

// import Main from "../Main/Main"

import "./Nav.css"

const Nav = (props) => {

    const [userData, setUserData] = useState("")
    const [displayImage, setDisplayImage] = useState("")
    const [domainName, setDomainName] = useState("")

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            setUserData(user)
            createUserDocument(user)
            props.signingIn(user)
            // if(user) {
            //     console.log(27,user.providerData[0].photoUrl)
            //     setDisplayImage(user.providerData[0].photoUrl)
            // }
            if(user) {
                setDisplayImage(user.providerData[0].photoURL)
            }
            // console.log(28, user.displayName)
        })
        setDomainName(window.location.hostname)
    },[])

    const handleGoogleSignin = () => {
        googleSignin()
    }

    const signOut = () => {
        auth.signOut()
    }



    return (
        <div className="navBar">
            <Link to="/" className="Logo"><h1>Ngage</h1></Link>
            <div className="nav-menuItems">
                <Link to="/" className="nav-home">Home</Link>
                <Link to="/myposts" className="nav-myPosts"><p>My posts</p></Link>
                { userData ? 
                    <div className="nav-signIn">
                        <div className="signIn-userDetails">
                            <p><b>{userData.displayName}</b></p>
                            <img src={displayImage} alt={userData.displayName} className="displayImage" onClick={signOut} title="Sign out"/> 
                        </div>
                        {/* <Button variant="contained" color="primary" className="googleSignOut" onClick={signOut}>Sign out</Button> */}
                    </div>
                    : 
                    <Button variant="contained" color="primary" className="nav-googleButton" onClick={handleGoogleSignin}><FcGoogle className="googleIconSignin"/>Sign in</Button> 
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    console.log(63, state)
    return state;
}

const mapDispatchToProps = dispatch => {
    return {
        signingIn : auth => dispatch({ type: 'SIGNIN', payload: auth })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Nav);