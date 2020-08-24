﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams, changeTotalWinloss } from './action';
import Site from '../../../lib/site';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            gridData: [], 
            totalItem: 0
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
            if (!!(response.data.Data)) {
                this.props.changeTotalWinloss(this.getTotals(response.data.Data, 'WLExpected'));
                this.setState({ gridData: response.data.Data, totalItem: response.data.Data.length });
            }
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    getTotals = (data,key) => {
        let total = 0;
        data.forEach(item => {
          total += item[key] ? parseInt(item[key]) : 0;
        });
        return total;
    };

    resetData = () => {
        const { gridData } = this.state;
        gridData.forEach(item => {
            item['Percentage'] = 0;
            item['WLExpected'] = 0;
            item['TOExpected'] = 0;
        });

         // Trigger re-render
         this.setState({ gridData })
    }

    render() {
        const { totalItem } = this.state;

        if ( totalItem === 0) {
            return (
                <a className="btn-back" href={window.rootUrl + 'BetTicketVolumeControl/Index'}>Back To List</a>
            )
        }

        const { gridData } = this.state;

        return (
            <div className="data-container">
                <table className="table table-bordered table-setting" id = "betticketTable">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Percent (%) (Mandatory)</th>
                            <th>Win Loss (USD) (Mandatory)</th>
                            <th>Turnover (USD) (Optional)</th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        gridData.map((item, index) => {
                            const editField = (value, key) => {

                                // Clone gridData data before mutation
                                const gridData = this.state.gridData.map(item => ({ ...item }))
                          
                                // Update field by index of current gridData
                                gridData[index][key] = value;

                                this.props.changeTotalWinloss(this.getTotals(gridData, 'WLExpected'));

                                // Trigger re-render
                                this.setState({ gridData })
                            }

                            return (
                                <tr key={item.ProductId}>
                                    <td>{item.ProductName}</td>
                                    <td><input type="number" className="text-right" value={item.Percentage ? item.Percentage : 0} onChange={ e => editField(e.target.value, 'WLPercentage') }/></td>
                                    <td><input type="number" className="text-right" value={item.WLExpected ? item.WLExpected : 0} onChange={ e => editField(e.target.value, 'WLExpected') }/></td>
                                    <td><input type="number" className="text-right" value={item.TOExpected ? item.TOExpected : 0} onChange={ e => editField(e.target.value, 'TOExpected') }/></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
            </table>

            <div style={{ display: 'inline-block', float: 'right' }}>
                <button type="button" className="btn btn-primary">Submit</button>
                <a className="btn-back" href={window.rootUrl + 'BetTicketVolumeControl/Index'}>Back To List</a>
                <button type="button" className="btn-back" onClick={this.resetData}>Reset</button>
            </div>
        </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, setParams, changeTotalWinloss }, dispatch);
}
function mapStateToProps(state) {
    const { params, totalWinLoss } = state;
    return { params, totalWinLoss };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);