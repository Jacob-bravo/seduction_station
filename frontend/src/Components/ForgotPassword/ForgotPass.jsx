import React, { useState, useContext } from 'react';
import css from "./ForgotPass.module.css";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../AuthContext/AuthContext';

const ForgotPass = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const { user, isLoading } = useContext(AuthContext);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const navigate = useNavigate();
    const onSubmit = () => {
        // Submit name and password here
        try {
            navigate("/home");
        } catch (error) {

        }
    }

    return (
        <div className={css.Columns}>
            <form className={css.Inputs} onSubmit={handleSubmit(onSubmit)}>
                <div className={css.inputfield}>
                    <label htmlFor="Email">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: true, minLength: 50, })}
                    />
                </div>
                {errors.email && <span className={css.ErrorMessage}>Please provide a valid email</span>}
                <button type='submit' className={css.loginButton}>Reset Password</button>
            </form>

        </div>

    )
}

export default ForgotPass