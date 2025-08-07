import React, { useState, useContext } from 'react'
import css from "./Login.module.css"
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { LoginTOAccount } from '../../ReactQuery/api';
import { toast } from "react-toastify";
import { AuthContext } from '../../AuthContext/AuthContext';


const Login = ({ onClick }) => {
    const { socket } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        if (loading) {
            toast("Authentication in progress");
            return;
        }
        setLoading(true);
        try {
            const response = await LoginTOAccount(data.email, data.password, socket);
            if (response.status === 200) {
                setLoading(false);
                navigate('/home')
            } else {
                toast(response.statusText);
                setLoading(false);
            }
        } catch (error) {
            toast(error.response?.data?.message || "Something went wrong");
            setLoading(false);

        }
    }

    return (
        <div className={css.Columns}>
            <form className={css.Inputs} onSubmit={handleSubmit(onSubmit)}>
                <div className={css.inputfield}>
                    <label htmlFor="Email">Email</label>
                    <input type="email" placeholder="Email" {...register('email', { required: true })} />
                </div>
                {errors.email && <span className={css.ErrorMessage}>Please provide a valid email</span>}
                <div className={css.inputfield}>
                    <label htmlFor="Password">Password</label>
                    <div className={css.passwordToggle}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            {...register('password', { required: true, minLength: 6 })}
                        />
                        <div className={css.iconRight} onClick={togglePasswordVisibility}>
                            {
                                showPassword ? <i class="uil uil-eye-slash"></i> : <i class="uil uil-eye"></i>
                            }
                        </div>
                    </div>

                    <div className={css.forgotPassword} onClick={onClick}>
                        <span>Forgot password?</span>
                    </div>
                </div>
                {errors.password && <span className={css.ErrorMessage}>Password should be at least 6 characters</span>}
                <button type='submit' className={css.loginButton}>{loading ? "Please wait...." : "Login"}</button>
            </form>

        </div>

    )
}

export default Login