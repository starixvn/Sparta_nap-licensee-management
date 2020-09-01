﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams, changeTotalWinloss } from './action';
import Site from '../../../lib/site';
import ConfirmBox from '../../../components/ConfirmBox';

const maxValue = 999999999999999;

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gridData: [],
            totalItem: 0,
            isShowConfirmBox: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.TimeStamp !== this.props.params.TimeStamp) {
           this._getData();
        }
    }

    onConfirm = (value) => {
        this._showConfirmBox(false);

        if (value) {
            this._insertData();
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        this._showConfirmBox(true);
    }

    _showConfirmBox(isShow) {
        this.setState({ isShowConfirmBox: isShow });
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData({ brandCode: this.props.params['brandCode'] }, 'BetTicketVolumeControl/GetAddSettingList').then(response => {
            if (!!(response.data.Data)) {
                this.props.changeTotalWinloss(this._getTotals(response.data.Data, 'WLExpected'));
                this.setState({ gridData: response.data.Data, totalItem: response.data.Data.length });
            }
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
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

    _getTotals = (data,key) => {
        let total = 0;
        data.forEach(item => {
           total += item[key] ? isNaN(Number(item[key])) ? 0 : Number(item[key]) : 0;
        });
        return total;
    };

    _resetData = () => {
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

        const { gridData, isShowConfirmBox } = this.state;

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

                                let tempValue = Number(value.split(',').join(''));
                                let numberVaule = isNaN(tempValue) ? gridData[index][key] : tempValue > maxValue ? gridData[index][key] : tempValue;

                                // Update field by index of current gridData
                                gridData[index][key] = numberVaule;

                                this.props.changeTotalWinloss(this._getTotals(gridData, 'WLExpected'));

                                // Trigger re-render
                                this.setState({ gridData })
                            }

                            return (
                                <tr key={item.ProductId}>
                                    <td>{item.ProductName}</td>
                                    <td><input type="number" min='0' max='100' className="text-right"
                                        value={item.ProductPercentage ? item.ProductPercentage : 0}
                                        onFocus={e => e.target.select()}
                                        onChange={ e => e.target.value <= 100 ? editField(e.target.value, 'ProductPercentage') : false }/>
                                    </td>
                                    <td><input type="text" maxLength='24' className= {"text-right"}
                                        value={item.WLExpected.toLocaleString('en', {maximumFractionDigits: 2})}
                                        onFocus={e => e.target.select()} onChange={ e => editField(e.target.value, 'WLExpected') }/>
                                    </td>
                                    <td><input type="text" maxLength='24' className= {"text-right"}
                                        value={item.TOExpected.toLocaleString('en', {maximumFractionDigits: 2})}
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
                <button type="button" className="btn-back" onClick={this._resetData}>Reset</button>
            </div>
            <ConfirmBox isShow={isShowConfirmBox}
                        title='Confirmation'
                        message='Do you want to add this setting?'
                        style={{ height: '150px', width: '295px' }}
                        onClose={this.onConfirm} /> 
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