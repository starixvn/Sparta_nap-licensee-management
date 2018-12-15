import React, { Component } from 'react';
import Popup from './Popup';

export default class RedmineConfirmForm extends Component {
    constructor(props) {
        super(props);

        this.state = { redmineId: '' };
    };

    get isValid() {
        const redmineId = this.state.redmineId;

        return redmineId !== null && redmineId.length > 0;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isShow !== this.props.isShow && !this.props.isShow) {
            this.setState({ redmineId: '' });
        }
    }

    _onConfirm(value, onConfirm){
        const redmineId = value ? this.state.redmineId : null;

        onConfirm && onConfirm(redmineId);
    }

    _buildContent(msg, redmineId, onConfirm) {
        return (
            <div className='edit-form'>
                <div style={{marginBottom: '10px'}}>
                    {msg}
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Redmine Id</label>
                    <input className={`full-width ${redmineId ? '' : 'has-error'}`}
                        type='text'
                        value={redmineId}
                        onChange={(e) => this.setState({ redmineId: e.target.value })} />
                </div>
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={() => this._onConfirm(true, onConfirm)} disabled={!this.isValid}>
                        Yes
                    </button>
                    <button className='btn btn-red' onClick={() => this._onConfirm(false, onConfirm)}>
                        No
                    </button>
                </div>
            </div>
        );
    }

    render()
    {
        const { redmineId } = this.state;
        const { isShow, msg, style, onConfirm } = this.props;

        return (
        <div>
            <Popup isShow={isShow}
                title='Confirmation'
                content={this._buildContent(msg, redmineId, onConfirm)}
                className='no-scroll'
                noShowCloseButton={true}
                style={style} />
        </div>
        );
    }
}