import React from 'react';
import { StatusStorage } from './constant/grid';

export const Status = props => {
    const status = StatusStorage[props.status];
    return (
        <div className={`status ${status.style}`}>{status.message}</div>
    );
};