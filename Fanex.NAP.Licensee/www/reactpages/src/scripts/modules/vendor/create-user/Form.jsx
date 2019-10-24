import React, { Component } from 'react';
import ConfirmBox from '../../../components/ConfirmBox';
import Site from '../../../lib/site';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowConfirmBox: false
        };
    }

    _getParams() {
        return {
            criteria: {
                siteName: defaultState.siteName,
                userID: defaultState.userID,
                userPWD: defaultState.userPWD
            }
        };
    }

    _handleSubmit = () => {
        this.setState({ isShowConfirmBox: true })
    }

    _showConfirmBox(isShow) {
        this.setState({ isShowConfirmBox: isShow });
    }

    onConfirm = (value) => {
        this._showConfirmBox(false);

        if (value) {
            this._submit();
        }
    }

    _renderInput(label, value, disabled) {
        return (
            <div className='form-group row'>
                <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>{label}</label>
                <div className='col-sm-12 col-md-5'>
                    <input type='text' className='full-width' defaultValue={value} disabled={disabled} />
                </div>
            </div>
        )
    }

    _submit() {
        const url = 'LicenseeVendor/AddNewUser';
        const params = this._getParams();

        Site.fetchData(params, url)
            .then(response => {
                if (response.data.IsSuccess) {
                    window.location.href = window.rootUrl + `LicenseeVendor/CreateToken?siteName=${defaultState.siteName}&userID=${defaultState.userID}`
                    if (response.data.Error) {
                        Utility.showWarningMessage(response.data.Error);
                    }
                }
                else {
                    Utility.showErrorMessage(response.data.Error);
                }
            }).catch(err => {
            });
    }

    render() {
        const { isShowConfirmBox } = this.state;

        return (
            <div>
                <div className='add-form'>
                    <div className='row'>
                        <div className='col-xs-12'>
                            <div className='form-group row'>
                                <div className='col-sm-12 col-lg-2 col-md-3 col-form-label'></div>
                                <div className='col-sm-12 col-md-5'>
                                    <p>User <b>{defaultState.userID}</b> is not exist in your system. If you want to create user <b>{defaultState.userID}</b>, please click the button "Submit" bellow.</p>
                                    <p><b>Note:</b> Please copy password if you want to create new user, you won't be able to see it again</p>
                                </div>
                            </div>
                            {this._renderInput('Site Name', defaultState.siteName, true)}
                            {this._renderInput('User ID', defaultState.userID, true)}
                            {this._renderInput('User password', defaultState.userPWD, true)}
                            <div className='form-group row col-sm-12'>
                                <button className="btn btn-primary" onClick={this._handleSubmit}>
                                    Submit
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmBox isShow={isShowConfirmBox}
                    title='Confirmation'
                    message='Do you want to add new user?'
                    style={{ height: '150px', width: '400px' }}
                    onClose={this.onConfirm} />
            </div>
        )
    }
}