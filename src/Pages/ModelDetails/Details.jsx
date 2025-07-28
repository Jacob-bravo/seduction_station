import React, { useState } from 'react'
import css from "./Details.module.css"
import { useParams } from "react-router-dom";
import { Model_Photos } from '../../Data';
import { useNavigate } from 'react-router-dom';

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [photoUrl, setPhotoUrl] = useState(Model_Photos[1])
    const [previewPhotoClassname, setpreviewPhotoClassname] = useState("HidePhotoPreview")
    const [hasPaid, setHasPaid] = useState(false)
    const ServiceCard = ({ ServiceHeader, ServiceTagline, price, className, onClick }) => {
        return <div className={css[className]} onClick={onClick}>
            <span>{ServiceHeader}</span>
            <span>{ServiceTagline} <span className={css.servicePrice}>${price}</span></span>
        </div>
    }
    const HandleMobileViewNavigation = (id) => {
        if (id === 5) {
            setHasPaid(true);
        } else {
            navigate(`/model/media/${id}`)
        }

    }

    return (
        <div className={css.Frame}>
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
            <div className={css.Preview}>
                <img src={Model_Photos[0]} alt="modelphotoMobile" />
                <div className={css.Title}>
                    <span>Luna Star</span>
                    <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed, ea?</span>
                </div>
                <div className={css.Services}>
                    <span className={css.ServicesTitle}>Services:</span>
                    <ServiceCard className={"service"} ServiceHeader={"Photos"} ServiceTagline={"High-quality personal photos. Price"} price={"10"} onClick={() => HandleMobileViewNavigation(5)} />
                    <ServiceCard className={"Mobileservice"} ServiceHeader={"Photos"} ServiceTagline={"High-quality personal photos. Price"} price={"10"} onClick={() => HandleMobileViewNavigation(0)} />
                    <ServiceCard className={"service"} ServiceHeader={"Videos"} ServiceTagline={"Custom video content. Price:"} price={"20"} onClick={() => HandleMobileViewNavigation(5)} />
                    <ServiceCard className={"Mobileservice"} ServiceHeader={"Videos"} ServiceTagline={"Custom video content. Price:"} price={"20"} onClick={() => HandleMobileViewNavigation(1)} />
                    <ServiceCard className={"service"} ServiceHeader={"Sexting"} ServiceTagline={"Private text sessions. Price:"} price={"50"} onClick={() => HandleMobileViewNavigation(5)} />
                    <ServiceCard className={"Mobileservice"} ServiceHeader={"Sexting"} ServiceTagline={"Private text sessions. Price:"} price={"50"} onClick={() => HandleMobileViewNavigation(2)} />
                </div>
                <div className={css.PaymentMethods}>
                    <span className={css.ServicesTitle}>Payment Method:</span>
                    <div className={css.PaymentService}>
                        <div></div>
                        <span>Paypal</span>
                    </div>
                    <div className={css.PaymentService}>
                        <div></div>
                        <span>Card</span>
                    </div>
                </div>
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

export default Details