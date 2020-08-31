﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from './action';
import Site from '../../../lib/site';
import ConfirmBox from '../../../components/ConfirmBox';

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

    _showConfirmBox(isShow, index) {
        this.setState({ isShowConfirmBox: isShow, indexToUpdate: index });
    }

    onConfirm = (value) => {
        this._showConfirmBox(false);
        const { indexToUpdate } = this.state;
        if (value) {
            this._updateData(indexToUpdate);
        }
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.params, 'BetTicketVolumeControl/Search').then(response => {
            this.setState({ gridData: response.data.Data, dataItem: response.data.Data, totalItem: !!(response.data.Data) ? response.data.Data.length : 0, clientIsEditing: false });
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    _updateData(index) {
        this.props.toggleLoader(true);
        const gridData = this.state.gridData.map(item => ({ ...item }));
        const dataItem = this.state.dataItem.map(item => ({ ...item }));
        Site.fetchData({criteria: this.props.params, productSetting: gridData[index] }, 'BetTicketVolumeControl/Update').then(response => {
            gridData[index].editing = false;
            !!(response.data.IsSuccess) ? dataItem[index] = gridData[index] : gridData[index] = dataItem[index];
            this.setState({
                gridData,
                clientIsEditing: false,
                dataItem
            });
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    getTotals = (key) => {
        // Clone gridData data before mutation
        const gridData = this.state.gridData.map(item => ({ ...item }))
        let total = 0;
        gridData.forEach(item => {
          total += item[key] ? Number(item[key]) : 0;
        });
        return total;
    };

    render() {
        const { totalItem } = this.state;

        if (totalItem === 0) {
            return false;
        }

        const { gridData, clientIsEditing, isShowConfirmBox } = this.state;

        return (
            <div>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th rowSpan="2" colSpan="2">Product</th>
                            <th rowSpan="2">Percent (%)</th>
                            <th colSpan="3">Win Loss (USD)</th>
                            <th colSpan="3">Turnover (USD)</th>
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
                            const editField = (value, key) => {

                                // Clone gridData data before mutation
                                const gridData = this.state.gridData.map(item => ({ ...item }))

                                // Update field by index of current gridData
                                gridData[index][key] = Number(value.split(',').join(""));
                                gridData[index].WLRemaining = gridData[index].WLExpected - gridData[index].WLAccumulated;
                                gridData[index].TORemaining = gridData[index].TOExpected - gridData[index].TOAccumulated;

                                // Trigger re-render
                                this.setState({ gridData })
                            }

                            const onEdit = () => {
                                const gridData = this.state.gridData.map(i => ({ ...i, editing: item.editing && i === item }))

                                gridData[index].editing = true;

                                // Trigger re-render
                                this.setState({
                                    gridData,
                                    clientIsEditing: true
                                });
                            }

                            const onSave = (index) => {
                                this._showConfirmBox(true, index);
                            }

                            const onCancel = () => {
                                // Clone gridData data before mutation
                                const gridData = this.state.gridData.map(item => ({ ...item }))
                                const dataItem = this.state.dataItem.map(item => ({ ...item }))
                          
                                // Update field by index of current gridData
                                gridData[index] = dataItem[index]
                                gridData[index].editing = false;
                          
                                // Trigger re-render
                                this.setState({
                                    gridData,
                                    clientIsEditing: false
                                })
                            }

                            return (
                                <tr key={item.ProductId} className={item.editing ? 'editing' : ''}>
                                    <td>{item.ProductName}</td>
                                    <td className="text-center">
                                        {
                                            item.editing ? <span><i className="icon-checked" onClick={e => onSave(index)}/><i className="icon-cancel" onClick={e => onCancel()}/></span>
                                            : <i className="icon-edit" onClick={e => clientIsEditing ? false : onEdit()}/>
                                        }
                                    </td>
                                    <td className="text-right">
                                        {
                                            !item.editing ? <span>{item.ProductPercentage}</span>
                                            : <input type="number" min='0' max='100' className="text-right" value={item.ProductPercentage}
                                            onFocus={e => e.target.select()} onChange={e => e.target.value <= 100 ? editField(e.target.value, 'ProductPercentage') : false}/>
                                        }
                                    </td>
                                    <td className="text-right">
                                        {
                                            !item.editing ? <span>{item.WLExpected.toLocaleString('en')}</span>
                                            : <input type="text" maxLength='15' className="text-right" value={item.WLExpected ? item.WLExpected.toLocaleString('en') : 0}
                                            onFocus={e => e.target.select()} onChange={e => Number(e.target.value.split(',').join("")) >= item.WLAccumulated ? editField(e.target.value, 'WLExpected') : false}/>
                                        }
                                    </td>
                                    <td className="text-right">{item.WLAccumulated.toLocaleString('en')}</td>
                                    <td className="text-right">{item.WLRemaining.toLocaleString('en')}</td>
                                    <td className="text-right">
                                        {
                                            !item.editing ? <span>{item.TOExpected.toLocaleString('en')}</span>
                                            : <input type="text" className="text-right" maxLength='15' value={item.TOExpected.toLocaleString('en')}
                                            onFocus={e => e.target.select()} onChange={e => Number(e.target.value.split(',').join("")) >= item.WLAccumulated ? editField(e.target.value, 'TOExpected') : false}/>
                                        }
                                    </td>
                                    <td className="text-right">{item.TOAccumulated.toLocaleString('en')}</td>
                                    <td className="text-right">{item.TORemaining.toLocaleString('en')}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                    <tfoot>
                        <tr className="grant-total">
                            <th className="text-center" colSpan="2">Total</th>
                            <th></th>
                            <th className="text-right">{this.getTotals('WLExpected').toLocaleString('en')}</th>
                            <th className="text-right">{this.getTotals('WLAccumulated').toLocaleString('en')}</th>
                            <th className="text-right">{this.getTotals('WLRemaining').toLocaleString('en')}</th>
                            <th className="text-right">{this.getTotals('TOExpected').toLocaleString('en')}</th>
                            <th className="text-right">{this.getTotals('TOAccumulated').toLocaleString('en')}</th>
                            <th className="text-right">{this.getTotals('TORemaining').toLocaleString('en')}</th>
                        </tr>
                    </tfoot>
            </table>
            <ConfirmBox isShow={isShowConfirmBox}
                        title='Confirmation'
                        message='Do you want to update?'
                        style={{ height: '150px', width: '295px' }}
                        onClose={this.onConfirm} /> 
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