import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Loader from '../../../components/Loader'
import FormFilter from '../base/FormFilterBase'
import DataGrid from '../base/DataGridBase'
import Action from './Action'

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    _buildHeader = () => {
        return [
                <th key='1'>Site Name</th>,
                <th key='2'>Source Id</th>,
                <th key='3'>Currency</th>,
                <th key='4'>Role</th>,
                <th key='5'>Source Site Name</th>,
                <th key='6'>Effective Date</th>,
                <th key='7'>End Date</th>
            ];
    }

    _buildBody = (item, index) => {
        return [
                <td key={`${index}-1`}>{item.SiteName}</td>,
                <td key={`${index}-2`}>{item.SourceId}</td>,
                <td key={`${index}-3`}>{item.CurrencyName}</td>,
                <td key={`${index}-4`}>{item.Roleid}</td>,
                <td key={`${index}-5`}>{item.SourceSiteName}</td>,
                <td key={`${index}-6`}>{item.EffectiveDateString}</td>,
                <td key={`${index}-7`}>{item.EndDateString}</td>
        ];
    }

    render() {
        return (
            <div>
                <Loader isLoading={this.props.isLoading} />
                <FormFilter />
                <Action />
                <DataGrid 
                    url='SourceLicenseeSetting/Search'
                    keyValue='Id'
                    header={this._buildHeader}
                    body={this._buildBody} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { isLoading } = state;
    return { isLoading };
};

export default connect(mapStateToProps)(AppContainer);