import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createAccount } from './action'
import ConfirmBox from "../../../components/ConfirmBox";
import React, { Component } from "react";
import Utility from "../../../lib/utility";
import NumericInput from '../../../components/NumericInput';
import Tree from './Tree';

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowConfirmBox: false,
            password: "",
            isSuccess: false,
            requestBy: '',
            redmineID: ''
        };
    }

    _getParams() {
        return {
            criteria: {
                SiteName: this.props.siteName,
                UserID: this.props.userID,
                RequestBy: this.state.requestBy,
                RedmineID: this.state.redmineID,
                FuncPermissionsAdded: this._getSubFunction(this._getFuncsAdded())
            }
        };
    }

    _getListKeyOfSubFunctionKey(subFunctionKeys) {
        let listFuncKeys = [];

        subFunctionKeys.forEach((sub) => {
            const { FunctionKey } = sub;
            listFuncKeys.push(FunctionKey);
        })

        return listFuncKeys;
    }

    _getFuncsAdded() {
        const newFuncsPermissions = this.props.selectedFunc;
        let funcsAdded = [];

        newFuncsPermissions.map(newFunc => {
            let node = { 
                FunctionKey: newFunc.FunctionKey,
                SubFunctionKeys: newFunc.SubFunctionKeys ? newFunc.SubFunctionKeys : null,
                Type: newFunc.Type
            };

            funcsAdded.push(node);
        })
    
        return funcsAdded;
    }

    _getSubFunction(funcs) {
        funcs.map(func => {
            if (func.SubFunctionKeys != null) {
                if (Array.isArray(func.SubFunctionKeys)) {
                    func.SubFunctionKeys = func.SubFunctionKeys.filter(x => x.isCheck === true);
                    func.SubFunctionKeys = this._getListKeyOfSubFunctionKey(func.SubFunctionKeys);
                    func.SubFunctionKeys = JSON.stringify(func.SubFunctionKeys);
                }
            }
        })

        return funcs;
    }

    onConfirm = value => {
        this.setState({ isShowConfirmBox: false });

        if (value) {
            this._submit();
        }
    }

    _renderInput(label, value, disabled, readonly) {
        return (
            <div className="form-group row">
                <label className="col-sm-12 col-lg-2 col-md-2 col-form-label">{label}</label>
                <div className="col-sm-12 col-md-10">
                    <input type="text" className="full-width" value={value} disabled={disabled} readOnly={readonly} />
                </div>
            </div>
        );
    }

    _renderMessage(message) {
        return (
            <div className="form-group row">
                <div className="col-sm-12 col-lg-2 col-md-2 col-form-label"></div>
                <div className="col-sm-12 col-md-10">
                    {message}
                </div>
            </div>
        )
    }

    _submit() {
        const params = this._getParams();

        this.props.createAccount(params)
            .then(response => {
                if (response.data.IsSuccess) {
                    this.setState({
                        password: response.data.Data,
                        isSuccess: true
                    });
                    if (response.data.Error) {
                        Utility.showWarningMessage(response.data.Error);
                    }
                } else {
                    Utility.showErrorMessage(response.data.Error);
                }
            })
            .catch(err => { });
    }

    render() {
        const { isShowConfirmBox, password, isSuccess, requestBy, redmineID } = this.state;
        const { funcPer } = this.props;

        if (!this.props.isValid) {
            return <b className="red">This username is not exist but cannot be created in this case!</b>
        }

        if (this.props.isExist) {
            return <b className="red">This username already exists!</b>;
        }

        return (
            <div>
                <div className="add-form">
                    <div className="row">
                        <div className="col-xs-6">
                            <div className="panel panel-default">
                                <div className="panel-heading">User Info</div>
                                <div className="panel-body">
                                    {this._renderMessage(`The username is not exist. If you want to create this username, please click the button "Submit" bellow.`)}
                                    {this._renderInput("Site Name", this.props.siteName, true)}
                                    {this._renderInput("User ID", this.props.userID, true)}
                                    <div className='form-group row'>
                                        <label className='col-sm-12 col-lg-2 col-md-2 col-form-label'>Request by</label>
                                        <div className='col-md-10'>
                                            <input type='text'
                                                className={`full-width ${requestBy ? '' : 'has-error'}`}
                                                onChange={(e) => this.setState({ requestBy: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-12 col-lg-2 col-md-2 col-form-label">Redmine Id</label>
                                        <div className="col-md-10">
                                            <NumericInput value={redmineID}
                                                className={`full-width ${redmineID ? '' : 'has-error'}`}
                                                onChange={(value) => this.setState({ redmineID: value })} />
                                        </div>
                                    </div>
                                    {password.trim() == ""
                                        ? this._renderInput("User password", password, true, false)
                                        : this._renderInput("User password", password, false, true)}
                                    <div className="form-group row">
                                        <div className="col-lg-12">
                                            {isSuccess && (
                                                this._renderMessage("Make sure you copy it now, you won't be able to see it again.")
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group row col-sm-12">
                                        <button className="btn btn-primary"
                                            onClick={() => this.setState({ isShowConfirmBox: true })}
                                            disabled={!redmineID || !requestBy || password} > 
                                            Submit
                                    </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className="panel panel-default" >
                                <div className="panel-heading">User Permisson</div>
                                <div className="panel-body auto-scroll">
                                    <Tree className="tree" nodes={JSON.parse(funcPer)} isDisable={isSuccess} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmBox
                    isShow={isShowConfirmBox}
                    title="Confirmation"
                    message="Do you want to add new user?"
                    style={{ height: "150px", width: "400px" }}
                    onClose={this.onConfirm}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ createAccount }, dispatch);
}
function mapStateToProps(state) {
    const { selectedFunc } = state;
    return { selectedFunc };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);