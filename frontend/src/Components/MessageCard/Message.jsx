import React from 'react'
import css from "./Message.module.css"

const Message = ({ index, messageType, message, timestamp, reaction }) => {


  const TextMessage = ({ index, text, reactiontext, timestamptext }) => {
    return <div className={index === 0 ? css.SenderMessageCard : css.ReceiverMessageCard}>
      <div className={index === 0 ? css.Message : css.ReceiverMessage}>
        <span>{text}</span>
      </div>
      <div className={css.MessageTimestamp}>
        {
          index === 0 ? <div className={css.Reaction}>{""}</div> : ""
        }
        <div className={css.TextTimestamp}>{timestamptext}</div>
      </div>
    </div>
  }

  return (
    <div className={css.Frame}>
      {
        messageType === 0 ? <TextMessage index={index} text={message} timestamptext={timestamp} reactiontext={reaction} /> : <div className={css.ErrorMessage}>
          <span className={css.ErrorLoadingMessage}>This message might take a while to load. Please wait</span>
        </div>
      }

    </div>
  )
}

export default Message