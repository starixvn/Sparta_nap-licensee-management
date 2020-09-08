﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from './action';
import Site from '../../../lib/site';
import ConfirmBox from '../../../components/ConfirmBox';
import Utility from '../../../lib/utility';

const maxValue = 999999999999999;

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gridData: [],
            dataItem: [],
            totalItem: 0,
            clientIsEditing:false,
            isShowConfirmBox: false,
            indexToUpdate: -1
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.TimeStamp !== this.props.params.TimeStamp) {
            this._getData();
        }
    }

    onConfirm = value => {
        this._showConfirmBox(false);
        const { indexToUpdate } = this.state;
        if (value) {
            this._updateData(indexToUpdate);
        }
    }

    _showConfirmBox(isShow, index) {
        this.setState({ isShowConfirmBox: isShow, indexToUpdate: index });
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.params, 'BetTicketVolumeControl/Search').then(response => {
            this.setState({gridData: response.data.Data, dataItem: response.data.Data, totalItem: !!(response.data.Data) ? response.data.Data.length : 0, clientIsEditing: false});
            this.props.toggleLoader(false);
        }).catch(() => {
            this.props.toggleLoader(false);
        });
    }

    _updateData(index) {
        this.props.toggleLoader(true);
        const gridData = this.state.gridData.map(item => ({ ...item }));
        const dataItem = this.state.dataItem.map(item => ({ ...item }));
        Site.fetchData({criteria: this.props.params, productSetting: gridData[index] }, 'BetTicketVolumeControl/Update').then(response => {
            gridData[index].editing = false;
            if (response.data.IsSuccess) {
                dataItem[index] = gridData[index];
            } else {
                gridData[index] = dataItem[index];
            }
            this.setState({
                gridData,
                clientIsEditing: false,
                dataItem
            });
            this.props.toggleLoader(false);
        }).catch(() => {
            this.props.toggleLoader(false);
        });
    }

    _getTotals = key => {
        // Clone gridData data before mutation
        const gridData = this.state.gridData.map(item => ({ ...item }));
        let total = 0;
        gridData.forEach(item => {
          total += isNaN(Number(item[key])) ? 0 : Number(item[key]);
        });
        return total;
    }

    editField = (value, key, index) => {
        // Clone gridData data before mutation
        const myGridData = this.state.gridData.map(rowData => ({ ...rowData }));
        const numberValue = Number(value.split(',').join(''));

        if (!(isNaN(numberValue) || numberValue > maxValue)) {
            // Update field by index of current gridData
            myGridData[index][key] = numberValue;
            myGridData[index].WLRemaining = myGridData[index].WLExpected - myGridData[index].WLAccumulated;
            myGridData[index].TORemaining = myGridData[index].TOExpected - myGridData[index].TOAccumulated;

            // Trigger re-render
            this.setState({ gridData: myGridData });
        }
    };

    onEdit = (index, item) => {
        if (this.state.clientIsEditing) {
            return;
        }
        const myGridData = this.state.gridData.map(i => ({ ...i, editing: item.editing && i === item }));

        myGridData[index].editing = true;

        // Trigger re-render
        this.setState({
            gridData : myGridData,
            clientIsEditing: true
        });
    };

    onSave = (rowIndex, item) => {
        if (item.WLExpected < item.WLAccumulated || item.TOExpected < item.TOAccumulated) {
            Utility.showWarningMessage('Expected is greater than or equal to Accumulated');
            return;
        }
        this._showConfirmBox(true, rowIndex);
    }

    onCancel = index => {
        // Clone gridData data before mutation
        const myGridData = this.state.gridData.map(rowData => ({ ...rowData }));
        const dataItem = this.state.dataItem.map(rowData => ({ ...rowData }));

        // Update field by index of current gridData
        myGridData[index] = dataItem[index];
        myGridData[index].editing = false;

        // Trigger re-render
        this.setState({
            gridData: myGridData,
            clientIsEditing: false
        });
    };

    render() {
        const { totalItem } = this.state;

        if (totalItem === 0) {
            return false;
        }

        const { gridData, isShowConfirmBox } = this.state;

        return (
            <div>
                <table className='table table-bordered table-hover'>
                    <thead>
                        <tr>
                            <th rowSpan='2' colSpan='2'>Product</th>
                            <th rowSpan='2'>Percent (%)</th>
                            <th colSpan='3'>Win Loss (USD)</th>
                            <th colSpan='3'>Turnover (USD)</th>
                        </tr>
                        <tr>
                            <th>Expected</th>
                            <th>Accumulated</th>
                            <th>Remaining</th>
                            <th>Expected</th>
                            <th>Accumulated</th>
                            <th>Remaining</th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        gridData.map((item, index) => {
                            return (
                                <tr key={item.ProductId} className={item.editing ? 'editing' : ''}>
                                    <td>{item.ProductName}</td>
                                    <td className='text-center'>
                                        {
                                            item.editing ?
                                            <span>
                                                <i className='icon-checked' onClick={() => this.onSave(index, item)}/>
                                                <i className='icon-cancel' onClick={() => this.onCancel(index)}/>
                                            </span>
                                            : <i className='icon-edit'  onClick={() => this.onEdit(index, item)}/>
                                        }
                                    </td>
                                    <td className='text-right'>
                                        {
                                            !item.editing ?
                                            <span>{item.ProductPercentage.toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</span>
                                            : <input type='number' min='0' max='100' className='text-right' value={item.ProductPercentage} onFocus={e => e.target.select()}
                                              onChange={e => e.target.value > 100 ? false : this.editField(e.target.value, 'ProductPercentage', index)}/>
                                        }
                                    </td>
                                    <td className='text-right'>
                                        {
                                            !item.editing ?
                                            <span>{item.WLExpected.toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</span>
                                            : <input type='text' maxLength='24' className= {'text-right'}
                                              value={item.WLExpected.toLocaleString('en', {maximumFractionDigits: 0})}
                                              onFocus={e => e.target.select()} onChange={e => this.editField(e.target.value, 'WLExpected', index)}/>
                                        }
                                    </td>
                                    <td className='text-right'>{item.WLAccumulated.toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                                    <td className='text-right'>{item.WLRemaining.toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                                    <td className='text-right'>
                                        {
                                            !item.editing ?
                                            <span>{item.TOExpected.toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</span>
                                            : <input type='text' maxLength='24' className= {'text-right'}
                                              value={item.TOExpected.toLocaleString('en', {maximumFractionDigits: 0})}
                                              onFocus={e => e.target.select()} onChange={e => this.editField(e.target.value, 'TOExpected', index)}/>
                                        }
                                    </td>
                                    <td className='text-right'>{item.TOAccumulated.toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                                    <td className='text-right'>{item.TORemaining.toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                    <tfoot>
                        <tr className='grant-total'>
                            <th className='text-center' colSpan='2'>Total</th>
                            <th></th>
                            <th className='text-right'>{this._getTotals('WLExpected').toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</th>
                            <th className='text-right'>{this._getTotals('WLAccumulated').toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</th>
                            <th className='text-right'>{this._getTotals('WLRemaining').toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</th>
                            <th className='text-right'>{this._getTotals('TOExpected').toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</th>
                            <th className='text-right'>{this._getTotals('TOAccumulated').toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</th>
                            <th className='text-right'>{this._getTotals('TORemaining').toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})}</th>
                        </tr>
                    </tfoot>
            </table>
            <ConfirmBox isShow={isShowConfirmBox}
                        title='Confirmation'
                        message='Do you want to update?'
                        style={{ height: '150px', width: '295px' }}
                        onClose={this.onConfirm}/>
        </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ toggleLoader, setParams }, dispatch);

const mapStateToProps = state => {
    const { params } = state;
    return { params };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);