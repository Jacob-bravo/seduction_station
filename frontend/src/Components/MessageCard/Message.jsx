import React from 'react'
import css from "./Message.module.css"
import dayjs from "dayjs";


const Message = ({ senderId, messageType, message, timestamp, reaction, Videothumbnail,onClick }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isSender = userData?._id === senderId;
  const formattedTime = dayjs(timestamp).format("h:mm A");


  const TextMessage = ({ text, timestamptext, type, fileText, thumbnail }) => {
    return (

      type === "text" ? <div className={isSender ? css.SenderMessageCard : css.ReceiverMessageCard}>
        <div className={isSender ? css.Message : css.ReceiverMessage}>
          <span>{text}</span>
        </div>
        <div className={css.MessageTimestamp}>
          {
            isSender ? <div className={css.Reaction}>{""}</div> : ""
          }
          <div className={css.TextTimestamp}>{timestamptext}</div>
        </div>
      </div>
        : type === "photo" ? <div className={isSender ? css.SenderMessageCard : css.ReceiverMessageCard}>
          <div className={isSender ? css.Message : css.ReceiverMessage}>
            <img src={fileText} alt="media" />
            <span>{text}</span>
          </div>
          <div className={css.MessageTimestamp}>
            {
              isSender ? <div className={css.Reaction}>{""}</div> : ""
            }
            <div className={css.TextTimestamp}>{timestamptext}</div>
          </div>
        </div> : <div className={isSender ? css.SenderMessageCard : css.ReceiverMessageCard}>
          <div className={isSender ? css.Message : css.ReceiverMessage}>
            <div className={css.VideoButton}>
              <i class="uil uil-play"></i>
            </div>
            <img src={thumbnail} alt="video" />
            <span>{text}</span>

          </div>
          <div className={css.MessageTimestamp}>
            {
              isSender ? <div className={css.Reaction}>{""}</div> : ""
            }
            <div className={css.TextTimestamp}>{timestamptext}</div>
          </div>
        </div>


    )
  }

  return (
    <div className={css.Frame}onClick={onClick}>
      <TextMessage text={message} timestamptext={formattedTime} fileText={reaction} type={messageType} thumbnail={Videothumbnail} />
    </div >
  )
}

export default Message