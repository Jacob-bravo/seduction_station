import React, { useState, useEffect } from 'react'
import css from "./MobileDetails.module.css"
import { useParams } from "react-router-dom";
import { Model_Photos } from '../../Data'
import { FetchModel } from '../../ReactQuery/api';
import { toast } from "react-toastify";

const MobileDetails = () => {
    const { id, index } = useParams();
    const [model, setModel] = useState({});
    const [isPhotos, setIsPhotos] = useState(Number(index) === 8);
    const [modelPhotos, setmodelPhotos] = useState([]);
    const [modelVideos, setmodelVideos] = useState([]);
    const [photoUrl, setPhotoUrl] = useState(Model_Photos[1])
    const [previewPhotoClassname, setpreviewPhotoClassname] = useState("HidePhotoPreview")
    const [hasPaid, setHasPaid] = useState(true)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await FetchModel(id);
                if (response.status === 200) {
                    setModel(response.model);
                    setmodelPhotos(response.model.Photos);
                    setmodelVideos(response.model.Videos);
                }
            } catch (error) {
                toast(error.response?.data?.message || "Something went wrong");
            }
        }
        fetchUserData();
    }, [id])

    if (model === null && modelPhotos.length === 0 && modelVideos.length === 0) {
        return <span>Loading....</span>
    }

    return (
        <div className={css.Frame}>
            <span>{model.username}</span>
            {
                isPhotos ? <div className={css.Photos}>
                    {
                        modelPhotos.map((model, index) => {
                            const isActive = hasPaid || (!hasPaid && index === 0);

                            return (
                                <img
                                    key={index}
                                    src={model.url}
                                    alt="modelphoto"
                                    className={isActive ? css.activePhoto : css.BlurredPhoto}
                                    onClick={() => {
                                        if (hasPaid || (!hasPaid && index === 0)) {
                                            setpreviewPhotoClassname("PhotoPreview");
                                            setPhotoUrl(model.url);
                                        }
                                    }}
                                />
                            );
                        })
                    }

                </div> : <div className={css.Videos}>
                    {
                        modelVideos.map((video, index) => {
                            const isActive = hasPaid || (!hasPaid && index === 0);

                            return (
                                <video
                                    key={index}
                                    src={video.url}
                                    className={isActive ? css.activePhoto : css.BlurredPhoto}
                                    onClick={() => {
                                        if (isActive) {
                                            setpreviewPhotoClassname("PhotoPreview");
                                            setPhotoUrl(video.url);
                                        }
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
            <div className={css[previewPhotoClassname]}>
                <div className={css.Close} onClick={() => {
                    setpreviewPhotoClassname("HidePhotoPreview");
                }}>
                    <i class="uil uil-multiply"></i>
                </div>
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
        </div>
    )
}

export default MobileDetails