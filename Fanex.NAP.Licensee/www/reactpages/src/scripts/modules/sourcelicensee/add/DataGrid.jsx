import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from '../base/action';
import DataGridBase from '../base/DataGridBase';
import Utility from '../../../lib/utility';

export class DataGrid extends Component {
    constructor(props) {
        super(props);
    }

    _buildHeader = () => {
        return [
                <th key='1'>Source Id</th>,
                <th key='2'>Currency</th>,
                <th key='3'>Role</th>,
                <th key='4'>Existed</th>,
                <th key='5'>Effective Date</th>,
                <th key='6'>End Date</th>
            ];
    }

    _buildBody = (item, index) => {
        return [
                <td key={`${index}-1`}>{item.SourceId}</td>,
                <td key={`${index}-2`}>{item.CurrencyName}</td>,
                <td key={`${index}-3`}>{item.Role}</td>,
                <td key={`${index}-4`} className="text-center"><span className={item.IsActive ? 'glyphicon glyphicon-ok green' : ''}></span></td>,
                <td key={`${index}-5`}>{item.EffectiveDateString}</td>,
                <td key={`${index}-6`}>{item.EndDateString}</td>,
        ];
    }

    render() {
        const { siteName, sourceSiteName, currencyName, role, fromDate, toDate } = this.props.params;

        return(
        <div>
            <div style={{ display: 'inline-block' }}>
                <button className='btn btn-green' title='Add all items on all pages'>+ Add All</button>
                <button className='btn btn-green' title='Add selected items on current page'>+ Add Selected Data</button>
            </div>
            {
                siteName &&
                <div>
                    Site Name: {siteName}, Source Site Name: {sourceSiteName}, Currency: {currencyName}, Role: {role}, {Utility.formatDate(fromDate)} - {Utility.formatDate(toDate)}
                </div>
            }
            <DataGridBase 
                url='SourceLicenseeSetting/GetSourceData'
                key='SourceId'
                header={this._buildHeader}
                body={this._buildBody} />
        </div>);
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { params } = state;
    return { params };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);