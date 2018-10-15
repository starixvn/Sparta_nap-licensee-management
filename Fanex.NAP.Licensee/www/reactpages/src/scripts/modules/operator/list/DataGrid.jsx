import React, { Component } from 'react';
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
        Site.fetchData(this.props.params, 'ManageOperator/Search').then(response => {
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
                <table className="table table-bordered">
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
                                    <tr key={index}>
                                        <td>{item.SiteName}</td>
                                        <td>{item.AgentId}</td>
                                        <td>{item.UserName}</td>
                                        <td>{item.CurrencyName}</td>
                                        <td>{item.OperatorId}</td>
                                        {
                                            (item.OperatorId === null || item.OperatorId === '')
                                            ? <td className="text-center">
                                                <a href={window.rootUrl + `ManageOperator/Get?agentId=${item.AgentId}`}>
                                                    <i className="icon-edit"></i>
                                                </a>
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
    return Object.assign({}, { params });
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);