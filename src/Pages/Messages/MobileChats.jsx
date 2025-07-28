import React from 'react'
import css from "./MobileChats.module.css"
import { Messages } from '../../Data'
import Message from '../../Components/MessageCard/Message'

const MobileChats = () => {
    return (
<div className={css.Frame}>
    
    
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

    )
}

export default MobileChats