import React, { useState, useRef, useEffect, useContext } from "react";
import css from "./Chats.module.css";
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
import { useNavigate } from "react-router-dom";
import Loadingwidget from "../../Components/Loadingwidget/Loadingwidget";
import { useMenu } from "../../Components/NavigationBar/Menucontext";

const Chats = () => {
  const { socket } = useContext(AuthContext);
  const navigate = useNavigate();
  const { activeIndex, setActiveIndex } = useMenu();
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [isMessagesLoading, setisMessagesLoading] = useState(true);
  const [uploadFile, setuploadFile] = useState("");
  const [uploadFirebaseFile, setuploadFirebaseFile] = useState(null);
  const [iseSendingMessage, setIsSendingMessage] = useState(false);
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
  const [conversationUuid, setconversationUuid] = useState("");
  const [chattingMemberUserId, setchattingMemberUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  dayjs.extend(relativeTime);
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  const CardConversation = ({
    profile,
    username,
    lastmessage,
    timestamp,
    onCardClicked,
  }) => {
    const timeAgo = dayjs(timestamp).fromNow();
    return (
      <div className={css.ConversationCard} onClick={onCardClicked}>
        <div className={css.ChatProfileDetails}>
          <img src={profile} alt="ConvoPhoto" />
          <div className={css.ConvoChatDetails}>
            <span>{username}</span>
            <span>{lastmessage}</span>
          </div>
        </div>
        <div className={css.Timestamp}>
          <span>{timeAgo}</span>
        </div>
      </div>
    );
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
    setisLoading(true);
    setActiveIndex(0);
    const fetchData = async () => {
      const data = await FetchConversations();
      setConversations(data.Conversations);
      setisLoading(false);
    };
    fetchData();
  }, []);
  const handleReceiveMessage = (data) => {
    setMessages((prev) => addUniqueMessage(prev, data));
    const messagePreview =
      data.type === "photo"
        ? "📷 Photo"
        : data.type === "video"
        ? "🎥 Video"
        : data.text;

    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        String(conv.conversationUuid) === String(data.conversationId)
          ? { ...conv, lastmessage: messagePreview }
          : conv
      )
    );
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
      const response = await SendMessage(
        conversationUuid,
        text,
        uploadFirebaseFile,
        (progress) => {
          setProgress(progress);
          if (progress === 100) {
            setPreviewFile(null);
            setpreviewPhotoClassname("HidePhotoPreview");
            setPhotoUrl("");
          }
        }
      );

      if (response.status === 201) {
        const sentMessage = response.sentMessage;
        socket.emit("SentMessage", { chattingMemberUserId, sentMessage });
        setMessages((prev) => [...prev, sentMessage]);
        setText("");

        const messagePreview =
          sentMessage.type === "photo"
            ? "📷 Photo"
            : sentMessage.type === "video"
            ? "🎥 Video"
            : sentMessage.text;

        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            String(conv.conversationUuid) === String(sentMessage.conversationId)
              ? { ...conv, lastmessage: messagePreview }
              : conv
          )
        );
        setPreviewFile(null);
        setProgress(0);
        setpreviewPhotoClassname("HidePhotoPreview");
        setPhotoUrl("");
        setIsSendingMessage(false);
      } else {
        setProgress(0);
        setpreviewPhotoClassname("HidePhotoPreview");
        setPhotoUrl("");
        setPreviewFile(null);
        toast(response.statusText);
      }
    } catch (error) {
      setProgress(0);
      setpreviewPhotoClassname("HidePhotoPreview");
      setPhotoUrl("");
      setPreviewFile(null);
      toast(error.response?.data?.message || "Something went wrong");
    }
  };
  const fetchMessages = async (conversationId) => {
    try {
      setisMessagesLoading(true);
      const response = await FetchMessages(conversationId);
      setMessages(response.Messages);
      setisMessagesLoading(false);
    } catch (error) {
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

  if (isLoading) {
    return <Loadingwidget />;
  }
  return (
    <div className={css.Frame}>
      {/* Outer Row */}
      <div className={css.FrameRows}>
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

        {/* Chatlist Section */}
        <div className={css.ChatsList}>
          <div className={css.SearchArea}>
            <i class="uil uil-search"></i>
            <input type="text" name="" id="" placeholder="Search..." />
          </div>
          <div className={css.Conversations}>
            {conversations &&
              conversations.map((convo, index) => {
                // to replace with firebase context
                const currentUser = JSON.parse(
                  localStorage.getItem("userData")
                );
                const otherMember = convo.members.find(
                  (member) => member.userId !== currentUser._id
                );
                return (
                  <CardConversation
                    key={index}
                    index={index}
                    onCardClicked={() => {
                      setModel(otherMember);
                      setlastSeen(convo.updatedAt);
                      setchattingMemberUserId(otherMember.userId);
                      setconversationUuid(convo.conversationUuid);
                      fetchMessages(convo.conversationUuid);
                      if (window.innerWidth <= 1024) {
                        navigate(
                          `/messages/${convo.conversationUuid}/${otherMember.name}/${otherMember.userId}`
                        );
                        setActiveIndex(10);
                      }
                    }}
                    profile={otherMember?.profile}
                    username={otherMember?.name}
                    lastmessage={convo.lastmessage}
                    timestamp={convo.updatedAt}
                  />
                );
              })}
          </div>
        </div>
        {/* Chat Area Section: IF No message seleted in desktop view show nothing */}
        {model === null ? (
          <div className={css.EmptyChatSection}>
            <span>Start a chat: Choose a user on the left.</span>
          </div>
        ) : isMessagesLoading ? (
          <Loadingwidget />
        ) : (
          <div className={css.ChatAreaSection}>
            <div className={css.ChatNavigation}>
              <div className={css.ChatUserDetails}>
                <span>{model.name}</span>
                <span>Last seen {dayjs(lastSeen).fromNow()}</span>
              </div>
              <div className={css.QuickActions}>
                <i class="uil uil-search"></i>
                <div className={css.More}>
                  <i class="uil uil-trash-alt"></i>
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

              <div className={css.FileInputRow}>
                <div
                  className={css.ItemOne}
                  onClick={() => triggerFileInput(true)}
                >
                  <i className="uil uil-image-plus"></i>
                </div>
                <div
                  className={css.ItemOne}
                  onClick={() => triggerFileInput(false)}
                >
                  <i className="uil uil-video"></i>
                </div>
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
        )}
      </div>
    </div>
  );
};

export default Chats;
