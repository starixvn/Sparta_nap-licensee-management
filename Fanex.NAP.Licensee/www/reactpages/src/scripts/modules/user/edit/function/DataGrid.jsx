import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from '../action';

import Site from '../../../../lib/site';
import RedmineConfirmForm from '../../../../components/RedmineConfirmForm';
import Utility from '../../../../lib/utility';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gridData: [],
            validFunctions: [],
            isShowConfirmBox: false,
            checkedAll: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.functionParams.TimeStamp !== this.props.functionParams.TimeStamp) {
            this._getData();
        }
    }

    get isValid() {
        const { validFunctions } = this.state;

        return validFunctions.findIndex(x => (x.IsAssigned && !x.Checked) || (!x.IsAssigned && x.Checked)) > -1;
    }

    onCheck(e, item) {
        const checked = e.target.checked;
        const { validFunctions } = this.state;

        const newValidFunctions = validFunctions.map(x => {
            if (x == item) {
                return Object.assign({}, x, { Checked: checked });
            }

            return x;
        });

        const isCheckedAll = newValidFunctions.findIndex(x => !x.Checked) == -1;

        this.setState({ validFunctions: newValidFunctions, checkedAll: isCheckedAll });
    }

    onCheckAll(e) {
        const checked = e.target.checked;
        const { validFunctions } = this.state;

        if (checked) {
            const newValidFunctions = validFunctions.map(x => {
                if (!x.Checked) {
                    return Object.assign({}, x, { Checked: true });
                }
                return x;
            });

            this.setState({ validFunctions: newValidFunctions, checkedAll: checked });

            return;
        }

        const newValidFunctions = validFunctions.map(x => {
            if (x.Checked) {
                return Object.assign({}, x, { Checked: false });
            }

            return x;
        });

        this.setState({ validFunctions: newValidFunctions, checkedAll: checked });
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

    _getParams(redmineId) {
        const { validFunctions } = this.state;

        return {
            UserId: this.props.user.UserId,
            NewFunctions: validFunctions.filter(x => !x.IsAssigned && x.Checked),
            RemovedFunctions: validFunctions.filter(x => x.IsAssigned && !x.Checked),
            RedmineId: redmineId
        };
    }

    _submit(redmineId) {
        this.props.toggleLoader(true);
        const url = 'ITUserManagement/EditFunction';
        const params = this._getParams(redmineId);

        Site.fetchData(params, url)
            .then(response => {
                if (!response.data.IsSuccess) {
                    Utility.showErrorMessage(response.data.Error);
                }
                else {
                    if (response.data.Error) {
                        Utility.showWarningMessage(response.data.Error);
                    }
                    else {
                        Utility.showMessage('Success!');
                    }
                }
                this._getData();
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    _getData() {
        this.props.toggleLoader(true);
        const { user, functionParams } = this.props;

        const params = {
            UserId: user.UserId,
            LicenseeId: functionParams.LicenseeId,
            FunctionId: functionParams.FunctionId
        };
        Site.fetchData(params, 'ITUserManagement/GetLicenseeUserFunction')
            .then(response => {
                const validFunctions = user.IsActive ? this._getValidFunctions(response.data) : [];
                const isCheckedAll = validFunctions.findIndex(x => !x.Checked) == -1;

                this.setState({ gridData: response.data, validFunctions: validFunctions, checkedAll: isCheckedAll });
                this.props.toggleLoader(false);
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    _getValidChildFunctions(parent, checkValidFunc) {
        let validFunctions = [];

        if (checkValidFunc(parent)) {
            validFunctions.push({ LicenseeName: parent.LicenseeName, FunctionId: parent.FunctionId, IsAssigned: parent.UserFunctionId > 0, Checked: parent.UserFunctionId > 0  });
        }       

        for (let i = 0; i < parent.Children.length; i++) {
            const childFunctions = this._getValidChildFunctions(parent.Children[i], checkValidFunc);
            validFunctions.push(...childFunctions);
        }

        return validFunctions;
    }

    _getValidFunctions(gridData) {
        let validFunctions = [];

        for (let i = 0; i < gridData.length; i++) {
            const item = gridData[i];

            if (!item.Licensee.Checked) {
                continue;
            }

            let checkValidFunc;

            if (!item.Licensee.IsValid) {
                checkValidFunc = (x) => x.UserFunctionId > 0;
            }
            else {
                checkValidFunc = (x) => x.UserFunctionId > 0 || x.IsActive;
            }

            for (let j = 0; j < item.Functions.length; j++) {
                const childFunctions = this._getValidChildFunctions(item.Functions[j], checkValidFunc);
                validFunctions.push(...childFunctions);
            }
        }

        return validFunctions;
    }

    _buildFunctionNode(licensee, node, level, hierachy, validFunctions) {
        const validFunction = validFunctions.find(x => x.LicenseeName == node.LicenseeName && x.FunctionId == node.FunctionId);

        hierachy.push(
            <tr key={`${licensee.Id}-${node.FunctionId}`} className={licensee.Checked ? '' : 'disable'}>
                <td>
                    <span style={{ display: 'inline-block', width: `${30 * level}px` }}></span>
                    {level > 0 && <span className='hierarchy-node'></span>}
                    {node.FunctionName}
                </td>
                {
                    validFunction
                        ? <td className='text-center'><input type='checkbox' checked={validFunction.Checked} onChange={(e) => this.onCheck(e, validFunction)} /></td>
                        : <td className='text-center'>{node.UserFunctionId > 0 && <span className='glyphicon glyphicon-ok green'></span>}</td>
                }
            </tr>
        );

        const total = node.Children.length;
        for (let k = 0; k < total; k++) {
            this._buildFunctionNode(licensee, node.Children[k], level + 1, hierachy, validFunctions);
        }
    }

    _buildFunctionHierachy(licensee, functions, validFunctions) {
        let hierachy = [];

        const total = functions.length;
        for (let j = 0; j < total; j++) {
            this._buildFunctionNode(licensee, functions[j], 0, hierachy, validFunctions);
        }

        return hierachy;
    }

    _buildTableBody(gridData, validFunctions) {
        let grid = [];

        const total = gridData.length;
        for (let i = 0; i < total; i++) {
            const item = gridData[i];
            const hierachy = this._buildFunctionHierachy(item.Licensee, item.Functions, validFunctions);
            grid.push(
                <tr key={item.Licensee.Name} className={item.Licensee.Checked ? '' : 'disable'}>
                    <td className='middle' rowSpan={hierachy.length + 1}><b>{item.Licensee.Name}{!item.Licensee.IsValid && <sup className='red'>*</sup>}</b></td>
                    <td className='middle text-center' rowSpan={hierachy.length + 1}>{item.Licensee.Checked && <span className='glyphicon glyphicon-ok green'></span>}</td>
                </tr>
            );
            grid.push(
                ...hierachy
            );
        }

        return grid;
    }

    _buildTable(gridData, validFunctions) {
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
                        <th className='middle'>
                            <label className="checkbox-inline node">
                                {
                                    validFunctions && validFunctions.length > 0 &&
                                    <input type="checkbox" checked={this.state.checkedAll} onChange={(e) => this.onCheckAll(e)} />
                                }
                                Assigned
                            </label>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {
                        this._buildTableBody(gridData, validFunctions)
                    }
                </tbody>
            </table>
        );
    }

    render() {
        const { gridData, isShowConfirmBox, validFunctions } = this.state;

        if (gridData.length === 0) {
            return false;
        }

        const { user } = this.props;

        return (
            <div>
                {
                    user.IsActive &&
                    <div style={{ display: 'inline-block' }}>
                        <button className='btn btn-green' onClick={this.onSubmit} disabled={!this.isValid}>Update</button>
                    </div>
                }
                <RedmineConfirmForm isShow={isShowConfirmBox}
                    msg='Do you want to update functions of user?'
                    style={{ height: '210px', width: '400px' }}
                    onConfirm={this.onConfirm} />
                {this._buildTable(gridData, validFunctions)}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { functionParams, user } = state;
    return { functionParams, user };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);