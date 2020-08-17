﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams, changeTotalWinloss } from './action';
import Site from '../../../lib/site';
import Pager from '../../../components/Pager';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            gridData: [], 
            totalItem: 0
        };
    }

    componentDidMount() {
        let params = Object.assign({}, this.props.params, { PageIndex: 1, PageSize: this.props.params.PageSize || 20, TimeStamp: new Date().getTime() });
        this.props.setParams(params);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.TimeStamp !== this.props.params.TimeStamp) {
           this._getData();
        }
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.params, 'BetTicketVolumeControl/Search').then(response => {
            this.props.changeTotalWinloss(this.getTotals(response.data.Data, 'ExpectedWL'));
            this.setState({ gridData: response.data.Data, totalItem: response.data.TotalItem });
            this.props.toggleLoader(false);
        }).catch(err => {
            this.props.toggleLoader(false);
        });
    }

    onPaging = (index, size) => {
        let params = Object.assign({}, this.props.params, { PageIndex: index, PageSize: size, TimeStamp: new Date().getTime() });

        this.props.setParams(params);
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
            item['Percent'] = 0;
            item['ExpectedWL'] = 0;
            item['ExpectedTurnover'] = 0;
        });

         // Trigger re-render
         this.setState({ gridData })
    }

    render() {
        const { totalItem } = this.state;

        if (totalItem === 0) {
            return false;
        }

        const { gridData } = this.state;
        const { PageIndex, PageSize } = this.props.params;

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

                                this.props.changeTotalWinloss(this.getTotals(gridData, 'ExpectedWL'));

                                // Trigger re-render
                                this.setState({ gridData })
                            }

                            return (
                                <tr key={item.ProductId}>
                                    <td>{item.ProductName}</td>
                                    <td><input type="number" className="text-right" value={item.Percent ? item.Percent : 0} onChange={ e => editField(e.target.value, 'Percent') }/></td>
                                    <td><input type="number" className="text-right" value={item.ExpectedWL ? item.ExpectedWL : 0} onChange={ e => editField(e.target.value, 'ExpectedWL') }/></td>
                                    <td><input type="number" className="text-right" value={item.ExpectedTurnover ? item.ExpectedTurnover : 0} onChange={ e => editField(e.target.value, 'ExpectedTurnover') }/></td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
            </table>
            <Pager 
                pageIndex={PageIndex}
                pageSize={PageSize}
                totalItem={totalItem}
                pageList={[20,50,100,500]}
                onPaging={this.onPaging} />

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