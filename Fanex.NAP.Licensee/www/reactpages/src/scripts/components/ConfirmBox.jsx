import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './Popup';

export default class ConfirmBox extends React.Component {
    constructor(props) {
        super(props);

        this.zIndex = props.zIndex ? props.zIndex : 60;
    };

    _onCick(value, callBack) {
        callBack && callBack(value);
    }

    _buildContent(msg, onClose) {
        return (
            <div className='confirm-popup'>
                <div className='form-group'>
                    {msg}
                </div>
                <div className='form-group'>
                    <button className='btn btn-red' onClick={() => this._onCick(false, onClose)}>
                        No
                    </button>
                    <button className='btn btn-primary' onClick={() => this._onCick(true, onClose)}>
                        Yes
                    </button>
                </div>
            </div>
        );
    }

    render() {
        const { title, message, isShow, onClose, style } = this.props;

        return (
            <Popup isShow={isShow}
                title={title}
                content={this._buildContent(message, onClose)}
                style={{height: '300px', width: '600px'}}
                noShowCloseButton={true}
                zIndex={this.zIndex} 
                style={style} />
        );
    }
};