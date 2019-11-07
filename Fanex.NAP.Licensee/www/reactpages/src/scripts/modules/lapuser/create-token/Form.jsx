import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createToken, toggleLoader } from './action'
import Loader from '../../../components/Loader'
import React, { Component } from 'react';
import Utility from '../../../lib/utility';
import NumericInput from '../../../components/NumericInput';

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeSpan: '',
            extraTime: 0.25,
            token: '',
            isCopy: false,
            isDisable: true,
            isShowMessage: false,
            requestBy: '',
            redmineID: '',
            expriedIn: this.props.user.TimeRemaining
        };
    }

    _getParams() {
        return {
            criteria: {
                SiteName: this.props.user.UserInfo.SiteName,
                UserID: this.props.user.UserInfo.UserID,
                RequestBy: this.state.requestBy,
                RedmineID: this.state.redmineID
            }
        };
    }

    _onGenerate = () => {
        this.props.toggleLoader(true);
        var param = this._getParams();

        this.props.createToken(param)
            .then(response => {
                if (response.data.IsSuccess) {
                    this.setState({
                        isDisable: false,
                        isShowMessage: true,
                        token: response.data.Data,
                        expriedIn: this._convertHoursToSecond(this.state.extraTime)
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

    _onCopy = (event) => {
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

    _convertHoursToSecond(hours) {
        return hours * 60 * 60;
    }

    _formatSecondsToTimeString(secs) {
        var hours = Math.floor(secs / 3600);
        var minutes = Math.floor(secs % 3600 / 60);
        var seconds = Math.floor(secs % 3600 % 60);

        return ('0' + hours).slice(-2) + " : " + ('0' + minutes).slice(-2) + " : " + ('0' + seconds).slice(-2);
    }

    componentWillMount() {
        this.setState({
            timeSpan: this._formatSecondsToTimeString(this.state.expriedIn)
        });
    }

    componentDidMount() {
        this._setTimeControl();
    }

    render() {
        const { isCopy, requestBy, redmineID, token, isDisable, isShowMessage } = this.state;
        const { user } = this.props;

        if (!this.props.user.IsValid) {
            return <p className='red'>User <b>{user.UserInfo.UserID}</b> is not allowed to create new token in this case!</p>;
        }

        return (
            <div>
                <div className="add-form">
                    <Loader isLoading={this.props.isLoading} />
                    <div className="row">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">Create new token for <b>{user.UserInfo.UserID}</b></div>
                                <div className="card-body-content">
                                    {this._renderCardInput('Request by', 'requestBy')}
                                    <div className='form-group row'>
                                        <label className='col-lg-3 col-sm-3 col-md-3'>Redmine Id</label>
                                        <div className='col-lg-9 col-sm-9'>
                                            <NumericInput value={redmineID}
                                                className={`full-width ${redmineID ? '' : 'has-error'}`}
                                                onChange={(value) => this.setState({ redmineID: value })} />
                                        </div>
                                    </div>
                                    {this._renderCardInput('Exprired in', 'timeSpan', true)}
                                    <div className='form-group row pull-right'>
                                        <div className="col-lg-12">
                                            <button className="btn btn-primary" onClick={this._onGenerate} disabled={!redmineID || !requestBy}>Generate</button>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className='form-group row'>
                                        <label className='col-lg-3 col-sm-3 col-md-3'>Your token</label>
                                        <div className='col-lg-9 col-sm-9'>
                                            <div className="group-input group-prepend">
                                                <input type="text" className='full-width' disabled={isDisable} value={token} ref={(txtToken) => this.txtToken = txtToken} />
                                                {
                                                    isCopy && this._renderTootlip('Copied', 'bottom')
                                                }
                                                <div className="input-group-prepend">
                                                    <button className="btn-copy" disabled={isDisable} onClick={this._onCopy}>Copy</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='form-group row'>
                                        <div className="col-lg-12">
                                            {isShowMessage &&
                                                (
                                                    <div className='form-group row'>
                                                        <label className='col-lg-12 col-sm-12 col-md-12'>New token "{token}" has been created. Make sure you copy it now, you won't be able to see it again</label>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
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
    return bindActionCreators({ createToken, toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { user, isLoading } = state;
    return { user, isLoading };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);