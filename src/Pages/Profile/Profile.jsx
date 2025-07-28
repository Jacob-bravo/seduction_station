import React, { useState, useRef } from 'react'
import css from "./Profile.module.css"
import { useForm } from 'react-hook-form';
import ImageOne from "../../Images/photo1.jpg"

const Profile = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(ImageOne);
    const fileInputRef = useRef(null);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setProfileImage(imageURL);
        }
    };
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };
    const onSubmit = () => {
        try {

        } catch (error) {

        }
    }
    return (
        <div className={css.Frame}>
        <div className={css.Profile}>
                <div className={css.ProfileArea}>
                    <img src={profileImage} alt="userImage" className={css.ProfileImage} />

                    <div className={css.EditButton} onClick={triggerFileInput}>
                        <i className="uil uil-camera-change"></i>
                    </div>

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                </div>

                <div className={css.UserProfilesDetails}>
                    <span>John Doe</span>
                    <span>JohnDoe@gmail.com</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={css.inputGroup}>
                    <input
                        type="text"
                        placeholder="Username"
                        {...register('username', { required: true, minLength: 6 })}
                    />
                </div>
                {errors.username && <span className={css.Errors}>Username should be at least 6 characters</span>}
                {/* Email Input */}
                <div className={css.inputGroup}>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: true, minLength: 50, })}
                    />
                </div>
                {errors.email && <span className={css.Errors}>Please provide a valid email</span>}

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
                {errors.password && <span className={css.Errors}>Password should be at least 6 characters</span>}


                <button type='submit' className={css.UpdateProfile}>Update Account</button>
                <button type='submit'>Delete Account</button>
            </form>

        </div>
    )
}

export default Profile