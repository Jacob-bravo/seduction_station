import React from 'react'
import css from "./Message.module.css"
import dayjs from "dayjs";


const Message = ({ senderId, messageType, message, timestamp, reaction }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isSender = userData?._id === senderId;
  const formattedTime = dayjs(timestamp).format("h:mm A");


  const TextMessage = ({ text, reactiontext, timestamptext }) => {
    return <div className={isSender ? css.SenderMessageCard : css.ReceiverMessageCard}>
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
  }

  return (
    <div className={css.Frame}>
      {
        messageType === "text" ? <TextMessage text={message} timestamptext={formattedTime} reactiontext={reaction} /> : <div className={css.ErrorMessage}>
          <span className={css.ErrorLoadingMessage}>This message might take a while to load. Please wait</span>
        </div>
      }

    </div>
  )
}

export default Message