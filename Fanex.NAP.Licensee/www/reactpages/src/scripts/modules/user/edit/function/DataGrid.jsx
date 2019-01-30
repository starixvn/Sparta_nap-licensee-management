﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from '../action';
import Site from '../../../../lib/site';
import RedmineConfirmForm from '../../../../components/RedmineConfirmForm';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gridData: [],
            assignedFunctions: [],
            unassignedFunctions: [],
            isShowConfirmBox: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.functionParams.TimeStamp !== this.props.functionParams.TimeStamp) {
            this._getData();
        }
    }

    get isValid() {
        const { assignedFunctions, unassignedFunctions} = this.state;

        return assignedFunctions.length > 0 || unassignedFunctions.length > 0;
    }

    onCheck(e, item) {
        const checked = e.target.checked;
        let newList = [];
        
        if (item.UserFunctionId > 0) {
            const newRemovedFunctions = this._getNewCheckedFunctionList(!checked, item, this.state.unassignedFunctions);
            this.setState({ unassignedFunctions: newRemovedFunctions });
        }
        else {
            const newAssignedFunctions = this._getNewCheckedFunctionList(checked, item, this.state.assignedFunctions);
            this.setState({ assignedFunctions: newAssignedFunctions });
        }
    }

    onSubmit = () => {
        this._showConfirmBox(true);
    }

    onConfirm = (redmineId) => {
        this._showConfirmBox(false);
        
        if (redmineId) {
            this._submit(redmineId);
        }
    }

    _showConfirmBox(isShow) {
        this.setState({ isShowConfirmBox: isShow });
    }

    _getParams(redmineId)
    {
        const { assignedFunctions, unassignedFunctions } = this.state;

        return {
            UserName: this.props.functionParams.UserName,
            NewFunctions: assignedFunctions.map(x => { return { LicenseeName: x.LicenseeName, FunctionId: x.FunctionId }; }),
            RemovedFunctions: unassignedFunctions.map(x => { return { LicenseeName: x.LicenseeName, FunctionId: x.FunctionId }; }),
            RedmineId: redmineId
        };
    }

    _submit(redmineId) {
        this.props.toggleLoader(true);
        const url = 'ITUserManagement/EditFunction';
        const params = this._getParams(redmineId);

        Site.fetchData(params, url)
            .then(response => {
                if (response.data.Error) {
                    Utility.showMessage(response.data.Error);
                }
                else {
                    Utility.showMessage('Success!');
                }
                this._getData();
            }).catch(err => {
                Utility.showMessage('Error!');
                this.props.toggleLoader(false);
            });
    }

    _getNewCheckedFunctionList(isCheck, item, oldList) {
        if (isCheck) {
            return [...oldList, item];
        }

        return oldList.filter(x => x !== item);
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.functionParams, 'ITUserManagement/GetLicenseeUserFunction').then(response => {
            this.setState({ gridData: response.data, assignedFunctions: [], unassignedFunctions: []});
            this.props.toggleLoader(false);
        });
    }

    _buildFunctionNode(licensee, node, level, hierachy) {
        const checked = licensee.Checked 
            && (node.UserFunctionId > 0 ? this.state.unassignedFunctions.indexOf(node) === -1 : this.state.assignedFunctions.indexOf(node) > -1 );

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
                    <td className='middle' rowSpan={hierachy.length + 1}><b>{item.Licensee.Name}</b></td>
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
        const { gridData, isShowConfirmBox } = this.state;

        if (gridData.length === 0) {
            return false;
        }

        return (
            <div>
                 <div style={{ display: 'inline-block' }}>
                    <button className='btn btn-green' onClick={this.onSubmit} disabled={!this.isValid}>Update</button>
                </div>
                <RedmineConfirmForm isShow={isShowConfirmBox}
                    msg='Do you want to update functions of user?'
                    style={{height: '210px', width: '400px'}}
                    onConfirm={this.onConfirm} />
                {this._buildTable(gridData)}       
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { functionParams } = state;
    return { functionParams };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);