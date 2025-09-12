import React, { useState, useRef, useEffect, useContext } from "react";
import css from "./MobileChats.module.css";
import Message from "../../Components/MessageCard/Message";
import {
  SendMessage,
  FetchMessages,
  FetchConversations,
} from "../../ReactQuery/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import relativeTime from "dayjs/plugin/relativeTime";
import { AuthContext } from "../../AuthContext/AuthContext";
import { useParams } from "react-router-dom";

const MobileChats = () => {
  const { socket } = useContext(AuthContext);
  const { conversationId, username, chattingMemberUserId } = useParams();
  const [uploadFile, setuploadFile] = useState("");
  const [iseSendingMessage, setIsSendingMessage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadFirebaseFile, setuploadFirebaseFile] = useState(null);
  const [isPhotos, setIsPhotos] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const containerRef = useRef(null);
  const [previewPhotoClassname, setpreviewPhotoClassname] =
    useState("HidePhotoPreview");
  const [isPreviewPhoto, setisPreviewPhoto] = useState(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const mediaFileInputRef = useRef(null);
  const [lastSeen, setlastSeen] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  dayjs.extend(relativeTime);
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const addUniqueMessage = (prevMessages, newMessage) => {
    const isDuplicate = prevMessages.some((msg) => {
      return msg._id && newMessage._id
        ? msg._id === newMessage._id
        : msg.text === newMessage.text &&
            msg.senderId === newMessage.senderId &&
            msg.createdAt === newMessage.createdAt;
    });

    return isDuplicate ? prevMessages : [...prevMessages, newMessage];
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await FetchMessages(conversationId);
        setMessages(response.Messages);
      } catch (error) {
        toast(error.response?.data?.message || "Something went wrong");
      }
    };
    fetchMessages();
  }, []);
  const handleReceiveMessage = (data) => {
    setMessages((prev) => addUniqueMessage(prev, data));
  };
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);
  const SendNewMessage = async () => {
    try {
      setIsSendingMessage(true);
      const response = await SendMessage(
        conversationId,
        text,
        uploadFirebaseFile,
        (progress) => {
          setProgress(progress);
          if (progress === 100) {
            setPreviewFile(null);
            
          }
        }
      );
      if (response.status === 201) {
        const sentMessage = response.sentMessage;
        socket.emit("SentMessage", { chattingMemberUserId, sentMessage });
        setMessages((prev) => [...prev, response.sentMessage]);
        setText("");
        setPreviewFile(null);
        setProgress(0);
        setIsSendingMessage(false);
      } else {
        setIsSendingMessage(false);
        setPreviewFile(null);
        toast(response.statusText);
      }
    } catch (error) {
      setIsSendingMessage(false);
      setPreviewFile(null);
      toast(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMediaFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    setuploadFile(imageURL);
    setPreviewFile("flex");
    setuploadFirebaseFile(file);
    try {
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const triggerFileInput = (isPhoto) => {
    setIsPhotos(isPhoto);
    const acceptType = isPhoto ? "image/*" : "video/*";
    mediaFileInputRef.current.setAttribute("accept", acceptType);
    mediaFileInputRef.current?.click();
  };

  return (
    <div className={css.Frame}>
      {/* previewMediaDiv */}
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

          {isPreviewPhoto ? (
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
      <div className={css.ChatAreaSection}>
        <div className={css.ChatNavigation}>
          <div className={css.ChatUserDetails}>
            <span>{username}</span>
          </div>
          <div className={css.QuickActions}>
            <i class="uil uil-search"></i>
            <div className={css.More}>
              <i class="uil uil-ellipsis-v"></i>
            </div>
          </div>
        </div>

        <div className={css.MessagesArea} ref={containerRef}>
          {messages
            ?.slice()
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((text, index) => (
              <Message
                key={text._id || index}
                senderId={text.senderId}
                message={text.text}
                timestamp={text.createdAt}
                messageType={text.type}
                reaction={text.fileText}
                Videothumbnail={text.thumbnail}
                onClick={() => {
                  if (text.type === "photo") {
                    setPhotoUrl(text.fileText);
                    setisPreviewPhoto(true);
                    setpreviewPhotoClassname("PhotoPreview");
                  } else if (text.type === "video") {
                    setisPreviewPhoto(false);
                    setPhotoUrl(text.fileText);
                    setpreviewPhotoClassname("PhotoPreview");
                  }
                }}
              />
            ))}
        </div>

        <div className={css.InputMessageArea}>
          <div
            className={css.PreviewUploadFile}
            style={{ display: previewFile ? "flex" : "none" }}
          >
            <div
              className={css.Discard}
              onClick={() => {
                setPreviewFile(null);
                setuploadFirebaseFile(null);
              }}
            >
              <i className="uil uil-multiply"></i>
            </div>

            {isPhotos ? (
              <img src={uploadFile} alt="uploadfile" />
            ) : (
              <video src={uploadFile} controls width="100%" />
            )}
            {progress < 100 && (
              <div className={css.UploadProgress}>
                <div className={css.ProgressBar}>
                  <div
                    className={css.ProgressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>{progress.toFixed(0)}%</span>
              </div>
            )}
          </div>

          <input
            type="file"
            style={{ display: "none" }}
            ref={mediaFileInputRef}
            onChange={handleMediaFileSelect}
          />
          <input
            type="text"
            placeholder="Your message"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim() !== "") {
                if (!iseSendingMessage) {
                  SendNewMessage();
                }
              }
            }}
          />
          <div className={css.FileInputRow}>
            <div className={css.ItemOne} onClick={() => triggerFileInput(true)}>
              <i className="uil uil-image-plus"></i>
            </div>
            <div
              className={css.ItemOne}
              onClick={() => triggerFileInput(false)}
            >
              <i className="uil uil-video"></i>
            </div>
          </div>
          <div
            className={css.ItemOne}
            onClick={() => {
              if (!iseSendingMessage) {
                SendNewMessage();
              }
            }}
          >
            <i className="uil uil-message"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileChats;
