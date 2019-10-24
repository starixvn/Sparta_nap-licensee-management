import React, { Component } from 'react';
import Popup from '../../../components/Popup';
import Site from '../../../lib/site';
import Loader from '../../../components/Loader';
import Utility from '../../../lib/utility';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeControl: '',
            seconds: 0,
            extraTime: 2,
            token: '',
            isCopy: false,
            isDisable: true,
            isLoading: false,
            isShowMessage: false,
            isShowPopup: false,
            requestBy: '',
            redmineID: '',
            expriedIn: defaultState.timeRemaining
        };
    }

    _getParams() {
        return {
            criteria: {
                SiteName: defaultState.userInfo.siteName,
                UserID: defaultState.userInfo.userID
            },
            extendTime: this.state.extraTime == '' ? 0 : this.state.extraTime
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
                        token: response.data.Data
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
    }

    _onSubmit = () => {
        this.setState({
            isShowPopup: false,
            seconds: this.state.seconds + this._convertHoursToSecond(this.state.extraTime)
        });

        if (!this.timerID) {
            this.timerID = setInterval(() => this._tick(), 1000);
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

    _onExtraTimeChange = (event) => {
        const extraTime = (event.target.validity.valid) ? event.target.value : this.state.extraTime;

        this.setState({ extraTime: extraTime })
    }

    _renderCardInput(label, stateName, disabled) {
        return (
            <div className='form-group row'>
                <label className='col-lg-3 col-sm-3 col-md-3'>{label}</label>
                <div className='col-lg-9 col-sm-9'>
                    <input type='text' className={`full-width ${this.state[stateName] ? '' : 'has-error'}`} value={this.state[stateName]} 
                    disabled={disabled} onChange={(e) => this.setState({ [stateName]: e.target.value })}  />
                </div>
            </div>
        )
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
        if (this.state.seconds == 0) {
            clearInterval(this.timerID);
            this.timerID = false;
        }
        else {
            var curentSeconds = this.state.seconds - 1;
            this.setState({
                seconds: curentSeconds,
                timeControl: this._formatSecondsToTimeString(curentSeconds)
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
            seconds: this._convertHoursToSecond(defaultState.timeRemaining),
            timeControl: this._formatSecondsToTimeString(this.state.seconds)
        });
    }

    componentDidMount() {
        this.timerID = setInterval(() => this._tick(), 1000);
    }

    _buildContent() {
        return (
            <div className='confirm-popup'>
                <div className='form-group row pop-content'>
                    <label className='col-lg-1 col-md-1 col-sm-1'>Hour</label>
                    <div className='col-lg-2 col-md-2 col-sm-2'>
                        <div className="group-input">
                            <div className="input-group-prepend icon-plus">
                                <label>+</label>
                            </div>
                            <input type='text' className='form-control' pattern="[0-9]*" value={this.state.extraTime} onChange={this._onExtraTimeChange} />
                        </div>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-3'>
                        <button className='btn btn-primary full-width' onClick={() => this._onSubmit()}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { isCopy, timeControl, token, isDisable, isLoading, 
            isShowMessage, isShowPopup, expriedIn } = this.state;

        return (
            <div>
                <div className="add-form">
                    <Loader isLoading={isLoading} />
                    <div className="row">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-header-content">
                                    {
                                        expriedIn == 0 ?
                                        (
                                            <div className='form-group row header-content'>
                                                <div className="col-lg-12 col-sm-12 col-md-12 text-center txt-danger">
                                                    Your token has expired
                                                </div>
                                            </div>
                                        ) :
                                        (
                                            <div className='form-group row header-content'>
                                                <div className="col-lg-9 col-sm-9 col-md-9">
                                                    Current Token will be expired in {timeControl}
                                                </div>
                                                <div className="col-lg-3 col-sm-3">
                                                    <button className="btn-green pull-right" onClick={() => this.setState(() => ({ isShowPopup: true }))}>Extend time</button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="card-title">Create new token for <b>{defaultState.userID}</b></div>
                                <div className="card-body-content">
                                    {this._renderCardInput('Request by', 'requestBy')}
                                    {this._renderCardInput('Redmine ID', 'redmineID')}
                                    {this._renderCardInput('Exprired in', 'expriedIn', true)}
                                    <div className='form-group row pull-right'>
                                        <div className="col-lg-12">
                                            <button className="btn btn-primary" onClick={this._onGenerate} disabled={(expriedIn == 0)}>Generate</button>
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
                    <Popup isShow={isShowPopup}
                        title='Extend Time'
                        content={this._buildContent()}
                        style={{ top: '100px', bottom: 'auto', width: '540px' }}
                        onClose={() => this.setState(() => ({ isShowPopup: false }))} />
                </div>
            </div>
        )
    }
}