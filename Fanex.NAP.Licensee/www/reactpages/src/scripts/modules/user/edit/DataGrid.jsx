﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from '../common/action';
import Site from '../../../lib/site';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { gridData: [], checkedList: [] };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.TimeStamp !== this.props.params.TimeStamp) {
            this._getData();
        }
    }

    onCheck(e, item) {
        const checkedList = this.state.checkedList;
        let newList = [];
        
        if (e.target.checked) {
            newList = [...checkedList, item];
        }
        else {
            newList = checkedList.filter(x => x !== item);
        }

        this.setState({ checkedList: newList });
    }

    _getCheckedList(data, checkedList) {
        const total = data.length;
        for(let j = 0; j < total; j++) {
            const item = data[j];
            if (item.UserFunctionId > 0) {
                checkedList.push(item);
            }

            this._getCheckedList(item.Children, checkedList);
        }
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.params, 'ITUserManagement/GetLicenseeUserFunction').then(response => {
            const checkedList = [];
            const gridData = response.data;

            const total = gridData.length;
            for(let i = 0; i < total; i++) {
                this._getCheckedList(gridData[i].Functions, checkedList);
            }
            
            this.setState({ gridData: gridData, checkedList: checkedList });
            this.props.toggleLoader(false);
        });
    }

    _buildFunctionNode(licensee, node, level, hierachy) {
        const checked = licensee.Checked && this.state.checkedList.indexOf(node) > -1;

        hierachy.push(
            <tr key={`${licensee.Id}-${node.FunctionId}`} className={licensee.Checked ? '' : 'disable'}>
                <td>
                    <span style={{display: 'inline-block', width: `${30*level}px`}}></span>
                    { level > 0 && <span className='hierarchy-node'></span> }
                    {node.FunctionName}
                        </td>
                    {
                        licensee.Checked
                        ? <td className='text-center'><input type='checkbox' checked={checked} onChange={(e) => this.onCheck(e, node)} /></td>
                        : <td className='text-center'>{node.UserFunctionId > 0 && <span className='glyphicon glyphicon-ok green'></span>}</td>
                    }
            </tr>
        );

        const total = node.Children.length;
        for(let k = 0; k < total; k++) {
            this._buildFunctionNode(licensee, node.Children[k], level + 1, hierachy);
        }
    }

    _buildFunctionHierachy(licensee, functions) {
        let hierachy = [];

        const total = functions.length;
        for(let j = 0; j < total; j++) {
            this._buildFunctionNode(licensee, functions[j], 0, hierachy);
        }

        return hierachy;
    }

    _buildTableBody(gridData) {
        let grid = [];

        const total = gridData.length;
        for(let i = 0; i < total; i++) {
            const item = gridData[i];
            const hierachy = this._buildFunctionHierachy(item.Licensee, item.Functions);
            grid.push(
                <tr key={item.Licensee.Name} className={item.Licensee.Checked ? '' : 'disable'}>
                    <td className='middle' rowSpan={hierachy.length + 1}>{item.Licensee.Name}</td>
                    <td className='middle text-center' rowSpan={hierachy.length + 1}>{ item.Licensee.Checked && <span className='glyphicon glyphicon-ok green'></span>}</td>
                </tr>
            );
            grid.push(
                ...hierachy
            );
        }

        return grid;
    }

    _buildTable(gridData) {
        return (
          <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className='middle' rowSpan='2'>Licensee Name</th>
                            <th className='middle' rowSpan='2'>Active</th>
                            <th className='middle' colSpan='2'>Function</th>
                        </tr>
                        <tr>
                            <th className='middle'>Name</th>
                            <th className='middle'>Assigned</th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        this._buildTableBody(gridData)
                    }
                    </tbody>
            </table>  
        );
    }

    render() {
        const { gridData } = this.state;

        if (gridData.length === 0) {
            return false;
        }

        return (
            <div>
                {this._buildTable(gridData)}
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