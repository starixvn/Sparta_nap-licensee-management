﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from './action';
import Site from '../../../lib/site';
import Pager from '../../../components/Pager';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            gridData: [],
            dataItem: [],
            totalItem: 0,
            clientIsEditing:false,
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
            this.setState({ gridData: response.data.Data, dataItem: response.data.Data, totalItem: response.data.TotalItem, clientIsEditing: false });
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    onPaging = (index, size) => {
        let params = Object.assign({}, this.props.params, { PageIndex: index, PageSize: size, TimeStamp: new Date().getTime() });

        this.props.setParams(params);

        this.setState({
            clientIsEditing: false
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
        const { PageIndex, PageSize } = this.props.params;

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
                                gridData[index][key] = value
                          
                                // Trigger re-render
                                this.setState({ gridData })
                            }

                            const onAction = (isEdit) => {
                                const gridData = this.state.gridData.map(i => ({ ...i, editing: item.editing && i === item }))

                                gridData[index].editing = isEdit;

                                // Trigger re-render
                                this.setState({
                                    gridData,
                                    clientIsEditing: isEdit
                                });
                            }

                            const onCancel = (dataItem) => {
                                // Clone gridData data before mutation
                                const gridData = this.state.gridData.map(item => ({ ...item }))
                          
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
                                        {item.editing ? <span><i className="icon-checked" onClick={e => onAction(false)}/><i className="icon-cancel" onClick={e => onCancel(this.state.dataItem)}/></span> 
                                        : !!!this.state.clientIsEditing ? <i className="icon-edit" onClick={e => onAction(true)}/> : <i className="icon-edit"/>}
                                    </td>
                                    <td className="text-right">{item.editing ? <input type="number" className="text-right" value={item.Percent} onChange={ e => editField(e.target.value, 'Percent') }/> : <span>{item.Percent}</span>}</td>
                                    <td className="text-right">{item.editing ? <input type="number" className="text-right" value={item.ExpectedWL} onChange={ e => editField(e.target.value, 'ExpectedWL') }/> : <span>{item.ExpectedWL}</span>}</td>
                                    <td className="text-right">{item.AccumulatedWL}</td>
                                    <td className="text-right">{item.RemainingWL}</td>
                                    <td className="text-right">{item.editing ? <input type="number" className="text-right" value={item.ExpectedTurnover} onChange={ e => editField(e.target.value, 'ExpectedTurnover') }/> : <span>{item.ExpectedTurnover}</span>}</td>
                                    <td className="text-right">{item.AccumulatedTurnover}</td>
                                    <td className="text-right">{item.RemainingTurnover}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                    <tfoot>
                        <tr className="grant-total">
                            <th colSpan="2">Grand total</th>
                            <th></th>
                            <th className="text-right">{this.getTotals('ExpectedWL')}</th>
                            <th className="text-right">{this.getTotals('AccumulatedWL')}</th>
                            <th className="text-right">{this.getTotals('RemainingWL')}</th>
                            <th className="text-right">{this.getTotals('ExpectedTurnover')}</th>
                            <th className="text-right">{this.getTotals('AccumulatedTurnover')}</th>
                            <th className="text-right">{this.getTotals('RemainingTurnover')}</th>
                        </tr>
                    </tfoot>
            </table>
            <Pager 
                pageIndex={PageIndex}
                pageSize={PageSize}
                totalItem={totalItem}
                pageList={[20,50,100,500]}
                onPaging={this.onPaging} />
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