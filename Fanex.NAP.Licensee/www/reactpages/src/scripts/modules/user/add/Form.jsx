import React, { Component } from 'react';
import CryptoJS from 'crypto-js';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';
import Select from 'react-select';
import Utility from '../../../lib/utility';
import NumericInput from '../../../components/NumericInput';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redmineId: '',
            userName: '',
            firstName: '',
            lastName: '',
            email: '',
            isAdmin: false,
            isOpen: true,
            selectedLicensee: null,
            isLoading: false,
            password: '',
            licenseeList: defaultState.licenseeList,
            isValidPass: false,
            isSuccess: false,
            isShowOption: false,
            option: '0'
        };

        this.options = [
            { value: '0', label: 'Only add licensee'},
            { value: '1', label: 'Assign all currencies and functions, excluding "Account Management" and "Notification")' },
            { value: '2', label: 'Assign all currencies and functions, including "Account Management" and "Notification")' }
        ];
    }

    get isValid() {
        const { redmineId, userName, isValidPass, isSuccess, isAdmin, selectedLicensee } = this.state;

        return redmineId && userName && isValidPass && !isSuccess && (isAdmin || selectedLicensee);
    }

    onAdminCheck = (e) => {
        const licenseeList = this.state.licenseeList;

        if (e.target.checked) {
            this.setState({ licenseeList: [{ label: 'All', value: 0 }, ...licenseeList], isAdmin: true });
        }
        else {
            this.setState({ licenseeList: licenseeList.filter(x => x.value !== 0), isAdmin: false });
        }
    }

    onSubmit = () => {
        if (this.isValid) {
            const param = this._getParams();

            this._submit(param);
        }
        else {
            Utility.showMessage('Invalid input!');
        }
    }

    onPasswordChange = (e) => {
        const pass = e.target.value;
        const isValidPass = /^(?=.*[A-z].*[A-z])(?=.*\d.*\d).{6,}$/.test(pass);

        this.setState({ password: pass, isValidPass: isValidPass })
    }

    onSelect = (item) => {
        this.setState({ selectedLicensee: item, isShowOption: item !== null });
    }

    _getParams() {
        const password = this.state.password;

        const hashPass = CryptoJS.SHA1(password + defaultState.token).toString(CryptoJS.enc.Hex).toUpperCase();

        return {
            UserName: this.state.userName,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Email: this.state.email,
            IsAdmin: this.state.isAdmin,
            LicenseeName: this.state.selectedLicensee ? this.state.selectedLicensee.label : '',
            Option: this.state.option,
            IsOpen: this.state.isOpen,
            Password: hashPass,
            Token: defaultState.token,
            RedmineId: this.state.redmineId
        };
    }

    _submit(params) {
        this._toggleLoader(true);
        const url = 'ITUserManagement/AddUser';
        Site.fetchData(params, url)
            .then(response => {                
                if (!response.data.IsSuccess) {
                    Utility.showErrorMessage(response.data.Error);
                }
                else {
                    if (response.data.Error) {
                        Utility.showWarningMessage(response.data.Error);
                    }
                    else {
                        Utility.showMessage('Success!');
                    }

                    this.setState({ isSuccess : true });
                }

                this._toggleLoader(false);
            }).catch(err => {
                this._toggleLoader(false);
            });
    }

    _toggleLoader(isLoading) {
        this.setState({ isLoading: isLoading });
    }

    render() {
        const { redmineId, userName, firstName, lastName, email, isAdmin, selectedLicensee,
            isOpen, password, isLoading, licenseeList, isValidPass, isSuccess, isShowOption, option } = this.state;

        return (
            <div className='edit-form' style={{ marginTop: '10px' }}>
                <Loader isLoading={isLoading} />
                <div className='row'>
                    <div className='col-xs-12'>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>User Name</label>
                            <div className='col-sm-12 col-md-5'>
                            { 
                                isSuccess 
                                ? userName
                                : <input type='text'
                                    maxLength='50'
                                    value={userName}
                                    className={`full-width ${userName ? '' : 'has-error'}`}
                                    onChange={(e) => this.setState({ userName: e.target.value })} />
                            }
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>First Name</label>
                            <div className='col-sm-12 col-md-5'>
                            { 
                                isSuccess 
                                ? firstName
                                : <input type='text'
                                    maxLength='50'
                                    value={firstName}
                                    className='full-width'
                                    onChange={(e) => this.setState({ firstName: e.target.value })} />
                            }
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Last Name</label>
                            <div className='col-sm-12 col-md-5'>
                            {
                                isSuccess 
                                ? lastName
                                : <input type='text'
                                    maxLength='50'
                                    value={lastName}
                                    className='full-width'
                                    onChange={(e) => this.setState({ lastName: e.target.value })} />
                            }
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Email</label>
                            <div className='col-sm-12 col-md-5'>
                             {
                                isSuccess 
                                ? email
                                : <input type='text'
                                    maxLength='50'
                                    value={email}
                                    className='full-width'
                                    onChange={(e) => this.setState({ email: e.target.value })} />
                            }
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Is Admin</label>
                            <div className='col-sm-12 col-md-5'>
                            {
                                isSuccess 
                                ? ( isAdmin && <span className='glyphicon glyphicon-ok'></span> )
                                : <input type='checkbox'
                                    checked={isAdmin}
                                    onChange={this.onAdminCheck} />
                            }
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Licensee</label>
                            <div className='col-sm-12 col-md-5'>
                            {
                                isSuccess 
                                ? ( selectedLicensee ? selectedLicensee.label + '(' + this.options[option].label + ')': '' )
                                : <div>                        
                                    <Select instanceId='ddlLicensee'
                                        className={`full-width ${!isAdmin && selectedLicensee === null ? 'has-error' : ''}`}
                                        value={selectedLicensee}
                                        options={licenseeList}
                                        onChange={this.onSelect} />
                                    <div style={{display: isShowOption ? 'block' : 'none'}}>
                                    {  
                                        this.options.map(x => {
                                            const key = x.value;
                                            return (
                                                <div key={key}>
                                                    <input id={key} type='radio' value={x.value} name='addOption' checked={option === x.value} onChange={() => this.setState({ option: x.value })} />
                                                    <label htmlFor={key} className='optional-label'>{x.label}</label>
                                                </div>
                                            );
                                        })
                                    }
                                    </div> 
                                </div>
                            }
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Is Open</label>
                            <div className='col-sm-12 col-md-5'>
                            {
                                isSuccess 
                                ? ( isOpen && <span className='glyphicon glyphicon-ok'></span> )
                                : <input type='checkbox'
                                    checked={isOpen}
                                    onChange={(e) => this.setState({ isOpen: e.target.checked })} />
                            }
                            </div>
                        </div>
                        {
                            !isSuccess &&
                            <div className='form-group row'>
                                <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Password</label>
                                <div className='col-sm-12 col-md-5'>
                            
                                    <input type='password'
                                        maxLength='50'
                                        value={password}
                                        className={`full-width ${isValidPass ? '' : 'has-error'}`}
                                        onChange={this.onPasswordChange} />
                                    <i>(<b>Password</b> must have at least 6 characters, including at least 2 letters and at least 2 digits. (e.g:pass22))</i>
                                </div>
                            </div>
                        }
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Redmine Id</label>
                            <div className='col-sm-12 col-md-5'>
                            {
                                isSuccess 
                                ? redmineId
                                : <NumericInput value={redmineId}
                                    className={`full-width ${redmineId ? '' : 'has-error'}`}
                                    onChange={(value) => this.setState({ redmineId: value })} />
                            }
                            </div>
                        </div>
                        {
                            !isSuccess &&
                            <div className='form-group row col-sm-12'>
                                <button className='btn btn-primary' onClick={this.onSubmit} disabled={!this.isValid}>
                                    Submit
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}