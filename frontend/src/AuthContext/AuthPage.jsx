import React, { useState } from 'react'
import css from "./AuthPage.module.css"
import Login from '../Components/Login/Login'
import SignUp from '../Components/SignUp/Signup'
import { CreateAccount, SendPasswordResetEmail, SignInToAccount } from '../ReactQuery/api';
import ForgotPass from '../Components/ForgotPassword/ForgotPass'

const AuthPage = () => {
    const [authIndex, setauthIndex] = useState(0);
    return (
        <div className={css.Frame}>
            <div className={css.Columns}>
                <span className={css.Title}>{authIndex === 0 ? "Login to secret seduction" : authIndex === 1 ? "Sign up to secret seduction" : "Reset your password"}</span>
                {
                    authIndex === 0 ? <Login onClick={() => {
                        setauthIndex(2);
                    }} /> : authIndex === 1 ? <SignUp /> : <ForgotPass />
                }
                <div className={css.SignUpNavigation}>
                    <span>{authIndex === 0 ? "Do not have an account?" : authIndex === 1 ? "Already have an account?" : ""} <span className={css.CreateAccount} onClick={() => {
                        if (authIndex === 0) {
                            setauthIndex(1);
                        } else if (authIndex === 1) {
                            setauthIndex(0);
                        } else {
                            setauthIndex(0)
                        }
                    }}>{authIndex === 0 ? "Create Account" : authIndex === 1 ? "Login" :`Login`}</span></span>
                </div>

            </div>
        </div>
    )
}

export default AuthPage