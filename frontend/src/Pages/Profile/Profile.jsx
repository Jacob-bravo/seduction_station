import React, { useState, useRef, useEffect, useContext } from 'react'
import css from "./Profile.module.css"
import { useForm } from 'react-hook-form';
import { DefaultProfile } from '../../Data';
import { updateUser, uploadMediaToFirebase, FetchModel } from '../../ReactQuery/api';
import { AuthContext } from "../../AuthContext/AuthContext"
import Loadingwidget from '../../Components/Loadingwidget/Loadingwidget';

const Profile = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [user, setUser] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProfileLoading, setisLoading] = useState(true);
    const [isuploadingLoading, setisuploadingLoading] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(DefaultProfile)
    const [previewPhotoClassname, setpreviewPhotoClassname] = useState("HidePhotoPreview")
    const [profileImage, setProfileImage] = useState(DefaultProfile);
    const [uploadFile, setuploadFile] = useState("");
    const [uploadFirebaseFile, setuploadFirebaseFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [profileToUpdate, setprofileToUpdate] = useState(null);
    const [userPhotos, setuserPhotos] = useState([]);
    const [userVideos, setuserVideos] = useState([]);
    const [isPhotos, setIsPhotos] = useState(true);
    const mediaFileInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setProfileImage(imageURL);
            setprofileToUpdate(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };
    const onSubmit = async (data, event) => {
        const action = event.nativeEvent.submitter.value;

        try {
            if (action === "update") {
                await updateUser(profileToUpdate, data.username, data.biography);
            } else if (action === "delete") {
                console.log("Deleting account...");
                // await axios.delete(`/api/delete/${userId}`);
            }
        } catch (error) {
            console.error("Something went wrong:", error);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");

        const fetchUserDetails = async () => {
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                try {
                    setisLoading(true);
                    const userDetails = await FetchModel(userData._id);
                    setUser(userDetails.model);
                    setProfileImage(userDetails.model.profileimage);
                    setuserPhotos(userDetails.model.Photos);
                    setuserVideos(userDetails.model.Videos);
                    setisLoading(false);
                } catch (err) {
                    console.error("Failed to fetch user details:", err);
                }
            }
        };

        fetchUserDetails();
    }, []);


    const handleClickAddMedia = () => {
        mediaFileInputRef.current?.click();
    };

    const handleMediaFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const imageURL = URL.createObjectURL(file);
        setuploadFile(imageURL);
        setPreviewFile('flex')
        setuploadFirebaseFile(file)
        try {
        } catch (err) {
            console.error("Upload error:", err);
        }
    };
    const handleUpload = async () => {
        try {
            setisuploadingLoading(true);
            const url = await uploadMediaToFirebase(
                uploadFirebaseFile,
                user.Uid,
                isPhotos,
                (progress) => {
                    setUploadProgress(progress);
                }
            );

            setPreviewFile(null);

            setTimeout(async () => {
                try {
                    const userDetails = await FetchModel(user._id);
                    setuserPhotos(userDetails.model.Photos);
                    setuserVideos(userDetails.model.Videos);
                    setProfileImage(userDetails.model.profileimage);
                    setisuploadingLoading(false);
                } catch (err) {
                    console.error("Failed to fetch user details:", err);
                }
            }, 3000);

        } catch (error) {
            console.error("Upload failed:", error);
        }
    };
    if (isProfileLoading) {
        return <Loadingwidget />
    }
    const UploadProgress = () => {
        return (
            <div className={css.wrapper}>
                <div className={css.glass}>
                    <div className={css.progressBar}>
                        <div
                            className={css.progress}
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className={css.Frame}>
            <div className={css.MobileRow}>
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
                        <span>{user.username}</span>
                        <span>{user.email}</span>
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
                    {/* Bio Input */}
                    <div className={css.inputGroup}>
                        <input
                            type="text"
                            value={user.about}
                            placeholder="Your bio"
                            {...register('biography', { required: true, minLength: 5 })}
                        />
                    </div>
                    {errors.username && <span className={css.Errors}>Bio should be at least 5 characters</span>}
                    <button
                        type="submit"
                        name="action"
                        value="update"
                        className={css.UpdateProfile}
                    >
                        Update Account
                    </button>

                    <button
                        type="submit"
                        name="action"
                        value="delete"
                    >
                        Delete Account
                    </button>
                </form>
            </div>
            <div className={css.MediaFiles}>
                <div className={css.Tabs}>
                    <button
                        className={isPhotos ? css.active : ""}
                        onClick={() => setIsPhotos(true)}
                    >
                        Photos
                    </button>
                    <button
                        className={!isPhotos ? css.active : ""}
                        onClick={() => setIsPhotos(false)}
                    >
                        Videos
                    </button>
                    <div
                        className={`${css.MediaItem} ${css.AddItem}`}
                        onClick={handleClickAddMedia}
                    >
                        <input
                            type="file"
                            accept={isPhotos ? "image/*" : "video/*"}
                            style={{ display: "none" }}
                            ref={mediaFileInputRef}
                            onChange={handleMediaFileSelect}
                        />
                        <span>＋</span>

                    </div>
                </div>

                {
                    isuploadingLoading ? <Loadingwidget /> : <div className={css.Grid}>
                        {/* Add button block */}

                        {
                            isPhotos ? <div className={css.Photos}>
                                {
                                    userPhotos.map((model, index) => {

                                        return (
                                            <img
                                                key={index}
                                                src={model.url}
                                                alt="modelphoto"
                                                className={css.activePhoto}
                                                onClick={() => {

                                                    setpreviewPhotoClassname("PhotoPreview");
                                                    setPhotoUrl(model.url);

                                                }}
                                            />
                                        );
                                    })
                                }

                            </div> : <div className={css.Videos}>
                                {
                                    userVideos.map((video, index) => {
                                        return (
                                            <video
                                                key={index}
                                                src={video.url}
                                                className={css.activePhoto}
                                                onClick={() => {

                                                    setpreviewPhotoClassname("PhotoPreview");
                                                    setPhotoUrl(video.url);

                                                }}
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                                onMouseEnter={e => e.currentTarget.play()}
                                                onMouseLeave={e => e.currentTarget.pause()}
                                            />
                                        );
                                    })
                                }
                            </div>
                        }

                    </div>
                }
            </div>
            <div className={css[previewPhotoClassname]}>
                {photoUrl && <div className={css.Close} onClick={() => {
                    setpreviewPhotoClassname("HidePhotoPreview");
                }}>
                    <i class="uil uil-multiply"></i>
                </div>}
                {
                    isPhotos ? <img src={photoUrl} alt="DefaulPhotoUrlView" /> : <video
                        src={photoUrl}
                        autoPlay
                        loop
                        playsInline
                        preload="metadata"
                        controls
                        controlsList="nodownload"
                        onContextMenu={e => e.preventDefault()}
                    />
                }

            </div>
            <div className={css.PreviewUploadFile}
                style={{ display: previewFile ? 'flex' : 'none' }}
            >
                {
                    isPhotos ? <img src={uploadFile} alt="uploadfile" /> : <video src={uploadFile} controls width="100%" />
                }

                <div className={css.ActionButtons}>
                    <UploadProgress />
                    <div className={css.UploadBtn}>

                        <button onClick={() => handleUpload()}>Upload</button>
                        <button onClick={() => setPreviewFile(null)}>Discard</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Profile