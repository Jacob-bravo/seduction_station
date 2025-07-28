import React, { useState } from 'react'
import css from "./Profile.module.css"
import { useForm } from 'react-hook-form';
import ImageOne from "../../Images/photo1.jpg"

const Profile = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const onSubmit = () => {
        // Submit name and password here
        try {

        } catch (error) {

        }
    }
    return (
        <div className={css.container}>
            <div className={css.Column}>
                <div className={css.profile}>
                    <div className={css.image}>
                        <img src={ImageOne} alt="dp" />
                        <i class="uil uil-pen"></i>
                    </div>
                    <div className={css.infoColumn}>
                        <span>Shaun Daniel</span>
                        <span>shaun@gmail.com</span>
                    </div>
                </div>
                <div className={css.forms}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={css.inputGroup}>
                            <input
                                type="text"
                                placeholder="Username"
                                {...register('username', { required: true, minLength: 6 })}
                            />
                        </div>
                        {errors.username && <span>Username should be at least 6 characters</span>}
                        {/* Email Input */}
                        <div className={css.inputGroup}>
                            <input
                                type="email"
                                placeholder="Email"
                                {...register('email', { required: true, minLength: 50, })}
                            />
                        </div>
                        {errors.email && <span>Please provide a valid email</span>}

                        <div className={css.inputGroup}>
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
                        {errors.password && <span>Password should be at least 6 characters</span>}


                        <button type='submit' className={css.UpdateProfile}>Update Account</button>
                        <button className={css.termination} type='submit'>Delete Account</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile