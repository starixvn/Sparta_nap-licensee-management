import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from '../base/action';
import Utility from '../../../lib/utility';
import Site from '../../../lib/site';
import RedmineConfirmForm from '../../../components/RedmineConfirmForm';

export class Action extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowPopup: false,
            confirmMsg: '',
            onConfirm: null,
            result: null
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.timeStamp !== this.props.params.timeStamp) {
            this.setState({ result: null });
        }
    }

    onClick(isAddAll) {
        this.setState({
            isShowPopup: true,
            confirmMsg: this._buildConfirmMsg(isAddAll),
            onConfirm: (redmineId) => this.onConfirm(redmineId, isAddAll)
        });
    }

    onConfirm = (redmineId, isAddAll) => {
        if (redmineId) {
            const param = this._getParam(redmineId, isAddAll);
            this._submit(param);
        }
        else {
            this._closePopup();
        }
    }

    _closePopup() {
        this.setState({
            isShowPopup: false,
            confirmMsg: '',
            onConfirm: null
        });
    }

    _buildConfirmMsg(isAddAll) {
        const { siteName, sourceSiteName, currencyName, role, fromDate, toDate } = this.props.params;
        const countSelectedItem = isAddAll ? 0 : this.props.checkedList.length;
        return (<div>
                <p>Site Name: <b>{siteName}</b></p>
                <p>Source Site Name: <b>{sourceSiteName}</b></p>
                <p>Currency: <b>{currencyName}</b></p>
                <p>Role: <b>{role}</b></p>
                <p>Date range: <b>{Utility.formatDate(fromDate)} - {Utility.formatDate(toDate)}</b></p>
                <p>{isAddAll ? ('Do you want to add all?') : ('Do you want to add ' + countSelectedItem + ' selected source data?')}</p>
         </div>);
    }

    _getParam(redmineId, isAddAll) {
        const sourceIdList = isAddAll ? null : this.props.checkedList.toString();
        const { params } = this.props;

        return {
            fromDate: params.fromDate,
            toDate: params.toDate,
            licenseeId: params.licenseeId,
            licenseeName: params.siteName,
            sourceLicenseeId: params.sourceLicenseeId,
            sourceLicenseeName: params.sourceSiteName,
            currencyId: params.currencyId,
            currency: params.currencyName,
            roleId: params.roleId,
            isAddAll: isAddAll,
            sourceIdList: sourceIdList,
            redmineId: redmineId
        }
    }

    _submit(param) {
        this.props.toggleLoader(true);
        const url = 'SourceLicenseeSetting/Add';

        Site.fetchData(param, url)
            .then(response => {
                if (response.data.IsSuccess) {
                    Utility.showMessage(response.data.Data);
                    this._updateGrid();
                    this._closePopup();
                }
                else {
                    Utility.showMessage(response.data.Error);
                    if (response.data.Data) {
                        this.setState({
                            result: {
                                invalidItems: response.data.Data.InvalidIds,
                                existedItems: response.data.Data.ExistedIds
                            }
                        });
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

    _buildResult(result) {
        let rows = [];
        if (result.invalidItems) {
            rows.push(
                <tr key='r1'>
                    <td>Source items do not exist</td>
                    <td>{result.invalidItems}</td>
                </tr>
            );
        }
        if (result.existedItems) {
            rows.push(
                <tr key='r2'>
                    <td>Source items overlap with an existing setting item</td>
                    <td>{result.existedItems}</td>
                </tr>
            );
        }

       return (
            <table className='table table-bordered'>
                <thead>
                    <tr><th colSpan={2}>Add Result</th></tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        );
    }

    render() {
        const { siteName, sourceSiteName, currencyName, role, fromDate, toDate } = this.props.params;
        const { isShowPopup, confirmMsg, onConfirm, result } = this.state;
        const countSelectedItem = this.props.checkedList.length;

        return(
        <div>
            <div style={{ display: 'inline-block' }}>
                <button className='btn btn-green' title='Add all items on all pages' onClick={() => this.onClick(true)} disabled={!siteName}>+ Add All</button>
                <button className='btn btn-green' title='Add selected items on current page' onClick={() => this.onClick(false)} disabled={countSelectedItem === 0}>+ Add Selected Data({countSelectedItem})</button>
            </div>
            {
                siteName &&
                <div>
                    Site Name: {siteName}, Source Site Name: {sourceSiteName}, Currency: {currencyName}, Role: {role}, {Utility.formatDate(fromDate)} - {Utility.formatDate(toDate)}
                </div>
            }
            <RedmineConfirmForm isShow={isShowPopup}
                msg={confirmMsg}
                style={{height: '350px', width: '400px'}}
                onConfirm={onConfirm} />
            {result && this._buildResult(result)}
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