import React from 'react';
import ReactDOM from 'react-dom';

export default class Popup extends React.Component {
    constructor(props) {
        super(props);

        this.zIndex = props.zIndex ? props.zIndex : 50;
    };

    _onClose(callBack) {
        callBack && callBack();
    }

    render() {
        const { title, style, content, onClose, noShowCloseButton, isShow, className } = this.props;
        const combinedStyle = Object.assign({}, style, { zIndex: this.zIndex + 1 });

        return (
            <div className={`popup ${isShow ? 'show': ''}`}>
                { isShow && <div className='popup-block-body' style={{zIndex: this.zIndex}}></div> }         
                <div className={`popup-container ${className}`} style={combinedStyle}>
                    <div className='popup-title'>
                        <p>{title}</p>
                        { 
                            !noShowCloseButton 
                            && <a className="popup-close" href="javascript:;" onClick={() => this._onClose(onClose)}>&times;</a>
                        }
                    </div>
                    <div className='popup-content'>
                        {content}
                    </div>
                </div>
            </div>
        )
    }
};