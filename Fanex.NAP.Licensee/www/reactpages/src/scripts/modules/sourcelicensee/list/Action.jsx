import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from '../base/action';
import Utility from '../../../lib/utility';
import Site from '../../../lib/site';
import Popup from '../../../components/Popup';
import ConfirmBox from '../../../components/ConfirmBox';
import NumericInput from '../../../components/NumericInput';

export class Action extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stopFrom: Utility.getTodayString(),
            restart: false,
            restartFrom: Utility.getTodayString(),
            restartTo: Utility.getDateString(new Date(2050, 0, 1)),
            redmineId: '',
            result: null,
            isShowPopup: false,
            isShowConfirmation: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.timeStamp !== this.props.params.timeStamp) {
            this.setState({ result: null });
        }
    }

    get isValidPopup() {
        const { stopFrom, restart, restartTo, restartFrom, redmineId } = this.state;

        return stopFrom && redmineId && (!restart || ( restartTo && restartFrom ));
    }

    onClick = () => {
        this.setState({ isShowPopup: true });
    }

    onSubmit = () => {
        this.setState({ isShowConfirmation: true });
    }

    onPopupClose = () => {
        this.setState({
            stopFrom: Utility.getTodayString(),
            restart: false,
            restartFrom: Utility.getTodayString(),
            restartTo: Utility.getDateString(new Date(2050, 0, 1)),
            redmineId: '',
            isShowPopup: false
        });
    }

    onConfirm = (value) => {
        if (value) {
            this._submit();
        }
        this.setState({ isShowConfirmation: false });
    }

    _getParam() {
        return {
            stopFrom: this.state.stopFrom,
            restart: this.state.restart,
            restartFrom: this.state.restartFrom,
            restartTo: this.state.restartTo,
            settingIdList: this.props.checkedList.toString(),
            redmineId: this.state.redmineId
        };
    }

    _submit() {
        this.props.toggleLoader(true);
        const url = 'SourceLicenseeSetting/Update';
        const param = this._getParam();

        Site.fetchData(param, url)
            .then(response => {
                if (response.data.IsSuccess) {
                    Utility.showMessage('Success!');
                    this._updateGrid();
                    this.onPopupClose();
                }
                else {
                    Utility.showMessage(response.data.Error);
                    if (response.data.Data) {
                        this.setState({
                            result: {
                                existedItems: response.data.Data.ExistedIds
                            }
                        });
                    }
                    this.props.toggleLoader(false);
                }
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    _updateGrid() {
        const filterParams = Object.assign({}, this.props.params, { timeStamp: new Date().getTime() });
        this.props.setParams(filterParams);
    }

    _buildPopupContent(stopFrom, restart, restartTo, restartFrom, redmineId) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>Stop From</label>
                    <input className={`full-width ${stopFrom ? '' : 'has-error'}`}
                        type='date'
                        value={stopFrom}
                        onChange={(e) => this.setState({ stopFrom: e.target.value })} />
                </div>
                <div className='form-group'>
                    <label className="checkbox-inline">           
                        <input type="checkbox" name="restart" onChange={(e) => this.setState({ restart: e.target.checked })} checked={restart} />
                        Restart
                    </label>
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Restart From</label>
                    <input className={`full-width ${!restart || restartFrom ? '' : 'has-error'}`}
                        disabled={!restart} 
                        type='date' value={restartFrom}
                        onChange={(e) => this.setState({ restartFrom: e.target.value })} />
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Restart To</label>
                    <input className={`full-width ${!restart || restartTo ? '' : 'has-error'}`}
                        disabled={!restart}
                        type='date' value={restartTo}
                        onChange={(e) => this.setState({ restartTo: e.target.value })} />
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Redmine Id</label>
                    <NumericInput className={`full-width ${redmineId ? '' : 'has-error'}`}
                        value={redmineId}
                        onChange={(value) => this.setState({ redmineId: value })} />
                </div>
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={this.onSubmit} disabled={!this.isValidPopup}>
                        Submit
                    </button>
                    <button className='btn btn-red' onClick={this.onPopupClose}>
                        Cancel
                    </button>
                </div>
            </div>    
        );
    }

    render() {
        const { stopFrom, restart, restartTo, restartFrom, redmineId, result, isShowPopup, isShowConfirmation } = this.state;
        const countSelectedItem = this.props.checkedList.length;

        return(
        <div>
            <div style={{ display: 'inline-block' }}>
                <a className='btn btn-green' href={window.rootUrl + 'SourceLicenseeSetting/Add'}>+ Add New Setting</a>
                <button className='btn btn-red' onClick={this.onClick} disabled={countSelectedItem === 0}>Suspend({countSelectedItem})</button>
            </div>
            <ConfirmBox isShow={isShowConfirmation}
                title='Confirmation'
                message={`Do you want to stop getting data from ${Utility.formatDate(stopFrom)}${restart ? ' and restart with date range '+ Utility.formatDate(restartFrom) + ' - ' + Utility.formatDate(restartTo) : ''}?`}
                style={{ height: '160px', width: '400px' }}
                onClose={this.onConfirm} /> 
            <Popup isShow={isShowPopup}
                title='Suspend Source Licensee'
                content={this._buildPopupContent(stopFrom, restart, restartTo, restartFrom, redmineId)}
                className='no-scroll'
                style={{height: '410px', width: '600px'}}
                onClose={this.onPopupClose} />
    {
                result && result.existedItems &&
                <table className='table table-bordered'>
                    <thead>
                        <tr><th colSpan={2}>Suspend Result</th></tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Source items overlap with an existing setting item</td>
                            <td dangerouslySetInnerHTML={{__html: result.existedItems}}></td>
                        </tr>
                    </tbody>
                </table>
    }
        </div>);
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, setParams }, dispatch);
}
function mapStateToProps(state) {
    const { params, checkedList } = state;
    return { params, checkedList };
};

export default connect(mapStateToProps, mapDispatchToProps)(Action);