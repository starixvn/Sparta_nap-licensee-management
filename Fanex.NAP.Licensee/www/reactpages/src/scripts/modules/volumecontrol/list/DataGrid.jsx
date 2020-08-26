﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from './action';
import Site from '../../../lib/site';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            gridData: [],
            dataItem: [],
            totalItem: 0,
            clientIsEditing:false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.TimeStamp !== this.props.params.TimeStamp) {
            this._getData();
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

    _updateData(item, index) {
        this.props.toggleLoader(true);
        Site.fetchData({criteria: this.props.params, productSetting: item }, 'BetTicketVolumeControl/Update').then(response => {
            const gridData = this.state.gridData.map(i => ({ ...i, editing: item.editing && i === item }))
            const dataItem = this.state.dataItem.map(item => ({ ...item }))
            gridData[index].editing = false;
            gridData[index].WLExpected = parseInt(item.WLExpected);
            gridData[index].TOExpected = parseInt(item.TOExpected);
            if (!!response.data.IsSuccess) {
                this.setState({
                    gridData,
                    clientIsEditing: false,
                    dataItem: gridData,
                });
            } else {
                gridData[index] = dataItem[index];
                this.setState({
                    gridData,
                    clientIsEditing: false
                });
            }
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    getTotals = (key) => {
        let total = 0;
        this.state.gridData.forEach(item => {
          total += item[key] ? parseInt(item[key]) : 0;
        });
        return total;
    };

    render() {
        const { totalItem } = this.state;

        if (totalItem === 0) {
            return false;
        }

        const { gridData } = this.state;

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
                                // gridData[index][key] = value
                                gridData[index][key] = parseFloat(value.split(',').join(""));
                          
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

                            const onSave = (item) => {
                                this._updateData(item, index);
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
                                    <td>
                                        {item.editing ? <span><i className="icon-checked" onClick={e => onSave(item)}/><i className="icon-cancel" onClick={e => onCancel()}/></span> 
                                        : !!!this.state.clientIsEditing ? <i className="icon-edit" onClick={e => onEdit()}/> : <i className="icon-edit"/>}
                                    </td>
                                    <td className="text-right">{item.editing ? <input type="number" className="text-right" value={item.ProductPercentage} onChange={ e => editField(e.target.value, 'ProductPercentage') }/> : <span>{item.ProductPercentage}</span>}</td>
                                    <td className="text-right">{item.editing ? <input type="text" className="text-right" value={item.WLExpected ? item.WLExpected.toLocaleString('en') : 0} onChange={ e => editField(e.target.value, 'WLExpected') }/> : <span>{item.WLExpected.toLocaleString('en')}</span>}</td>
                                    <td className="text-right">{item.WLAccumulated.toLocaleString('en')}</td>
                                    <td className="text-right">{item.WLRemaining.toLocaleString('en')}</td>
                                    <td className="text-right">{item.editing ? <input type="text" className="text-right" value={item.TOExpected.toLocaleString('en')} onChange={ e => editField(e.target.value, 'TOExpected') }/> : <span>{item.TOExpected.toLocaleString('en')}</span>}</td>
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