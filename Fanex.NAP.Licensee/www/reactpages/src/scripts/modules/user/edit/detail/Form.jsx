import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setUser } from '../action';
import Utility from '../../../../lib/utility';
import Site from '../../../../lib/site';
import NumericInput from '../../../../components/NumericInput';
import ResetPasswordForm from './ResetPasswordForm';

export class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: props.user.FirstName,
            lastName: props.user.LastName,
            isActive: props.user.IsActive,
            redmineId: ''
        };
    }

    get isValid() {
        const { firstName, lastName, isActive, redmineId } = this.state;
        const { user } = this.props;

        return (firstName !== user.FirstName || lastName !== user.LastName || isActive !== user.IsActive) && redmineId;
    }

    onSubmit = () => {
        if (this.isValid) {
            this._submit();
        }
        else {
            Utility.showMessage('No data changed!');
        }
    }

    _submit() {
        const params = {
            UserId: this.props.user.UserId,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            IsActive: this.state.isActive,
            RedmineId: this.state.redmineId
        }

        this.props.toggleLoader(true);
        const url = 'ITUserManagement/EditUser';
        Site.fetchData(params, url)
            .then(response => {                
                if (!response.data.IsSuccess) {
                    Utility.showErrorMessage(response.data.Error);
                }
                else {
                    Utility.showMessage('Success!');
                    this.props.setUser(response.data.Data);
                    this.setState({
                        firstName: response.data.Data.FirstName,
                        lastName: response.data.Data.LastName,
                        isActive: response.data.Data.IsActive,
                        redmineId: ''
                    });
                }

                this.props.toggleLoader(false);
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    render() {
        const { user } = this.props;
        const { firstName, lastName, isActive, redmineId } = this.state;

        return (
            <div className='edit-form' style={{display: this.props.isActive ? 'block' : 'none', marginTop: '20px'}}>
                <div className='row'>
                    <div className='col-xs-12'>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>User Name</label>
                            <div className='col-sm-12 col-md-5'>
                                {user.UserName}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>First Name</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='text'
                                    maxLength='50'
                                    value={firstName === null ? '' : firstName}
                                    className='full-width'
                                    onChange={(e) => this.setState({ firstName: e.target.value })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Last Name</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='text'
                                    maxLength='50'
                                    value={lastName === null ? '' : lastName}
                                    className='full-width'
                                    onChange={(e) => this.setState({ lastName: e.target.value })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Email</label>
                            <div className='col-sm-12 col-md-5'>
                                {user.Email}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Role</label>
                            <div className='col-sm-12 col-md-5'>
                                {user.UserRole}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Licensee Name</label>
                            <div className='col-sm-12 col-md-5'>
                                {user.LicenseeName}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Status</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='radio'
                                    id='Open'
                                    value='Open'
                                    name='Status'
                                    checked={isActive}
                                    onChange={(e) => this.setState({ isActive: true })} />
                                <label htmlFor='Open' className='optional-label'>Open</label>
                                <input type='radio'
                                    id='Closed'
                                    value='Closed'
                                    name='Status'
                                    checked={!isActive}
                                    onChange={(e) => this.setState({ isActive: false })} />
                                <label htmlFor='Closed' className='optional-label'>Closed</label>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Redmine Id</label>
                            <div className='col-sm-12 col-md-5'>
                                <NumericInput value={redmineId}
                                    className={`full-width ${redmineId ? '' : 'has-error'}`}
                                    onChange={(value) => this.setState({ redmineId: value })} />
                            </div>
                        </div>
                        <div className='form-group row col-sm-12'>
                            <button className='btn btn-primary' onClick={this.onSubmit} disabled={!this.isValid}>
                                Submit
                            </button>
                            <ResetPasswordForm />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, setUser }, dispatch);
}
function mapStateToProps(state) {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);