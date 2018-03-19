import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getGridData } from './action'
import IgnoredFunctionToggleable from './IgnoredFunctionToggleable'
import { LicenseeType } from '../constant'

export class DataGrid extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
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
                                    <td className="text-center">{LicenseeType[item.LicenseeType] || item.LicenseeType}</td>
                                    <td>{item.InternalUrl}</td>
                                    <td>{item.LrfUrl}</td>
                                    <td>{item.AffiliateUrl}</td>
                                    <td style={{ width: 240 }}>
                                        {item.Exclusions && <IgnoredFunctionToggleable functionList={item.Exclusions} />}
                                    </td>
                                    <td className="text-center">{item.IsTest ? "Yes" : "No"}</td>
                                    <td className="text-center">{item.SiteId}</td>
                                    <td className="text-center">{item.Disable ? "Yes" : "No"}</td>
                                    <td className="text-center">
                                        <a href={window.rootUrl + `LicenseeVendor/Edit?vendorId=${item.VendorId}`} title="Edit">
                                            <i className="icon-edit"></i>
                                        </a>
                                    </td>
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