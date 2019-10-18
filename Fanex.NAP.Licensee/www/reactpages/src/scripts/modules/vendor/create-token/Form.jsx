import React, { Component } from 'react';
import Popup from '../../../components/Popup';

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeControl: '',
            seconds: 3600,
            extraTime: 0,
            token: '',
            isDisable: true,
            isShowMessage: false,
            isShowPopup: false,
        };
    }

    onGenerate = (event) => {
        event.preventDefault();
        this.setState({ 
            isDisable: false, 
            isShowMessage: true,
            token: this._generateToken(16)
        });
    }

    onSubmit = () => {
        this.setState({
            isShowPopup: false,
            seconds: this.state.seconds + this._convertHoursToSecond(this.state.extraTime)
        });

        if (!this.timerID) {
            this.timerID = setInterval(() => this._tick(), 1000);
        }
    }

    _generateToken(length) {
        var symbols = "@#$%";
        var numbers = "1234567890";
        var lowercaseCharacter = "abcdefghijklmnopqrstuvwxyz";
        var upcaseCharacter = "ABCDEFGHIJKLMNOQPRSTUVWXYZ";

        var radomString = symbols + numbers + lowercaseCharacter + upcaseCharacter;
        var token = "";
        for (let i = 0; i < length; i++) {
            token += radomString[Math.floor(Math.random() * radomString.length)];
        }

        return token;
    }

    _renderCardInput(label) {
        return (
            <div className='form-group row'>
                <label className='col-lg-3 col-sm-3 col-md-3'>{label}</label>
                <div className='col-lg-9 col-sm-9'>
                    <input type='text' className='full-width' />
                </div>
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
                timeControl: this._secondsToTimeString(curentSeconds)
            });
        }
    }

    _convertHoursToSecond(hours) {
        return hours * 60 * 60;
    }

    _secondsToTimeString(secs) {
        var hours = Math.floor(secs / 3600);
        var minutes = Math.floor(secs % 3600 / 60);
        var seconds = Math.floor(secs % 3600 % 60);

        return ('0' + hours).slice(-2) + " : " + ('0' + minutes).slice(-2) + " : " + ('0' + seconds).slice(-2);
    }

    componentWillMount() {
        this.setState({
            timeControl: this._secondsToTimeString(this.state.seconds)
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
                            <input type='text' className='form-control' onChange={(e) => this.setState({ extraTime: e.target.value })} />
                        </div>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-3'>
                        <button className='btn btn-primary full-width' onClick={() => this.onSubmit()}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { timeControl, token, isDisable, isShowMessage, isShowPopup } = this.state;
        return (
            <div>
                <div className="add-form">
                    <div className="row">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-header-content">
                                    <div className='form-group row header-content'>
                                        <div className="col-lg-9 col-sm-9 col-md-9">
                                            Current Token will be expired in {timeControl}
                                        </div>
                                        <div className="col-lg-3 col-sm-3">
                                            <button className="btn-extend pull-right" onClick={() => this.setState(() => ({ isShowPopup: true }))}>Extend time</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="card-title">Create new token for <span className="title-name">ITsupport1</span></div>
                                <div className="card-body-content">
                                    {this._renderCardInput('Request by')}
                                    {this._renderCardInput('Redmine ID')}
                                    {this._renderCardInput('Exprired in')}
                                    <div className='form-group row pull-right'>
                                        <div className="col-lg-12">
                                            <button className="btn-submit" onClick={this.onGenerate}>Generate</button>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className='form-group row'>
                                        <label className='col-lg-3 col-sm-3 col-md-3'>Your token</label>
                                        <div className='col-lg-9 col-sm-9'>
                                            <div className="group-input group-prepend">
                                                <input type="text" className='full-width' disabled={isDisable} value={token} />
                                                <div className="input-group-prepend">
                                                    <button className="btn-copy" disabled={isDisable}>Copy</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {isShowMessage == true ?
                                        (
                                            <div className='form-group row'>
                                                <label className='col-lg-12 col-sm-12 col-md-12'>New token "czxcx" has been created. Make sure you copy it now, you won't be able to see it again</label>
                                            </div>
                                        ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Popup isShow={isShowPopup}
                    title='Extend Time'
                    content={this._buildContent()}
                    className='no-scroll'
                    style={{ top: '100px', bottom: 'auto', width: '540px' }}
                    onClose={() => this.setState(() => ({ isShowPopup: false }))} />
            </div>
        )
    }
}