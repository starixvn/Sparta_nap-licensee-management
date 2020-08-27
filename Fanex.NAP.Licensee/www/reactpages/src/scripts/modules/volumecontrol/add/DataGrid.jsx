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
        Site.fetchData({ brandCode: this.props.params['brandCode'] }, 'BetTicketVolumeControl/GetAddSettingList').then(response => {
            if (!!(response.data.Data)) {
                this.props.changeTotalWinloss(this.getTotals(response.data.Data, 'WLExpected'));
                this.setState({ gridData: response.data.Data, totalItem: response.data.Data.length });
            }
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    onSubmit = (e) => {
        e.preventDefault();

        this._insertData();
    }

    _insertData() {
        this.props.toggleLoader(true);
        const gridData = this.state.gridData.map(item => ({ ...item }));
        Site.fetchData({criteria: this.props.params, productSettingList: gridData }, 'BetTicketVolumeControl/Insert').then(response => {
            if (!!response.data.IsSuccess) {
                window.location.href = window.rootUrl + 'BetTicketVolumeControl/Index';
            } else {
                alert(response.data.Error);
            }
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    getTotals = (data,key) => {
        let total = 0;
        data.forEach(item => {
          total += item[key] ? Number(item[key]) : 0;
        });
        return total;
    };

    resetData = () => {
        const { gridData } = this.state;
        gridData.forEach(item => {
            item['ProductPercentage'] = 0;
            item['WLExpected'] = 0;
            item['TOExpected'] = 0;
        });

        this.props.changeTotalWinloss(0);

         // Trigger re-render
         this.setState({ gridData });
    }

    render() {
        const { totalItem } = this.state;

        if ( totalItem === 0) {
            return (
                <a className="btn-back" href={window.rootUrl + 'BetTicketVolumeControl/Index'}>Back To List</a>
            );
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
                                const gridData = this.state.gridData.map(item => ({ ...item }));

                                // Update field by index of current gridData
                                gridData[index][key] = parseFloat(value.split(',').join(''));

                                this.props.changeTotalWinloss(this.getTotals(gridData, 'WLExpected'));

                                // Trigger re-render
                                this.setState({ gridData });
                            }

                            return (
                                <tr key={item.ProductId}>
                                    <td>{item.ProductName}</td>
                                    <td><input type="number" min='0' max='100' className="text-right"
                                        value={item.ProductPercentage ? item.ProductPercentage : 0}
                                        onFocus={e => e.target.select()}
                                        onChange={ e => e.target.value <= 100 ? editField(e.target.value, 'ProductPercentage') : false }/>
                                    </td>
                                    <td><input type="text" className="text-right" maxLength='15'
                                        value={item.WLExpected ? item.WLExpected.toLocaleString('en') : 0}
                                        onFocus={e => e.target.select()} onChange={ e => editField(e.target.value, 'WLExpected') }/>
                                    </td>
                                    <td><input type="text" className="text-right" maxLength='15'
                                        value={item.TOExpected ? item.TOExpected.toLocaleString('en') : 0}
                                        onFocus={e => e.target.select()} onChange={ e => editField(e.target.value, 'TOExpected') }/>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
            </table>

            <div style={{ display: 'inline-block', float: 'right' }}>
                <button type="button" className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
                <a className="btn-back" href={window.rootUrl + 'BetTicketVolumeControl/Index'}>Back To List</a>
                <button type="button" className="btn-back" onClick={this.resetData}>Reset</button>
            </div>
        </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, setParams, changeTotalWinloss }, dispatch);
}
function mapStateToProps(state) {
    const { params, totalWinLoss } = state;
    return { params, totalWinLoss };
}

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);