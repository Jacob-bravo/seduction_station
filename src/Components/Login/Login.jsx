import React from 'react'
import css from "./Login.module.css"
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate();
    const HandleLogin = () => {
         navigate("/home");
    }
    return (
        <div className={css.Frame}>
            <div className={css.Columns}>
                <span className={css.Title}>Login to secret seduction</span>
                <div className={css.Inputs}>
                    <div className={css.inputfield}>
                        <label htmlFor="Email">Email</label>
                        <input type="text" placeholder='johndoe@gmail.com' id='Email' />
                    </div>
                    <div className={css.inputfield}>
                        <label htmlFor="Password">Password</label>
                        <div className={css.passwordToggle}>
                            <input type="password" placeholder='Atleast 6 characters' id='Password' />
                            <i class="uil uil-eye"></i>
                        </div>
                        <div className={css.forgotPassword}>
                            <span>Forgot password?</span>
                        </div>
                    </div>
                    <div className={css.ButtonAction}>
                        <button onClick={HandleLogin}>Login</button>
                    </div>
                </div>
                <div className={css.SignUpNavigation}>
                    <span>Do not have an account? <span className={css.CreateAccount}>Create Account</span></span>
                </div>

            </div>
        </div>
    )
}

export default Login