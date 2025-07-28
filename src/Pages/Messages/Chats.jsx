import React from 'react'
import css from "./Chats.module.css"
import { Conversations, Messages } from '../../Data'
import Message from '../../Components/MessageCard/Message'

const Chats = () => {
    const CardConversation = ({ profile, username, lastmessage, timestamp, index }) => {
        return <div className={index === 0 ? css.ActiveConversationCard : css.ConversationCard}>
            <div className={css.ChatProfileDetails}>
                <img src={profile} alt="ConvoPhoto" />
                <div className={css.ConvoChatDetails}>
                    <span>{username}</span>
                    <span>{lastmessage}</span>
                </div>
            </div>
            <div className={css.Timestamp}>
                <span>{timestamp}</span>
            </div>
        </div>
    }
    return (
        <div className={css.Frame}>
            {/* Outer Row */}
            <div className={css.FrameRows}>
                {/* Chatlist Section */}
                <div className={css.ChatsList}>
                    <div className={css.SearchArea}>
                        <i class="uil uil-search"></i>
                        <input type="text" name="" id="" placeholder='Search' />
                        <i class="uil uil-trash-alt"></i>

                    </div>
                    <div className={css.Conversations}>
                        {
                            Conversations.map((convo, index) => {
                                return <CardConversation index={index} profile={convo.photo} username={convo.username} lastmessage={convo.lastMessage} timestamp={convo.timestamp} key={index} />
                            })
                        }
                    </div>
                </div>
                {/* Chat Area Section */}
                <div className={css.ChatAreaSection}>
                    <div className={css.ChatNavigation}>
                        <div className={css.ChatUserDetails}>
                            <span>Jeniffer Lawrence</span>
                            <span>Last seen 2 minutes ago</span>
                        </div>
                        <div className={css.QuickActions}>
                            <i class="uil uil-search"></i>
                            <div className={css.More}>
                                <i class="uil uil-ellipsis-v"></i>
                            </div>
                        </div>
                    </div>
                    <div className={css.MessagesArea}>
                        {
                            Messages.map((text, index) => {
                                return <Message index={text.senderID} message={text.lastMessage} reaction={text.reaction} timestamp={text.timestamp} key={index} messageType={text.messageType} />
                            })
                        }
                    </div>
                    <div className={css.InputMessageArea}>
                        <i class="uil uil-link-add"></i>
                        <input type="text" placeholder='Your message' />
                        <i class="uil uil-message"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chats