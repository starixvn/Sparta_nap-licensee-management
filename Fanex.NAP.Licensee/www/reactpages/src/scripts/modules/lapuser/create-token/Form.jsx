import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setSelectedFuncs, setIsCheckGroup, createToken, toggleLoader } from './action'
import Loader from '../../../components/Loader'
import React, { Component } from 'react';
import Utility from '../../../lib/utility';
import NumericInput from '../../../components/NumericInput';
import Tree from './Tree';

class Form extends Component {
    constructor(props) {
        super(props);

        const { timeRemaining, oldCurrency, currency } = this.props;
        this.state = {
            timeSpan: '',
            extendTime: 8,
            token: '',
            isCopy: false,
            isSuccess: false,
            requestBy: '',
            redmineID: '',
            expriedIn: timeRemaining,
            currency: currency,
            currencySelected: oldCurrency ? oldCurrency : []
        }
    }

    _getParams() {
        const { user } = this.props;
        const { expriedIn, requestBy, redmineID, currencySelected, extendTime } = this.state;

        return {
            criteria: {
                VendorId: user.VendorInfo.VendorID,
                UserID: user.UserID,
                RequestBy: requestBy,
                RedmineID: redmineID,
                ExtendTime: this._convertHourToSecond(extendTime) + expriedIn,
                FuncPermissions: this._getSubFunction(this._getFuncsAdded()),
                IsRemoveGroup: this.props.isCheckGroup == false ? true : false,
                Currency: JSON.stringify(currencySelected)
            }
        };
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

    _convertListSubFuncsToNode(selectedFunc) {
        selectedFunc.map((selFunc) => {
            if (selFunc.SubFunctionKeys && !Array.isArray(selFunc.SubFunctionKeys)) {
                selFunc.SubFunctionKeys = JSON.parse(selFunc.SubFunctionKeys);
                selFunc.SubFunctionKeys.map((subFunc, i) => {
                    selFunc.SubFunctionKeys[i] = {
                        FunctionKey: subFunc
                    }
                })
            }
        })

        return selectedFunc;
    }

    _getListKeyOfSubFunctionKey(subFunctionKeys) {
        let listFuncKeys = [];

        subFunctionKeys.forEach((sub) => {
            const { FunctionKey } = sub;
            listFuncKeys.push(FunctionKey);
        })

        return listFuncKeys;
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

    _checkChangeSubFuncs(oldFuncs, newFuncs) {
        let flag = false;
        let isExist = false;

        if (oldFuncs.SubFunctionKeys && newFuncs.SubFunctionKeys) {
            newFuncs.SubFunctionKeys.forEach(newSub => {
                oldFuncs.SubFunctionKeys.forEach(oldSub => {
                    if (!newSub.isCheck || newSub.FunctionKey === oldSub.FunctionKey) {
                        isExist = true;
                    }
                })

                if (isExist === false) {
                    flag = true;
                }

                isExist = false;
            })
        }

        return flag;
    }

    _onGenerate = () => {
        this.props.toggleLoader(true);
        const param = this._getParams();
        const { extendTime, expriedIn } = this.props;

        this.props.createToken(param)
            .then(response => {
                if (response.data.IsSuccess === true) {
                    this.setState({
                        isSuccess: true,
                        token: response.data.Data,
                        expriedIn: this._convertHourToSecond(extendTime) + expriedIn
                    });
                    if (response.data.Error) {
                        Utility.showWarningMessage(response.data.result.Error);
                    }
                }
                else {
                    Utility.showErrorMessage(response.data.Error);
                }

                this.props.toggleLoader(false);
            }).catch(err => {
                this.props.toggleLoader(false);
            });

        this._setTimeControl();
    }

    _onCopy = () => {
        this.txtToken.select();
        document.execCommand('copy');

        this.setState({
            isCopy: true
        })
        setTimeout(() => {
            this.setState({ isCopy: false });
        }, 500);
    }

    _renderCardInput(label, stateName, disabled) {
        return (
            <div className='form-group row'>
                <label className='col-lg-3 col-sm-3 col-md-3'>{label}</label>
                <div className='col-lg-9 col-sm-9'>
                    <input type='text' className={`full-width ${this.state[stateName] || disabled ? '' : 'has-error'}`} value={this.state[stateName]}
                        disabled={disabled} onChange={(e) => this.setState({ [stateName]: e.target.value })} />
                </div>
            </div>
        )
    }

    _renderCardInputNumber(label, stateName) {
        return (
            <div className='form-group row'>
                <label className='col-lg-3 col-sm-3 col-md-3'>{label}</label>
                <div className='col-lg-9 col-sm-9'>
                    <NumericInput value={this.state[stateName]}
                        className={`full-width ${this.state[stateName] ? '' : 'has-error'}`}
                        onChange={(value) => this.setState({ [stateName]: value })} />
                </div>
            </div>
        )
    }

    _setTimeControl() {
        if (!this.timerID) {
            this.timerID = setInterval(() => this._tick(), 1000);
        }
    }

    _renderTootlip(label, position) {
        return (
            <div className={`tooltip in ${position}`}>
                <div className="tooltip-arrow"></div>
                <div className="tooltip-inner">{label}</div>
            </div>
        )
    }

    _tick() {
        if (this.state.expriedIn == 0) {
            clearInterval(this.timerID);
            this.timerID = false;
        }
        else {
            var curentSeconds = this.state.expriedIn - 1;
            this.setState({
                expriedIn: curentSeconds,
                timeSpan: this._formatSecondsToTimeString(curentSeconds)
            });
        }
    }

    _convertHourToSecond(hours) {
        return hours * 60 * 60;
    }

    _formatSecondsToTimeString(secs) {
        var hours = Math.floor(secs / 3600);
        var minutes = Math.floor(secs % 3600 / 60);
        var seconds = Math.floor(secs % 3600 % 60);

        return ('0' + hours).slice(-2) + " : " + ('0' + minutes).slice(-2) + " : " + ('0' + seconds).slice(-2);
    }

    componentWillMount() {
        if (this.props.oldFuncPer.UserGroup) {
            this.props.setIsCheckGroup(true);
        }

        this.setState({
            timeSpan: this._formatSecondsToTimeString(this.state.expriedIn)
        });
    }

    _onCheck = (value) => {
        const { currencySelected } = this.state;

        var index = currencySelected.indexOf(value.Id);
        value.isCheck = !value.isCheck;

        if (value.isCheck == true && index < 0) {
            currencySelected.push(value.Id);
        }
        else {
            currencySelected.splice(index, 1);
        }

        this.setState({ currencySelected });
    }

    _checkedOldCurency() {
        const { currency, currencySelected } = this.state;

        currency.map(cur => {
            cur.isCheck = false;

            currencySelected.map(olCur => {
                if (cur.Id === olCur) {
                    cur.isCheck = true;
                }
            })
        })

        this.setState({ currency, currencySelected });
    }

    componentDidMount() {
        this._setTimeControl();
        this._checkedOldCurency();
    }

    render() {
        const { isCopy, requestBy, redmineID, token, currency, isSuccess } = this.state;
        const { user, isValid, isLoading, funcPer, oldFuncPer } = this.props;

        if (!isValid) {
            return <b className='red'>This username is not allowed to create new token in this case!</b>;
        }

        return (
            <div>
                <div className="add-form">
                    <Loader isLoading={isLoading} />
                    <div className="row">
                        <div className="col-lg-5 col-sm-7 col-xs-12">
                            <div className="panel panel-default" >
                                <div className="panel-heading">Create new token for <b>{user.UserID}</b></div>
                                <div className="panel-body auto-scroll">
                                    <div className="card-body">
                                        <div className="card-body-content">
                                            {this._renderCardInput('Request by', 'requestBy')}
                                            {this._renderCardInputNumber('Redmine Id', 'redmineID')}
                                            {this._renderCardInputNumber('Extend time (hour)', 'extendTime')}
                                            {this._renderCardInput('Exprired in', 'timeSpan', true)}
                                            <div className='form-group row pull-right'>
                                                <div className="col-lg-12">
                                                    <button className="btn btn-primary" onClick={this._onGenerate} disabled={!redmineID || !requestBy || isSuccess}>Generate</button>
                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className='form-group row'>
                                                <label className='col-lg-3 col-sm-3 col-md-3'>Your token</label>
                                                <div className='col-lg-9 col-sm-9'>
                                                    <div className="group-input group-prepend">
                                                        <input type="text" className='full-width' disabled={!isSuccess} value={token} ref={(txtToken) => this.txtToken = txtToken} />
                                                        {
                                                            isCopy && this._renderTootlip('Copied', 'bottom')
                                                        }
                                                        <div className="input-group-prepend">
                                                            <button className="btn-copy" disabled={!isSuccess} onClick={this._onCopy}>Copy</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='form-group row'>
                                                <div className="col-lg-12">
                                                    {isSuccess &&
                                                        <div className='form-group row'>
                                                            <label className='col-lg-12 col-sm-12 col-md-12'>New token "{token}" has been created. Make sure you copy it now, you won't be able to see it again</label>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-sm-3 col-xs-12">
                            <div className="panel panel-default panel-large" >
                                <div className="panel-heading">User Permisson</div>
                                <div className="panel-body auto-scroll">
                                    {
                                        oldFuncPer.UserGroup &&
                                        <div className='form-group row'>
                                            <label className='col-lg-3 col-sm-3 col-md-3'>User Group</label>
                                            <div className='col-lg-9 col-sm-9'>
                                                <div className="form-group">
                                                    <label className="checkbox-inline">
                                                        <input type="checkbox" checked={this.props.isCheckGroup}
                                                            disabled={isSuccess}
                                                            onChange={(e) => this.props.setIsCheckGroup(e.target.checked)} />
                                                        {oldFuncPer.UserGroup.GroupName}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        oldFuncPer.UserGroup &&
                                        <div className='form-group row'>
                                            <label className='col-xs-12'>User Function permission</label>
                                        </div>
                                    }
                                    <Tree className="tree"
                                        selectedNode={oldFuncPer.FuncPermission && this._convertListSubFuncsToNode(oldFuncPer.FuncPermission)}
                                        defaultSelectedNode={oldFuncPer.UserGroup && this._convertListSubFuncsToNode(oldFuncPer.UserGroup.FuncPermission)}
                                        nodes={JSON.parse(funcPer)}
                                        isDisableAll={isSuccess} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-2 col-xs-12">
                            <div className="panel panel-default panel-large">
                                <div className="panel-heading">Currency permission</div>
                                <div className="panel-body auto-scroll">
                                    {currency.map((cur, i) => (
                                        <div className="form-group" key={i}>
                                            <label className="checkbox-inline node">
                                                <input type="checkbox" checked={cur.isCheck == true ? true : false} disabled={isSuccess} onChange={() => this._onCheck(cur)} />
                                                {cur.Name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedFuncs, setIsCheckGroup, createToken, toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { selectedFunc, isCheckGroup, isLoading } = state;
    return { selectedFunc, isCheckGroup, isLoading };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);