import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getGridData } from './action'

export class DataGrid extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.getGridData();
    }

    _renderExclusions(exclusions) {
        const exclusionList = exclusions && JSON.parse(exclusions);

        return (
            <ul>
                {
                    exclusionList && exclusionList.map((item, index) => {
                        return (
                            <li key={`e-${index}`}>{item}</li>
                        )
                    })
                }
            </ul>
        )
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
                        <th>Ignored Functions</th>
                        <th>IsTest</th>
                        <th>Site Id</th>
                        <th>Disable</th>
                        <th>Action</th>
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
                                    <td>{this._renderExclusions(item.Exclusions)}</td>
                                    <td>{item.IsTest ? "1" : "0"}</td>
                                    <td>{item.SiteId}</td>
                                    <td>{item.Disable ? "1" : "0"}</td>
                                    <td><a href={window.rootUrl + `Vendor/Edit?vendorId=${item.VendorId}`}>Edit</a></td>
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