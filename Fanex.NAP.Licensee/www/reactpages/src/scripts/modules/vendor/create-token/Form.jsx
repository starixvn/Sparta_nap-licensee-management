import React, { Component } from 'react';
import Site from '../../../lib/site';
import Loader from '../../../components/Loader';
import Utility from '../../../lib/utility';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeSpan: '',
            extraTime: 8,
            token: '',
            isCopy: false,
            isDisable: true,
            isLoading: false,
            isShowMessage: false,
            requestBy: '',
            redmineID: '',
            expriedIn: defaultState.timeRemaining
        };
    }

    _getParams() {
        return {
            criteria: {
                SiteName: defaultState.userInfo.siteName,
                UserID: defaultState.userInfo.userID,
                UserPWD: defaultState.userInfo.userPWD,
                RequestBy: this.state.requestBy,
                RedmineID: this.state.redmineID
            },
            extendTime: this.state.extraTime
        };
    }

    _onGenerate = () => {
        this._toggleLoader(true);
        const url = 'LicenseeVendor/CreateToken';
        var param = this._getParams();

        Site.fetchData(param, url)
            .then(response => {
                if (response.data.IsSuccess) {
                    this.setState({
                        isDisable: false,
                        isShowMessage: true,
                        token: response.data.Data,
                        expriedIn: this._convertHoursToSecond(this.state.extraTime)
                    });
                    if (response.data.Error) {
                        Utility.showWarningMessage(response.data.Error);
                    }
                }
                else {
                    Utility.showErrorMessage(response.data.Error);
                }

                this._toggleLoader(false);
            }).catch(err => {
                this._toggleLoader(false);
            });

        if (!this.timerID) {
            this._setTimeControl();
        }
    }

    _onCopy = (event) => {
        this.txtToken.select();
        document.execCommand('copy');
        event.target.focus();

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
        this.timerID = setInterval(() => this._tick(), 1000);
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

    _toggleLoader(isLoading) {
        this.setState({ isLoading: isLoading });
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
        const { isCopy, requestBy, redmineID, token, isDisable, isLoading, isShowMessage } = this.state;

        return (
            <div>
                <div className="add-form">
                    <Loader isLoading={isLoading} />
                    <div className="row">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">Create new token for <b>{defaultState.userInfo.userID}</b></div>
                                <div className="card-body-content">
                                    {this._renderCardInput('Request by', 'requestBy')}
                                    {this._renderCardInput('Redmine ID', 'redmineID')}
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