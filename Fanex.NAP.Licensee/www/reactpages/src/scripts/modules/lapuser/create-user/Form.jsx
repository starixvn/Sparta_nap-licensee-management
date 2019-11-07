import ConfirmBox from '../../../components/ConfirmBox';
import React, { Component } from 'react';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowConfirmBox: false,
            password: '',
            isShowMessage: false
        };
    }

    _getParams() {
        return {
            criteria: {
                siteName: defaultState.siteName,
                userID: defaultState.userID
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

    _renderInput(label, value, disabled, readonly) {
        return (
            <div className='form-group row'>
                <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>{label}</label>
                <div className='col-sm-12 col-md-5'>
                    <input type='text' className='full-width' value={value} disabled={disabled} readOnly={readonly} />
                </div>
            </div>
        )
    }

    _submit() {
        const url = 'LAPUserManagement/AddNewUser';
        const params = this._getParams();

        Site.fetchData(params, url)
            .then(response => {
                if (response.data.IsSuccess) {
                    this.setState({
                        password: response.data.Data,
                        isShowMessage: true
                    });
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
        const { isShowConfirmBox, password, isShowMessage } = this.state;

        if (!defaultState.isValid) {
            return <b className='red'>This username is not exist but cannot be created in this case!</b>;
        }

        if (defaultState.isExist) {
            return <b className='red'>This username already exists!</b>;
        }

        return (
            <div>
                <div className='add-form'>
                    <div className='row'>
                        <div className='col-xs-12'>
                            <div className='form-group row'>
                                <div className='col-sm-12 col-lg-2 col-md-3 col-form-label'></div>
                                <div className='col-sm-12 col-md-5'>
                                    <p>The <b>{defaultState.userID}</b> is not exist. If you want to create this username, please click the button "Submit" bellow.</p>
                                </div>
                            </div>
                            {this._renderInput('Site Name', defaultState.siteName, true)}
                            {this._renderInput('User ID', defaultState.userID, true)}
                            {password.trim() == "" ?
                                this._renderInput('User password', password, true, false) :
                                this._renderInput('User password', password, false, true)
                            }
                            <div className='form-group row'>
                                <div className="col-lg-12">
                                    {isShowMessage &&
                                        (
                                            <div className='form-group row'>
                                                <div className='col-sm-12 col-lg-2 col-md-3 col-form-label'></div>
                                                <div className='col-sm-12 col-md-5'>
                                                    <p>Make sure you copy it now, you won't be able to see it again</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
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