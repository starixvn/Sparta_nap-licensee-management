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
        if (prevProps.params.TimeStamp !== this.props.params.TimeStamp) {
            this._getData();
        }
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.params, 'ITUserManagement/Search').then(response => {
            this.setState({ gridData: response.data.Data, totalItem: response.data.TotalItem });
            this.props.toggleLoader(false);
        });
    }

    onPaging = (index, size) => {
        let params = Object.assign({}, this.props.params, { PageIndex: index, PageSize: size, TimeStamp: new Date().getTime() });

        this.props.setParams(params);
    }

    render() {
        const { totalItem } = this.state;

        if (totalItem === 0) {
            return false;
        }

        const { gridData } = this.state;
        const { PageIndex, PageSize } = this.props.params;

        return (
            <div>
                <p>Search results: <b>{totalItem}</b> item(s)</p>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Internal</th>
                            <th>Created Date</th>
                            <th>Licensee</th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        gridData.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.UserName}</td>
                                    <td>{item.FirstName}</td>
                                    <td>{item.LastName}</td>
                                    <td className="text-center">{item.UserRole}</td>
                                    <td>{item.Email}</td>
                                    <td className="text-center">{item.Status}</td>
                                    <td className="text-center"><span className={item.IsInternal ? 'glyphicon glyphicon-ok green' : ''}></span></td>
                                    <td className="text-right">{item.CreateDateString}</td>
                                    <td>{item.LicenseeName}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
            </table>
            <Pager 
                pageIndex={PageIndex}
                pageSize={PageSize}
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