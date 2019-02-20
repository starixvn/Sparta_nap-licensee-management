import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { toggleLoader, setParams } from './action'
import IgnoredFunctionToggleable from './IgnoredFunctionToggleable'
import { LicenseeType } from '../constant'
import Pager from '../../../components/Pager'
import Site from '../../../lib/site';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { gridData: [], totalItem: 0 };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.timeStamp !== this.props.params.timeStamp) {
            this._getData();
        }
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.params, 'LicenseeVendor/GetVendorInfoList').then(response => {
            this.setState({ gridData: response.data.Data, totalItem: response.data.TotalItem });
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    onPaging = (index, size) => {
        let params = Object.assign({}, this.props.params, { pageIndex: index, pageSize: size, timeStamp: new Date().getTime() });

        this.props.setParams(params);
    }

    render() {
        const { totalItem } = this.state;

        if (totalItem === 0) {
            return false;
        }

        const { gridData } = this.state;
        const { pageIndex, pageSize } = this.props.params;

        return (
        <div>
            <p>Search results: <b>{totalItem}</b> item(s)</p>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Vendor Id</th>
                        <th>Site Name</th>
                        <th>Licensee Type</th>
                        <th>Portal Url</th>
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
                        gridData.map(item => {
                            return (
                                <tr key={item.VendorId}>
                                    <td>{item.VendorId}</td>
                                    <td>{item.SiteName}</td>
                                    <td className="text-center">{LicenseeType[item.LicenseeType] || item.LicenseeType}</td>
                                    <td><a href={item.PortalUrl} target="_blank">{item.PortalUrl}</a></td>
                                    <td><a href={item.InternalUrl} target="_blank">{item.InternalUrl}</a></td>
                                    <td><a href={item.LrfUrl} target="_blank">{item.LrfUrl}</a></td>
                                    <td><a href={item.AffiliateUrl} target="_blank">{item.AffiliateUrl}</a></td>
                                    <td style={{ width: 240 }}>
                                        {item.ExclusionList && item.ExclusionList.length > 0 && <IgnoredFunctionToggleable functionList={item.ExclusionList} />}
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
            <Pager 
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalItem={totalItem}
                pageList={[20,50,100,500]}
                onPaging={this.onPaging} />
        </div>)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, setParams }, dispatch);
}
function mapStateToProps(state) {
    const { params } = state;
    return { params };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);