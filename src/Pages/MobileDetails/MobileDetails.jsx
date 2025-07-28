import React, { useState } from 'react'
import css from "./MobileDetails.module.css"
import { Model_Photos } from '../../Data'

const MobileDetails = () => {
    const [photoUrl, setPhotoUrl] = useState(Model_Photos[1])
    const [previewPhotoClassname, setpreviewPhotoClassname] = useState("HidePhotoPreview")
    const [hasPaid, setHasPaid] = useState(true)
    return (
        <div className={css.Frame}>
            <span>Luna Star</span>
            <div className={css.Photos}>
                {
                    Model_Photos.map((model, index) => {
                        const isActive = hasPaid || (!hasPaid && index === 0);

                        return (
                            <img
                                key={index}
                                src={model}
                                alt="modelphoto"
                                className={isActive ? css.activePhoto : css.BlurredPhoto}
                                onClick={() => {
                                    if (hasPaid || (!hasPaid && index === 0)) {
                                        setpreviewPhotoClassname("PhotoPreview");
                                        setPhotoUrl(model);
                                    }
                                }}
                            />
                        );
                    })
                }
            </div>
            <div className={css[previewPhotoClassname]}>
                <div className={css.Close} onClick={() => {
                    setpreviewPhotoClassname("HidePhotoPreview");
                }}>
                    <i class="uil uil-multiply"></i>
                </div>
                <img src={photoUrl} alt="DefaulPhotoUrlView" />
            </div>
        </div>
    )
}

export default MobileDetails