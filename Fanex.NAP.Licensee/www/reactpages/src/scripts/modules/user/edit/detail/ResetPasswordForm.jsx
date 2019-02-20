import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from '../action';
import Site from '../../../../lib/site';
import Utility from '../../../../lib/utility';
import CryptoJS from 'crypto-js';

import Popup from '../../../../components/Popup';
import ConfirmBox from '../../../../components/ConfirmBox';
import NumericInput from '../../../../components/NumericInput';

export class ResetPasswordForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            token: '',
            redmineId: '',
            confirmPassword: '',
            isShowConfirmBox: false,
            isShow: false,
            isValidPass: false
        };
    }

    get isValid() {
        const { password, token, redmineId, confirmPassword, isValidPass } = this.state;

        return isValidPass && token && redmineId && password === confirmPassword;
    }

    onClick = () => {
        this.props.toggleLoader(true);
        const url = 'ITUserManagement/GetToken';

        Site.fetchData(null, url)
            .then(response => {
                this.setState({ token: response.data, isShow: true });
                this.props.toggleLoader(false);
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    onSubmit = () => {
        this._showConfirmBox(true);
    }

    onClose = () => {
        this.setState({ 
            password: '',
            token: '',
            redmineId: '',
            confirmPassword: '',
            isShow: false
        });
    }

    onConfirm = (value) => {
        this._showConfirmBox(false);

        if (value) {
            this._submit();
        }
    }

    onPasswordChange = (e) => {
        const pass = e.target.value;
        const isValidPass = Utility.validatePassword(pass);

        this.setState({ password: pass, isValidPass: isValidPass })
    }

    _showConfirmBox(isShow) {
        this.setState({ isShowConfirmBox: isShow });
    }

    _getParam() {
        const hashPass = CryptoJS.SHA1(this.state.password + this.state.token).toString(CryptoJS.enc.Hex).toUpperCase();

        return {
            UserId: this.props.user.UserId,
            Password: hashPass,
            Token: this.state.token,
            RedmineId: this.state.redmineId
        };
    }

    _submit() {
        this.props.toggleLoader(true);
        const url = 'ITUserManagement/ResetPassword';
        const params = this._getParam();
        Site.fetchData(params, url)
            .then(response => {                
                if (!response.data.IsSuccess) {
                    Utility.showErrorMessage(response.data.Error);
                }
                else {
                    Utility.showMessage('Success!');
                    this.onClose();
                }

                this.props.toggleLoader(false);
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    _buildContent(password, confirmPassword, redmineId, isValidPass) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>New Password</label>
                    <input type='password'
                        maxLength='50'
                        value={password}
                        className={`full-width ${isValidPass ? '' : 'has-error'}`}
                        onChange={this.onPasswordChange} />
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Confirm Password</label>
                    <input type='password'
                            maxLength='50'
                            value={confirmPassword}
                            className={`full-width ${confirmPassword === password ? '' : 'has-error'}`}
                            onChange={(e) => this.setState({ confirmPassword: e.target.value })} />
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Redmine Id</label>
                    <NumericInput className={`full-width ${redmineId ? '' : 'has-error'}`}
                        value={redmineId}
                        onChange={(value) => this.setState({ redmineId: value })} />
                </div>
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={this.onSubmit} disabled={!this.isValid}>
                        Submit
                    </button>
                    <button className='btn btn-red' onClick={this.onClose}>
                        Cancel
                    </button>
                </div>
            </div>    
        );
    }

    render() {
        const { password, confirmPassword, redmineId, isShowConfirmBox, isShow, isValidPass } = this.state;

        return (
        <div>
            <button className="btn btn-red" onClick={this.onClick}>Reset Password</button>
            <ConfirmBox isShow={isShowConfirmBox}
                        title='Confirmation'
                        message='Do you want to reset password of this user?'
                        style={{ height: '150px', width: '295px' }}
                        onClose={this.onConfirm} /> 
            <Popup isShow={isShow}
                title='Reset Password'
                content={this._buildContent(password, confirmPassword, redmineId, isValidPass)}
                className='no-scroll'
                style={{height: '305px', width: '520px'}}
                onClose={this.onClose} />
        </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm);