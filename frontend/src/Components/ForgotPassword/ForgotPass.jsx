import React, { useState, useContext } from 'react';
import css from "./ForgotPass.module.css";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../AuthContext/AuthContext';
import { SendPasswordResetEmail } from '../../ReactQuery/api';
import { toast } from 'react-toastify';

const ForgotPass = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, isLoading } = useContext(AuthContext);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await SendPasswordResetEmail(data.email);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast(error.message)
        };
    }

    return (
        <div className={css.Columns}>
            <form className={css.Inputs} onSubmit={handleSubmit(onSubmit)}>
                <div className={css.inputfield}>
                    <label htmlFor="Email">Email</label>
                    <input type="email" placeholder="Email" {...register('email', { required: true })} />
                </div>
                {errors.password && <span className={css.ErrorMessage}>Password should be at least 6 characters</span>}
                <button type='submit' className={css.loginButton}>Reset Password</button>
            </form>

        </div>

    )
}

export default ForgotPass