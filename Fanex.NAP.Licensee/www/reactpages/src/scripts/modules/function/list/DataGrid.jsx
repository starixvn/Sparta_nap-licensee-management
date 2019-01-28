﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Site from '../../../lib/site';
import AssignFunctionForm from './AssignFunctionForm';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            gridData: [],
            totalItem: 0,
            assignMenu: { isShow: false, functionId: 0, functionName: '' } 
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.TimeStamp !== this.props.params.TimeStamp) {
            this._getData();
        }
    }

    onAssignAction(id, name) {
        this.setState({ assignMenu: {functionId: id, isShow: true, functionName: name} });
    }

    onCloseAssignMenu = () => {
        this.setState({ assignMenu: {functionId: 0, isShow: false, functionName: ''} });
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.params, 'ManageLrfFunction/Search').then(response => {
            this.setState({ gridData: response.data.Data, totalItem: response.data.TotalItem });
            this.props.toggleLoader(false);
        });
    }

    _buildHierarchy(data) {
        let grid = [];

        const total = data.length;
        for(let i = 0; i < total; i++) {
            this._buildNode(data[i], 0, grid);
        }

        return grid;
    }

    _buildNode(node, level, grid) {
        grid.push(
          <tr key={node.FunctionId} className={node.IsActive ? '' : 'disable'}>
                <td className='text-center'>{node.FunctionId}</td>
                <td>
                    <span style={{display: 'inline-block', width: `${30*level}px`}}></span>
                    { level > 0 && <span className='hierarchy-node'></span> }
                    {node.Name} {node.IsNew && <sup className='green'>NEW</sup>} {node.Environment !== 'LIVE' && <sup className='orange'>NON-LIVE</sup>}
                </td>
                <td>{node.FunctionKey}</td>
                <td>{node.Url}</td>
                <td className='text-center'>{node.DisplayOrder}</td>
                <td className='text-center'>{node.IsMenu && <span className='glyphicon glyphicon-ok green'></span>}</td>
                <td className='text-center'>{node.IsFunction && <span className='glyphicon glyphicon-ok green'></span>}</td>
                <td className='text-center'>{node.IsActive && <span className='glyphicon glyphicon-ok green'></span>}</td>
                <td className='text-center'>{node.Environment}</td>
                <td className="text-center">
                    <a title={`Edit "${node.Name}"`} href={window.rootUrl + `ManageLrfFunction/Get?id=${node.FunctionId}`}>
                        <i className="icon-edit"></i>
                    </a>
                    {
                        node.IsActive &&
                        <i title={`Assign "${node.Name}" to licensee`} 
                            className="icon-list"
                            style={{marginLeft: '15px'}}
                            onClick={() => this.onAssignAction(node.FunctionId, node.Name)}></i>
                    }
                </td>
            </tr>
        );

        const total = node.Children.length;
        for(let j = 0; j < total; j++) {
            this._buildNode(node.Children[j], level + 1, grid);
        }
    }

    render() {
        const totalItem = this.state.totalItem;

        if (totalItem === 0) {
            return false;
        }

        const { gridData, assignMenu } = this.state;

        return (
            <div>
                <AssignFunctionForm isShow={assignMenu.isShow}
                    functionId={assignMenu.functionId}
                    functionName={assignMenu.functionName}
                    onClose={this.onCloseAssignMenu} />
                <p>Search results: <b>{totalItem}</b> item(s)</p>
                <table className='table table-bordered table-hover'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Function Key</th>
                            <th>Url</th>
                            <th>Order</th>
                            <th>Menu</th>
                            <th>Function</th>               
                            <th>Active</th>
                            <th>Environment</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        this._buildHierarchy(gridData)
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