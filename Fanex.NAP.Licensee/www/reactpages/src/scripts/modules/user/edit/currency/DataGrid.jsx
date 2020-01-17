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
            validCurrencies: [],
            isShowConfirmBox: false,
            checkedAll: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currencyParams.TimeStamp !== this.props.currencyParams.TimeStamp) {
            this._getData();
        }
    }

    get isValid() {
        const { validCurrencies } = this.state;

        return validCurrencies.findIndex(x => (x.IsAssigned && !x.Checked) || (!x.IsAssigned && x.Checked)) > -1;
    }

    onCheck(e, item) {
        const checked = e.target.checked;
        const { validCurrencies } = this.state;

        const newValidCurrencies = validCurrencies.map(x => {
            if (x == item) {
                return Object.assign({}, x, { Checked: checked });
            }

            return x;
        });

        const isCheckedAll = newValidCurrencies.findIndex(x => !x.Checked) == -1;

        this.setState({ validCurrencies: newValidCurrencies, checkedAll: isCheckedAll });
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

    onCheckAll(e) {
        const checked = e.target.checked;
        const { validCurrencies } = this.state;

        if (checked) {
            const newValidCurrencies = validCurrencies.map(x => {
                if (!x.Checked) {
                    return Object.assign({}, x, { Checked: true });
                }

                return x;
            });

            this.setState({ validCurrencies: newValidCurrencies, checkedAll: checked });

            return;
        }

        const newValidCurrencies = validCurrencies.map(x => {
            if (x.Checked) {
                return Object.assign({}, x, { Checked: false });
            }

            return x;
        });

        this.setState({ validCurrencies: newValidCurrencies, checkedAll: checked });
    }

    _showConfirmBox(isShow) {
        this.setState({ isShowConfirmBox: isShow });
    }

    _getParams(redmineId) {
        const { validCurrencies } = this.state;

        return {
            UserId: this.props.user.UserId,
            ActiveCurrencies: validCurrencies.filter(x => !x.IsAssigned && x.Checked),
            DeactiveCurrencies: validCurrencies.filter(x => x.IsAssigned && !x.Checked),
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

    _getData() {
        this.props.toggleLoader(true);

        const { user, currencyParams } = this.props;

        const params = {
            UserId: user.UserId,
            LicenseeId: currencyParams.LicenseeId,
            CurrencyId: currencyParams.CurrencyId
        };
        Site.fetchData(params, 'ITUserManagement/GetLicenseeUserCurrency')
            .then(response => {
                const validCurrencies = user.IsActive ? this._getValidCurrencies(response.data) : [];
                const isCheckedAll = validCurrencies.findIndex(x => !x.Checked) == -1;

                this.setState({
                    gridData: response.data,
                    validCurrencies: validCurrencies,
                    checkedAll: isCheckedAll
                });

                this.props.toggleLoader(false);
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    _getValidCurrencies(gridData) {
        let validCurrencies = [];

        for (let i = 0; i < gridData.length; i++) {
            const item = gridData[i];

            if (!item.Licensee.Checked) {
                continue;;
            }

            if (!item.Licensee.IsValid) {
                item.Currencies.forEach(x => {
                    if (x.IsAssigned) {
                        validCurrencies.push({
                            LicenseeName: x.LicenseeName,
                            CurrencyId: x.CurrencyId,
                            IsAssigned: x.IsAssigned,
                            Checked: x.IsAssigned,
                        });
                    }
                });
            }
            else {
                item.Currencies.forEach(x =>
                {
                    validCurrencies.push({
                        LicenseeName: x.LicenseeName,
                        CurrencyId: x.CurrencyId,
                        IsAssigned: x.IsAssigned,
                        Checked: x.IsAssigned
                    });
                });
            }
        }

        return validCurrencies;
    }

    _buildCurrencyRow(licensee, currencyData, validCurrencies) {
        let currencyRows = [];

        const total = currencyData.length;
        for (let j = 0; j < total; j++) {
            const currency = currencyData[j];
            const validCurrency = validCurrencies.find(x => x.LicenseeName == currency.LicenseeName && x.CurrencyId == currency.CurrencyId);

            currencyRows.push(
                <tr key={`${licensee.Id}-${currency.CurrencyId}`} className={licensee.Checked ? '' : 'disable'}>
                    <td>
                        {currency.CurrencyName}
                    </td>
                    {
                        validCurrency
                            ? <td className='text-center'><input type='checkbox' checked={validCurrency.Checked} onChange={(e) => this.onCheck(e, validCurrency)} /></td>
                            : <td className='text-center'>{currency.IsAssigned && <span className='glyphicon glyphicon-ok green'></span>}</td>
                    }
                </tr>
            );
        }

        return currencyRows;
    }

    _buildTableBody(gridData, validCurrencies) {
        let grid = [];

        const total = gridData.length;
        for (let i = 0; i < total; i++) {
            const item = gridData[i];
            const currencyRows = this._buildCurrencyRow(item.Licensee, item.Currencies, validCurrencies);
            grid.push(
                <tr key={item.Licensee.Name} className={item.Licensee.Checked ? '' : 'disable'}>
                    <td className='middle' rowSpan={currencyRows.length + 1}><b>{item.Licensee.Name}{!item.Licensee.IsValid && <sup className='red'>*</sup>}</b></td>
                    <td className='middle text-center' rowSpan={currencyRows.length + 1}>{item.Licensee.Checked && <span className='glyphicon glyphicon-ok green'></span>}</td>
                </tr>
            );
            grid.push(
                ...currencyRows
            );
        }

        return grid;
    }

    _buildTable(gridData, validCurrencies) {
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
                        <th className='middle'>
                            <label className="checkbox-inline node">
                                {
                                    validCurrencies && validCurrencies.length > 0 &&
                                    <input type="checkbox" checked={this.state.checkedAll} onChange={(e) => this.onCheckAll(e)} />
                                }
                                Assigned
                            </label>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {
                        this._buildTableBody(gridData, validCurrencies)
                    }
                </tbody>
            </table>
        );
    }

    render() {
        const { gridData, isShowConfirmBox, validCurrencies} = this.state;

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
                    msg='Do you want to update currencies of user?'
                    style={{ height: '210px', width: '400px' }}
                    onConfirm={this.onConfirm} />
                {this._buildTable(gridData, validCurrencies)}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { currencyParams, user } = state;
    return { currencyParams, user };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);