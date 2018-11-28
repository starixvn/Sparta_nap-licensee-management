import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Site from '../../../lib/site';
import ConfirmBox from '../../../components/ConfirmBox';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { gridData: [], confirmBox: { isShow: false, data: 0 } };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.timeStamp !== this.props.params.timeStamp) {
            this._getData();
        }
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.params, 'ManageOperator/Search').then(response => {
            this.setState({ gridData: response.data });
            this.props.toggleLoader(false);
        });
    }

    _onDelete(agentId) {
        this._showConfirmBox(true, agentId);

    }

    _onConfirm(result, agentId) {
        this._showConfirmBox(false, 0);

        if (result) {
            this._delete(agentId);
        }
    }

    _showConfirmBox(isShow, data) {
        this.setState({ confirmBox: { isShow: isShow, data: data } });
    }

    _delete(agentId) {
        this.props.toggleLoader(true);
        Site.fetchData({ agentId: agentId }, 'ManageOperator/Delete')
            .then(response => {                
                if (!response.data.IsSuccess) {
                    this._alert('Success!');   
                }
                else {
                    this._alert(response.data.Error);
                }
                this.props.toggleLoader(false);
                this._getData();
            }).catch(err => {
                this._alert('Please try again!');
                this.props.toggleLoader(false);
            });
    }

    render() {
        const { gridData, confirmBox } = this.state;

        if (gridData.length === 0) {
            return false;
        }

        return (
            <div>
                <ConfirmBox isShow={confirmBox.isShow}
                    title='Confirmation'
                    message={`Do you want to delete operator ${confirmBox.data}?`}
                    style={{ height: '150px', width: '400px' }}
                    onClose={(value) => this._onConfirm(result, confirmBox.data)} /> 
                <p>Search results: <b>{gridData.length}</b> item(s)</p>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Site Name</th>
                            <th>Agent ID</th>
                            <th>User Name</th>
                            <th>Currency</th>
                            <th>Operator ID</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            gridData.map((item, index) => {
                                return (
                                    <tr key={item.AgentId}>
                                        <td>{item.SiteName}</td>
                                        <td>{item.AgentId}</td>
                                        <td>{item.UserName}</td>
                                        <td>{item.CurrencyName}</td>
                                        <td>{item.OperatorId}</td>
                                        {
                                            (item.OperatorId === null || item.OperatorId === '')
                                            ? <td className="text-center">
                                                <a href={window.rootUrl + `ManageOperator/Get?agentId=${item.AgentId}`} title='Edit'>
                                                    <i className="icon-edit"></i>
                                                </a>
                                                <span onClick={() => this._onDelete(item.AgentId)} title='Delete' style={{'paddingLeft': '15px'}}>
                                                    <i className="icon-delete"></i>
                                                </span>
                                              </td>
                                            : <td></td>
                                        }
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