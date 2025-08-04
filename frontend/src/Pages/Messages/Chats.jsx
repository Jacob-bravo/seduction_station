import React, { useState, useRef, useEffect } from 'react'
import css from "./Chats.module.css"
import { Messages } from '../../Data'
import Message from '../../Components/MessageCard/Message'
import { useGetConversations } from '../../ReactQuery/queriesAndMutations'
import { SendMessage, FetchMessages } from '../../ReactQuery/api'
import dayjs from 'dayjs';
import { toast } from "react-toastify";
import relativeTime from 'dayjs/plugin/relativeTime';

const Chats = () => {
    const [model, setModel] = useState(null)
    const containerRef = useRef(null);
    const [lastSeen, setlastSeen] = useState("")
    const [text, setText] = useState("");
    const [conversationUuid, setconversationUuid] = useState("");
    const [messages, setMessages] = useState([])
    const {
        data,
        error,
    } = useGetConversations();
    dayjs.extend(relativeTime);
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };
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
    const SendNewMessage = async () => {
        try {
            const response = await SendMessage(conversationUuid, text);
            if (response.status === 201) {
                setMessages(prev => [...prev, response.sentMessage]);
                setText("");
            } else {
                toast(response.statusText);
            }
        } catch (error) {
            toast(error.response?.data?.message || "Something went wrong");

        }
    }
    const fetchMessages = async (conversationId) => {
        try {
            const response = await FetchMessages(conversationId);
            setMessages(response.Messages);
        } catch (error) {
            toast(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    return (
        <div className={css.Frame}>
            {/* Outer Row */}
            <div className={css.FrameRows}>
                {/* Chatlist Section */}
                <div className={css.ChatsList}>
                    <div className={css.SearchArea}>
                        <i class="uil uil-search"></i>
                        <input type="text" name="" id="" placeholder='Search...' />
                        <i class="uil uil-trash-alt"></i>

                    </div>
                    <div className={css.Conversations}>
                        {
                            data && data.map((convo, index) => {
                                // to replace with firebase context
                                const currentUser = JSON.parse(localStorage.getItem("userData"));
                                const otherMember = convo.members.find(
                                    member => member.userId !== currentUser._id
                                );
                                console.log(otherMember)
                                return (
                                    <CardConversation
                                        key={index}
                                        index={index}
                                        onCardClicked={() => {
                                            setModel(otherMember);
                                            setlastSeen(convo.updatedAt);
                                            setconversationUuid(convo.conversationUuid);
                                            fetchMessages(convo.conversationUuid);

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
                                        />
                                    ))}
                            </div>
                        </div>
                        <div className={css.InputMessageArea}>
                            <i class="uil uil-link-add"></i>
                            <input
                                type="text"
                                placeholder="Your message"
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && text.trim() !== "") {
                                        SendNewMessage();
                                    }
                                }}
                            />
                            <i class="uil uil-message" onClick={() => SendNewMessage()}></i>
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default Chats