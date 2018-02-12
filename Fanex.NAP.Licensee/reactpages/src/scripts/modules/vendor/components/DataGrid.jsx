import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getGridData } from '../action'

export class DataGrid extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.getGridData();
    }

    render() {
        const { gridData } = this.props;

        if (!gridData || !gridData.length) {
            return null;
        }

        return (
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Vendor Id</th>
                        <th>Site Name</th>
                        <th>Licensee Type</th>
                        <th>Internal Url</th>
                        <th>LRF Url</th>
                        <th>Affiliate Url</th>
                        <th>Exclusions</th>
                        <th>IsTest</th>
                        <th>Site Id</th>
                        <th>Disable</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        gridData.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.VendorId}</td>
                                    <td>{item.SiteName}</td>
                                    <td>{item.LicenseeType}</td>
                                    <td>{item.InternalUrl}</td>
                                    <td>{item.LrfUrl}</td>
                                    <td>{item.AffiliateUrl}</td>
                                    <td>{item.Exclusions}</td>
                                    <td>{item.IsTest}</td>
                                    <td>{item.SiteId}</td>
                                    <td>{item.Disable}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getGridData }, dispatch);
}
function mapStateToProps(state) {
    const { gridData } = state;
    return { gridData };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);