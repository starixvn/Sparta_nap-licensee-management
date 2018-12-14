import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from '../base/action';
import Utility from '../../../lib/utility';
import Site from '../../../lib/site';

export class Action extends Component {
    constructor(props) {
        super(props);
    }

    onClick(isAddAll) {
        const param = this._getParam(isAddAll);
        this._submit(param);
    }

    _getParam(isAddAll) {
        const sourceIdList = isAddAll ? null : this.props.checkedList.toString();
        const { fromDate, toDate, licenseeId, sourceLicenseeId, currencyId, roleId } = this.props.params;

        return {
            fromDate: fromDate,
            toDate: toDate,
            licenseeId: licenseeId,
            sourceLicenseeId: sourceLicenseeId,
            currencyId: currencyId,
            roleId: roleId,
            isAddAll: isAddAll,
            sourceIdList: sourceIdList
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

    render() {
        const { siteName, sourceSiteName, currencyName, role, fromDate, toDate } = this.props.params;
        const countSelectedItem = this.props.checkedList.length;

        return(
        <div>
            <div style={{ display: 'inline-block' }}>
                <button className='btn btn-green' title='Add all items on all pages' onClick={() => this.onClick(true)}>+ Add All</button>
                <button className='btn btn-green' title='Add selected items on current page' onClick={() => this.onClick(false)} disabled={countSelectedItem === 0}>+ Add Selected Data({countSelectedItem})</button>
            </div>
            {
                siteName &&
                <div>
                    Site Name: {siteName}, Source Site Name: {sourceSiteName}, Currency: {currencyName}, Role: {role}, {Utility.formatDate(fromDate)} - {Utility.formatDate(toDate)}
                </div>
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