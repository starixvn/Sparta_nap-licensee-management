import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from '../base/action';
import Utility from '../../../lib/utility';
import Site from '../../../lib/site';
import Popup from '../../../components/Popup';
import ConfirmBox from '../../../components/ConfirmBox';

export class Action extends Component {
    constructor(props) {
        super(props);

        this.state = this._initialState();
    }

    _initialState() {
        const today = new Date();
        let tomorow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        return {
            stopDate: Utility.getDateString(today),
            restart: false,
            newEffectiveDate: Utility.getDateString(tomorow),
            newEndDate: Utility.getDateString(new Date(2050, 0, 1)),
            redmineId: '',
            isShowPopup: false,
            isShowConfirmation: false
        };
    }

    get isValidPopup() {
        const { stopDate, restart, newEndDate, newEffectiveDate, redmineId } = this.state;

        return stopDate && redmineId && (!restart || ( newEndDate && newEffectiveDate ));
    }

    onClick = () => {
        this.setState({ isShowPopup: true });
    }

    onSubmit = () => {
        this.setState({ isShowConfirmation: true });
    }

    onPopupClose = () => {
        this.setState(this._initialState());
    }

    onConfirm = (value) => {
        if (value) {
            this._submit();
        }
        else {
            this.onPopupClose();
        }
    }

    _getParam() {
        return {
            stopDate: this.state.stopDate,
            restart: this.state.restart,
            newEffectiveDate: this.state.newEffectiveDate,
            newEndDate: this.state.newEndDate
        };
    }

    _submit() {
        this.props.toggleLoader(true);
        const url = 'SourceLicenseeSetting/Update';
        const param = this._getParam();

        Site.fetchData(param, url)
            .then(response => {
                if (response.data.IsSuccess) {
                    Utility.showMessage(response.data.Data);
                    this._updateGrid();
                }
                else {
                    Utility.showMessage(response.data.Error);
                    if (response.data.Data) {
                        
                    }
                    this.props.toggleLoader(false);
                }
            }).catch(err => {
                Utility.showMessage('Please try again!');
                this.props.toggleLoader(false);
            });
    }

    _updateGrid() {
        const filterParams = Object.assign({}, this.props.params, { timeStamp: new Date().getTime() });
        this.props.setParams(filterParams);
    }

    _buildPopupContent(stopDate, restart, newEndDate, newEffectiveDate, redmineId) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>Stop From</label>
                    <input className={`full-width ${stopDate ? '' : 'has-error'}`}
                        type='date'
                        value={stopDate}
                        onChange={(e) => this.setState({ stopDate: e.target.value })} />
                </div>
                <div className='form-group'>
                    <label className="checkbox-inline">           
                        <input type="checkbox" name="restart" onChange={(e) => this.setState({ restart: e.target.checked })} checked={this.state.restart} />
                        Restart
                    </label>
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>New Effectived Date</label>
                    <input className={`full-width ${!restart || newEffectiveDate ? '' : 'has-error'}`} 
                        type='date' value={newEffectiveDate}
                        onChange={(e) => this.setState({ newEffectiveDate: e.target.value })} />
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>New End Date</label>
                    <input className={`full-width ${!restart || newEndDate ? '' : 'has-error'}`}
                        type='date' value={newEndDate}
                        onChange={(e) => this.setState({ newEndDate: e.target.value })} />
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Redmine Id</label>
                    <input className={`full-width ${redmineId ? '' : 'has-error'}`}
                        type='text'
                        value={redmineId}
                        onChange={(e) => this.setState({ redmineId: e.target.value })} />
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
        const { stopDate, restart, newEndDate, newEffectiveDate, redmineId, isShowPopup, isShowConfirmation } = this.state;
        const countSelectedItem = this.props.checkedList.length;

        return(
        <div>
            <div style={{ display: 'inline-block' }}>
                <a className='btn btn-green' href={window.rootUrl + 'SourceLicenseeSetting/Add'}>+ Add New Setting</a>
                <button className='btn btn-red' onClick={this.onClick} disabled={countSelectedItem === 0}>Suspend({countSelectedItem})</button>
            </div>
            <ConfirmBox isShow={isShowConfirmation}
                title='Confirmation'
                message={`Do you want to stop getting data on ${stopDate} and restart with date range ${newEffectiveDate}-${newEndDate}`}
                style={{ height: '160px', width: '400px' }}
                onClose={this.onConfirm} /> 
            <Popup isShow={isShowPopup}
                title='Offer New Product'
                content={this._buildPopupContent(stopDate, restart, newEndDate, newEffectiveDate, redmineId)}
                className='no-scroll'
                style={{height: '410px', width: '600px'}}
                onClose={this.onPopupClose} />
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