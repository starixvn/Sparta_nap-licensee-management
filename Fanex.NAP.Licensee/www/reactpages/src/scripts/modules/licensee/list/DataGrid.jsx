﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Site from '../../../lib/site'

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { gridData: [] };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.timeStamp !== this.props.params.timeStamp) {
            this._getData();
        }
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.params, 'LicenseeSetting/Search').then(response => {
            this.setState({ gridData: response.data });
            this.props.toggleLoader(false);
        });
    }

    render() {
        const gridData = this.state.gridData;

        if (gridData.length === 0) {
            return false;
        }

        return (
            <div>
                <p>Search results: <b>{gridData.length}</b> item(s)</p>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Licensee Name</th>
                            <th>Description</th>
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
                                    <td>{item.Description}</td>
                                    <td className="text-center"><span className={item.IsDeposit ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                    <td className="text-right">{item.AffectedDateString}</td>
                                    <td className="text-center"><span className={item.IsActive ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                    <td className="text-center"><span className={item.IsKPIActive ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                    <td className="text-center"><span className={item.IsOneWorkActive ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                    <td>{item.BrandName}</td>
                                    <td>{item.CompanyName}</td>
                                    <td className="text-center"><span className={item.IsAllowedMemberComm ? 'glyphicon glyphicon-ok' : ''}></span></td>
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
        </div>
        )
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