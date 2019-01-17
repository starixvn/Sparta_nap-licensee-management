﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from './action';
import Site from '../../../lib/site';
import Pager from '../../../components/Pager';

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
        Site.fetchData(this.props.params, 'LicenseeSetting/Search').then(response => {
            this.setState({ gridData: response.data.Data, totalItem: response.data.TotalItem });
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
                            <th>Licensee Name</th>
                            <th>Deposit</th>
                            <th>Affected Date</th>
                            <th>Active</th>
                            <th>KPI Active</th>
                            <th>OneWork Active</th>
                            <th>Brand Name</th>
                            <th>Company Name</th>
                            <th>Allow Member Comm</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        gridData.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.LicenseeName}</td>
                                    <td className="text-center"><span className={item.IsDeposit ? 'glyphicon glyphicon-ok green' : ''}></span></td>
                                    <td className="text-right">{item.AffectedDateString}</td>
                                    <td className="text-center"><span className={item.IsActive ? 'glyphicon glyphicon-ok green' : ''}></span></td>
                                    <td className="text-center"><span className={item.IsKPIActive ? 'glyphicon glyphicon-ok green' : ''}></span></td>
                                    <td className="text-center"><span className={item.IsOneWorkActive ? 'glyphicon glyphicon-ok green' : ''}></span></td>
                                    <td>{item.BrandName}</td>
                                    <td>{item.CompanyName}</td>
                                    <td className="text-center"><span className={item.IsAllowedMemberComm ? 'glyphicon glyphicon-ok green' : ''}></span></td>
                                    <td className="text-center">
                                        <a href={window.rootUrl + `LicenseeSetting/Edit?licenseeName=${item.LicenseeName}`}>
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
        </div>
        )
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