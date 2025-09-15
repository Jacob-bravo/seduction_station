import React, { useState, useEffect } from "react";
import css from "./Details.module.css";
import { useParams } from "react-router-dom";
import { Model_Photos } from "../../Data";
import { useNavigate } from "react-router-dom";
import {
  FetchModel,
  initiatePayment,
  newConversation,
  CheckPaidStatus,
} from "../../ReactQuery/api";
import { toast } from "react-toastify";
import Loadingwidget from "../../Components/Loadingwidget/Loadingwidget";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState({});
  const [isLoading, setisLoading] = useState(true);
  const [paymentLoading, setpaymentLoading] = useState(false);
  const [isPhotos, setIsPhotos] = useState(true);
  const [media, setMedia] = useState([]);
  const [photoUrl, setPhotoUrl] = useState(Model_Photos[1]);
  const [previewPhotoClassname, setpreviewPhotoClassname] =
    useState("HidePhotoPreview");
  const [hasPaid, setHasPaid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      switch (true) {
        case window.innerWidth <= 768: // mobile
          setIsMobile(true);
          break;

        case window.innerWidth <= 1024: // tablet
          setIsMobile(false);
          break;

        default: // desktop
          setIsMobile(false);
          break;
      }
    };

    // run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const ServiceCard = ({ ServiceHeader, Services, className, onClick }) => {
    return (
      <div className={css[className]} onClick={onClick}>
        <span className={css.ServiceHeaderTT}>{ServiceHeader}</span>
        {Services &&
          Services.slice(1).map((service, index) => {
            return <span key={index + 1}>{service}</span>;
          })}
      </div>
    );
  };
  const HandleMobileViewNavigation = async (indexId, index) => {
    if (!hasPaid) {
      toast(
        "Unlock all her content photos, videos, and direct messaging for just $1."
      );
      return;
    }
    if (indexId === 5) {
      if (index === 3 && hasPaid) {
        const receiverData = {
          userId: model._id,
          name: model.username,
          profile: model.profileimage || "",
        };
        try {
          const response = await newConversation(receiverData);
          if (response.status === 201) {
            navigate("/messages");
          } else {
            navigate("/messages");
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
        };
        try {
          const response = await newConversation(receiverData);
          if (response.status === 201) {
            navigate("/messages");
          } else {
            // conversation exist navigate and toast
            navigate("/messages");
          }
        } catch (error) {
          toast(error.response?.data?.message || "Something went wrong");
        }
      } else {
        if (hasPaid) {
          navigate(`/model/media/${id}/${index}`);
        }
      }
    }
  };
  useEffect(() => {
    setisLoading(true);
    const fetchUserData = async () => {
      try {
        const response = await FetchModel(id);
        if (response.status === 200) {
          setModel(response.model);
          const { Photos, Videos } = response.model;
          const combined = [
            ...Photos.map((p) => ({ type: "photo", url: p.url })),
            ...Videos.map((v) => ({ type: "video", url: v.url })),
          ];
          setMedia(combined);
          setisLoading(false);
        }
      } catch (error) {
        toast(error.response?.data?.message || "Something went wrong");
      }
    };
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
    };
    fetchUserData();
    fetchPaidStatusData();
  }, [id]);

  const handlePayment = async () => {
    try {
      if (hasPaid) {
        toast("Payment exist. Enjoy");
        return;
      }
      setpaymentLoading(true);
      const response = await initiatePayment("1", model._id);
      if (response.status === 201) {
        window.location.href = response.approvalUrl;
        setpaymentLoading(false);
      }
    } catch (error) {}
  };

  if (isLoading) {
    return <Loadingwidget />;
  }

  return !isMobile ? (
    <div className={css.Frame}>
      <div className={css.modelContent}>
        {media.map((item, index) => {
          if (item.type === "photo") {
            return (
              <img
                key={`photo-${index}`}
                src={item.url}
                alt="modelphoto"
                className={css.activePhoto}
                onClick={() => {
                  setIsPhotos(true);
                  setpreviewPhotoClassname("PhotoPreview");
                  setPhotoUrl(item.url);
                }}
              />
            );
          }

          if (item.type === "video") {
            return (
              <video
                key={`video-${index}`}
                src={item.url}
                className={css.activePhoto}
                onClick={() => {
                  setIsPhotos(false);
                  setpreviewPhotoClassname("PhotoPreview");
                  setPhotoUrl(item.url);
                }}
                muted
                loop
                playsInline
                preload="metadata"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            );
          }

          return null;
        })}
      </div>

      <div className={css.Preview}>
        <img src={model.profileimage} alt="modelphotoMobile" />
        <div className={css.Title}>
          <span>{model.username}</span>
          <span>{model.about}</span>
        </div>
        <div className={css.Services}>
          <span className={css.ServicesTitle}>Services:</span>
          {(model?.services || []).map((modelService, index) => (
            <ServiceCard
              key={index}
              className={"selectedservice"}
              ServiceHeader={modelService[0]}
              Services={modelService}
              price={""}
              onClick={() => HandleMobileViewNavigation(5, 0)}
            />
          ))}
        </div>
        <div className={css.PaymentMethods}>
          <div className={css.Paybutton}>
            {hasPaid ? (
              <div
                className={css.chartButton}
                onClick={() => HandleMobileViewNavigation(5, 3)}
              >
                <span>Your chat is unlocked:Start chatting</span>
              </div>
            ) : (
              <div className={css.AccessContent}>
                <i class="uil uil-paypal"></i>
                {paymentLoading ? (
                  <Loadingwidget />
                ) : (
                  <div
                    className={css.Paybutton}
                    onClick={() => handlePayment()}
                  >
                    Pay $1 to start chatting
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={css[previewPhotoClassname]}>
        {photoUrl && (
          <div className={css[previewPhotoClassname]}>
            <div
              className={css.Close}
              onClick={() => {
                setpreviewPhotoClassname("HidePhotoPreview");
                setPhotoUrl("");
              }}
            >
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
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className={css.MobileFrame}>
      <div className={css.MobileProfile}>
        <img src={model.profileimage} alt="modelphotoMobile" />
        <div className={css.Title}>
          <span>{model.username}</span>
          <span>{model.about}</span>
        </div>
        <div className={css.Services}>
          <span className={css.ServicesTitle}>Services:</span>
          {(model?.services || []).map((modelService, index) => (
            <ServiceCard
              key={index}
              className={"selectedservice"}
              ServiceHeader={modelService[0]}
              Services={modelService}
              price={""}
              onClick={() => HandleMobileViewNavigation(5, 0)}
            />
          ))}
          <span className={css.ServicesTitle}>Sneak Pics</span>
        </div>
      </div>
      <div className={css.modelContent}>
        {media.map((item, index) => {
          if (item.type === "photo") {
            return (
              <img
                key={`photo-${index}`}
                src={item.url}
                alt="modelphoto"
                className={css.activePhoto}
                onClick={() => {
                  setIsPhotos(true);
                  setpreviewPhotoClassname("PhotoPreview");
                  setPhotoUrl(item.url);
                }}
              />
            );
          }

          if (item.type === "video") {
            return (
              <div className={css.Modelvideo}>
                <video
                  key={`video-${index}`}
                  src={item.url}
                  className={css.activePhoto}
                  onClick={() => {
                    setIsPhotos(false);
                    setpreviewPhotoClassname("PhotoPreview");
                    setPhotoUrl(item.url);
                  }}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
                <div className={css.playButton}>
                  <i class="uil uil-video"></i>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
      <div className={css[previewPhotoClassname]}>
        {photoUrl && (
          <div className={css[previewPhotoClassname]}>
            <div
              className={css.Close}
              onClick={() => {
                setpreviewPhotoClassname("HidePhotoPreview");
                setPhotoUrl("");
              }}
            >
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
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
          </div>
        )}
      </div>
      <div className={css.PaybuttonMobile}>
        {hasPaid ? (
          <div
            className={css.chartButton}
            onClick={() => HandleMobileViewNavigation(5, 3)}
          >
            <span>Your chat is unlocked:Start chatting</span>
          </div>
        ) : (
          <div className={css.AccessContent}>
            <i class="uil uil-paypal"></i>
            {paymentLoading ? (
              <Loadingwidget />
            ) : (
              <div className={css.Paybutton} onClick={() => handlePayment()}>
                Pay $1 to start chatting
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
