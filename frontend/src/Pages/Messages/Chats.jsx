import React, { useState } from 'react'
import css from "./Chats.module.css"
import { Conversations, Messages } from '../../Data'
import Message from '../../Components/MessageCard/Message'
import { useGetConversations } from '../../ReactQuery/queriesAndMutations'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const Chats = () => {
    const [model, setModel] = useState(null)
    const [lastSeen, setlastSeen] = useState("")
    const [messages, setMessages] = useState([])
    const {
        data,
        error,
    } = useGetConversations();
    dayjs.extend(relativeTime);
    const CardConversation = ({ profile, username, lastmessage, timestamp, onCardClicked }) => {
        const timeAgo = dayjs(timestamp).fromNow();
        return <div className={css.ConversationCard} onClick={onCardClicked}>
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
                            data && data.map((convo, index) => {
                                const otherMember = convo.members[1];
                                return (
                                    <CardConversation
                                        key={index}
                                        index={index}
                                        onCardClicked={() => {
                                            setModel(otherMember);
                                            setlastSeen(convo.updatedAt)
                                        }}
                                        profile={otherMember?.profile}
                                        username={otherMember?.name}
                                        lastmessage={convo.lastmessage}
                                        timestamp={convo.updatedAt}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
                {/* Chat Area Section: IF No message seleted in desktop view show nothing */}
                {
                    model === null ? <div className={css.EmptyChatSection}>
                        <span>Start a chat: Choose a user on the left.</span>
                    </div> : <div className={css.ChatAreaSection}>
                        <div className={css.ChatNavigation}>
                            <div className={css.ChatUserDetails}>
                                <span>{model.name}</span>
                                <span>Last seen {dayjs(lastSeen).fromNow()}</span>
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
                }

            </div>
        </div>
    )
}

export default Chats