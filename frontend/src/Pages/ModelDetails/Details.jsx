import React, { useState, useEffect } from 'react'
import css from "./Details.module.css"
import { useParams } from "react-router-dom";
import { Model_Photos } from '../../Data';
import { useNavigate } from 'react-router-dom';
import { FetchModel, initiatePayment, newConversation, CheckPaidStatus } from '../../ReactQuery/api';
import { toast } from "react-toastify";
import Loadingwidget from '../../Components/Loadingwidget/Loadingwidget';


const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [model, setModel] = useState({});
    const [isLoading, setisLoading] = useState(true);
    const [paymentLoading, setpaymentLoading] = useState(false);
    const [selectedService, setSelectedService] = useState('10');
    const [isPhotos, setIsPhotos] = useState(true);
    const [modelPhotos, setmodelPhotos] = useState([]);
    const [modelVideos, setmodelVideos] = useState([]);
    const [photoUrl, setPhotoUrl] = useState(Model_Photos[1])
    const [previewPhotoClassname, setpreviewPhotoClassname] = useState("HidePhotoPreview")
    const [hasPaid, setHasPaid] = useState(false)
    const ServiceCard = ({ ServiceHeader, ServiceTagline, price, className, onClick }) => {
        return <div className={css[className]} onClick={onClick}>
            <span>{ServiceHeader}</span>
            <span>{ServiceTagline} <span className={css.servicePrice}>${price}</span></span>
        </div>
    }
    const HandleMobileViewNavigation = async (indexId, index) => {
        if (indexId === 5) {
            if (index === 0) {
                setIsPhotos(true);
            } else if (index === 1) {
                setIsPhotos(false);
            } else if (index === 3 && hasPaid) {
                const receiverData = {
                    userId: model._id,
                    name: model.username,
                    profile: model.profileimage || "",
                }
                try {
                    const response = await newConversation(receiverData);
                    if (response.status === 201) {
                        navigate('/messages')
                    } else {
                        navigate('/messages')
                    }
                } catch (error) {
                    toast(error.response?.data?.message || "Something went wrong");


                }
            }

        } else {
            if (index === 3 && hasPaid) {
                const receiverData = {
                    userId: model._id,
                    name: model.username,
                    profile: model.profileimage || "",
                }
                try {
                    const response = await newConversation(receiverData);
                    if (response.status === 201) {
                        navigate('/messages')
                    } else {
                        // conversation exist navigate and toast
                        navigate('/messages')
                    }
                } catch (error) {
                    toast(error.response?.data?.message || "Something went wrong");


                }
            } else {
                if (hasPaid) {
                    navigate(`/model/media/${id}/${index}`)
                }

            }

        }

    }
    useEffect(() => {
        setisLoading(true);
        const fetchUserData = async () => {
            try {
                const response = await FetchModel(id);
                if (response.status === 200) {
                    setModel(response.model);
                    setmodelPhotos(response.model.Photos);
                    setmodelVideos(response.model.Videos);
                    setisLoading(false);
                }
            } catch (error) {
                toast(error.response?.data?.message || "Something went wrong");
            }
        }
        const fetchPaidStatusData = async () => {
            try {
                const response = await CheckPaidStatus(id);
                if (response.status === 200) {
                    setHasPaid(response.hasPaid);
                    setisLoading(false);
                }
            } catch (error) {
                toast(error.response?.data?.message || "Something went wrong");
                setisLoading(true);
            }
        }
        fetchUserData();
        fetchPaidStatusData();
    }, [id])

    const handlePayment = async () => {
        try {

            if (hasPaid) {
                toast("Payment exist. Enjoy")
                return
            }
            setpaymentLoading(true);
            const response = await initiatePayment(selectedService, model._id);
            if (response.status === 201) {
                window.location.href = response.approvalUrl;
                setpaymentLoading(false);
            }

        } catch (error) {

        }
    }

    if (isLoading) {
        return <Loadingwidget />
    }

    return (
        <div className={css.Frame}>
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

            <div className={css.Preview}>
                <img src={model.profileimage} alt="modelphotoMobile" />
                <div className={css.Title}>
                    <span>{model.username}</span>
                    <span>{model.about}</span>
                </div>
                <div className={css.Services}>
                    <span className={css.ServicesTitle}>Services:</span>
                    <ServiceCard className={isPhotos ? "selectedservice" : "service"} ServiceHeader={"Photos"} ServiceTagline={"High-quality personal photos. Price"} price={"10"} onClick={() => HandleMobileViewNavigation(5, 0)} />
                    <ServiceCard className={"Mobileservice"} ServiceHeader={"Photos"} ServiceTagline={"High-quality personal photos. Price"} price={"10"} onClick={() => HandleMobileViewNavigation(0, 8)} />
                    <ServiceCard className={!isPhotos ? "selectedservice" : "service"} ServiceHeader={"Videos"} ServiceTagline={"Custom video content. Price:"} price={"20"} onClick={() => HandleMobileViewNavigation(5, 1)} />
                    <ServiceCard className={"Mobileservice"} ServiceHeader={"Videos"} ServiceTagline={"Custom video content. Price:"} price={"20"} onClick={() => HandleMobileViewNavigation(0, 4)} />
                    <ServiceCard className={"service"} ServiceHeader={"Sexting"} ServiceTagline={"Private text sessions. Price:"} price={"50"} onClick={() => HandleMobileViewNavigation(5, 3)} />
                    <ServiceCard className={"Mobileservice"} ServiceHeader={"Sexting"} ServiceTagline={"Private text sessions. Price:"} price={"50"} onClick={() => HandleMobileViewNavigation(0, 3)} />
                </div>
                <div className={css.PaymentMethods}>
                    <span className={css.ServicesTitle}>Payment Method:</span>
                    <div className={css.PaymentService}>
                        <div></div>
                        <span>Paypal</span>
                    </div>
                    {
                        paymentLoading ? <Loadingwidget /> : <div className={css.Paybutton}>
                            <select name="service" id="" value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}>
                                <option value="10">Photos - $10</option>
                                <option value="25">Videos $25</option>
                                <option value="50">Sexting - $50</option>
                            </select>
                            <button onClick={() => handlePayment()}>Pay now</button>
                        </div>
                    }

                </div>
            </div>
            <div className={css[previewPhotoClassname]}>
                {photoUrl && (
                    <div className={css[previewPhotoClassname]}>
                        <div className={css.Close} onClick={() => {
                            setpreviewPhotoClassname("HidePhotoPreview");
                            setPhotoUrl("");
                        }}>
                            <i className="uil uil-multiply"></i>
                        </div>

                        {isPhotos ? (
                            <img src={photoUrl} alt="Preview" />
                        ) : (
                            <video
                                src={photoUrl}
                                autoPlay
                                playsInline
                                preload="metadata"
                                controls
                                controlsList="nodownload"
                                onContextMenu={e => e.preventDefault()}
                            />
                        )}
                    </div>
                )}


            </div>
        </div>
    )
}

export default Details