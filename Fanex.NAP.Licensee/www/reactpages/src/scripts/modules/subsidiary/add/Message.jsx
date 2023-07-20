import React from 'react';
import { MessageStatuses } from './constant/grid';

export const MessageBox = props => {
    const messages = props.messages;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return <div></div>;
    }

    return (
        <div>
            {messages.map(
                message => <Message key={message.status} status={message.status} params={message.params}/>)}
        </div>
    );
};

export const Message = props => {
    const status = MessageStatuses[props.status](props.params);
    return (
        <label className={status.style}>{status.message}</label>
    );
};