import React from 'react';
import './messages.css';
import Message from '../message/message';
import ScrollToBottom from 'react-scroll-to-bottom';


const Messages = ({messages,name}) =>(
    <ScrollToBottom className="messages">
        {messages.map((message,i)=> <div key={i}><Message message={message} name={name}/></div>)}
    </ScrollToBottom>

    
);
export default Messages;  