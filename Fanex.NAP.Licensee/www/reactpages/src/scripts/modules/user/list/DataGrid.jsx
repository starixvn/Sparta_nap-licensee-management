﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from './action';
import Site from '../../../lib/site';
import Pager from '../../../components/Pager';
import LicenseeForm from './LicenseeForm';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            gridData: [], 
            totalItem: 0,
            assignMenu: { isShow: false, userId: 0, userName: '', isAdmin: false, isActive: false }
        };
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
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    onAssignAction(id, name, isAdmin, isActive) {
        this.setState({ assignMenu: {userId: id, isShow: true, userName: name, isAdmin: isAdmin, isActive: isActive} });
    }

    onCloseAssignForm = () => {
        this.setState({ assignMenu: {userId: 0, isShow: false, userName: '', isAdmin: false, isActive: false} });
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

        const { gridData, assignMenu } = this.state;
        const { PageIndex, PageSize } = this.props.params;

        return (
            <div>
                <LicenseeForm isShow={assignMenu.isShow}
                    userId={assignMenu.userId}
                    userName={assignMenu.userName}
                    isAdmin={assignMenu.isAdmin}
                    isActive={assignMenu.isActive}
                    onClose={this.onCloseAssignForm} />
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
                            <th>Created Date</th>
                            <th>Licensee Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        gridData.map((item, index) => {
                            return (
                                <tr key={item.UserId}>
                                    <td>{item.UserName}</td>
                                    <td>{item.FirstName}</td>
                                    <td>{item.LastName}</td>
                                    <td className="text-center">{item.UserRole}</td>
                                    <td>{item.Email}</td>
                                    <td className="text-center">{item.Status}</td>
                                    <td className="text-right">{item.CreateDateString}</td>
                                    <td>{item.LicenseeName}</td>
                                    <td className="text-center">
                                    <a title={`${item.IsActive ? 'Edit' : 'View'} permission of "${item.UserName}"`} href={window.rootUrl + `ITUserManagement/Edit?UserId=${item.UserId}`}>
                                            <i className="icon-edit"></i>
                                    </a>
                                    <i title={`${item.IsActive && assignMenu.isAdmin ? 'Edit' : 'View'} licensee for "${item.UserName}"`} 
                                        className="icon-list"
                                        style={{marginLeft: '15px'}}
                                        onClick={() => this.onAssignAction(item.UserId, item.UserName, item.IsAdmin, item.IsActive)}></i>
                                    </td>
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