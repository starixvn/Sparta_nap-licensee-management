﻿import React, { Component } from 'react';
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
            assignedCurrencies: [],
            unassignedCurrencies: [],
            isShowConfirmBox: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currencyParams.TimeStamp !== this.props.currencyParams.TimeStamp) {
            this._getData();
        }
    }

    get isValid() {
        const { assignedCurrencies, unassignedCurrencies} = this.state;

        return assignedCurrencies.length > 0 || unassignedCurrencies.length > 0;
    }

    onCheck(e, item) {
        const checked = e.target.checked;
        let newList = [];
        
        if (item.IsAssigned) {
            const newRemovedCurrencies = this._getNewCheckedCurrencyList(!checked, item, this.state.unassignedCurrencies);
            this.setState({ unassignedCurrencies: newRemovedCurrencies });
        }
        else {
            const newAssignedCurrencies = this._getNewCheckedCurrencyList(checked, item, this.state.assignedCurrencies);
            this.setState({ assignedCurrencies: newAssignedCurrencies });
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
        const { assignedCurrencies, unassignedCurrencies } = this.state;

        return {
            UserId: this.props.currencyParams.UserId,
            ActiveCurrencies: assignedCurrencies.map(x => { return { LicenseeName: x.LicenseeName, CurrencyId: x.CurrencyId }; }),
            DeactiveCurrencies: unassignedCurrencies.map(x => { return { LicenseeName: x.LicenseeName, CurrencyId: x.CurrencyId }; }),
            RedmineId: redmineId
        };
    }

    _submit(redmineId) {
        this.props.toggleLoader(true);
        const url = 'ITUserManagement/EditCurrency';
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

    _getNewCheckedCurrencyList(isCheck, item, oldList) {
        if (isCheck) {
            return [...oldList, item];
        }

        return oldList.filter(x => x !== item);
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.currencyParams, 'ITUserManagement/GetLicenseeUserCurrency').then(response => {
            this.setState({ gridData: response.data, assignedCurrencies: [], unassignedCurrencies: []});
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    _buildCurrencyRow(licensee, currencies, isActiveUser) {
        let currencyRows = [];

        const total = currencies.length;
        for(let j = 0; j < total; j++) {
            const currency = currencies[j];
            const checked = licensee.Checked 
            && (currency.IsAssigned ? this.state.unassignedCurrencies.indexOf(currency) === -1 : this.state.assignedCurrencies.indexOf(currency) > -1 );

            currencyRows.push(
                <tr key={`${licensee.Id}-${currency.CurrencyId}`} className={licensee.Checked ? '' : 'disable'}>
                    <td>
                    {currency.CurrencyName}
                    </td>
                    {
                        licensee.Checked && isActiveUser && (licensee.IsValid || currency.IsAssigned)
                        ? <td className='text-center'><input type='checkbox' checked={checked} onChange={(e) => this.onCheck(e, currency)} /></td>
                        : <td className='text-center'>{currency.IsAssigned && <span className='glyphicon glyphicon-ok green'></span>}</td>
                    }
                </tr>
            );
        }

        return currencyRows;
    }

    _buildTableBody(gridData, isActiveUser) {
        let grid = [];

        const total = gridData.length;
        for(let i = 0; i < total; i++) {
            const item = gridData[i];
            const currencyRows = this._buildCurrencyRow(item.Licensee, item.Currencies, isActiveUser);
            grid.push(
                <tr key={item.Licensee.Name} className={item.Licensee.Checked ? '' : 'disable'}>
                    <td className='middle' rowSpan={currencyRows.length + 1}><b>{item.Licensee.Name}{!item.Licensee.IsValid && <sup className='red'>*</sup>}</b></td>
                    <td className='middle text-center' rowSpan={currencyRows.length + 1}>{ item.Licensee.Checked && <span className='glyphicon glyphicon-ok green'></span>}</td>
                </tr>
            );
            grid.push(
                ...currencyRows
            );
        }

        return grid;
    }

    _buildTable(gridData, isActiveUser) {
        return (
          <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className='middle' rowSpan='2'>Licensee Name</th>
                            <th className='middle' rowSpan='2'>Active</th>
                            <th className='middle' colSpan='2'>Currency</th>
                        </tr>
                        <tr>
                            <th className='middle'>Name</th>
                            <th className='middle'>Assigned</th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        this._buildTableBody(gridData, isActiveUser)
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

        const { isActiveUser } = this.props;

        return (
            <div>
                {
                    isActiveUser &&
                    <div style={{ display: 'inline-block' }}>
                        <button className='btn btn-green' onClick={this.onSubmit} disabled={!this.isValid}>Update</button>
                    </div>
                }
                <RedmineConfirmForm isShow={isShowConfirmBox}
                    msg='Do you want to update currencies of user?'
                    style={{height: '210px', width: '400px'}}
                    onConfirm={this.onConfirm} />
                {this._buildTable(gridData, isActiveUser)}       
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { currencyParams } = state;
    return { currencyParams };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);