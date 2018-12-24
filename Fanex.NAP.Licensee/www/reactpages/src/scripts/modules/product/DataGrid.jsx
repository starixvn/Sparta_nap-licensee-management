import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from './action';
import Site from '../../lib/site';
import ConfirmBox from '../../components/ConfirmBox';
import Utility from '../../lib/utility';
import Pager from '../../components/Pager';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { gridData: [], totalItem: 0, checkedList: [], licenseeIdList: [] };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.timeStamp !== this.props.params.timeStamp) {
            this._getData();
        }
    }

    onPaging = (index, size) => {
        let params = Object.assign({}, this.props.params, { pageIndex: index, pageSize: size, timeStamp: new Date().getTime() });

        this.props.setParams(params);
    }

    onItemChecked = (e) => {
        const value = parseInt(e.target.value);
        const { checkedList, licenseeIdList } = this.state;
        let newCheckedList = [];

        if (e.target.checked) {
            if (value === 0) {
                newCheckedList = [...licenseeIdList];
            }
            else {
                newCheckedList = [...checkedList, value];
            }
        }
        else {
            if (value === 0) {
                newCheckedList = [];
            }
            else {
                newCheckedList = checkedList.filter(item => item !== value);
            }
        }

        this.setState({ checkedList: newCheckedList });
    }

    _getData() {
        this.props.toggleLoader(true);
        const params = {
            licenseeList: this.props.params.licenseeList,
            productList: this.props.params.productList.map(i => i.value).join(',')
        }

        Site.fetchData(this.props.params, 'ManageProduct/Search').then(response => {
            const data = response.data.Data ? JSON.parse(response.data.Data) : [];
            this.setState({ gridData: data, totalItem: response.data.TotalItem, licenseeIdList: data.map(item => item.LicenseeId) });
            this.props.toggleLoader(false);
        });
    }

    render() {
        const { gridData, totalItem, confirmBox, checkedList, licenseeIdList } = this.state;
        const { params, productList } = this.props;

        if (gridData.length === 0) {
            return false;
        }

        const header = params.productList.length > 0 ? params.productList : productList;

        return (
            <div>
                <p>Search results: <b>{gridData.length}</b> item(s)</p>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{width: '40px'}}><input type='checkbox' value={0} checked={licenseeIdList.length === checkedList.length} onChange={this.onItemChecked} /></th>
                            <th>Licensee</th>
                            {
                                header.map(x => {
                                    return <th title={x.label} key={x.value}>{x.value}</th>;
                                })
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            gridData.map((item, index) => {
                                const checked = checkedList.indexOf(item.LicenseeId) > -1;

                                return (
                                    <tr key={item.LicenseeId}>
                                        <td className='text-center'><input type='checkbox' value={item.LicenseeId} checked={checked} onChange={this.onItemChecked} /></td>
                                        <td>{item.LicenseeName}</td>
                                        { 
                                            header.map(x => {
                                                return <td key={x.value} className='text-center'><span className={item[x.value] ? 'glyphicon glyphicon-ok green' : ''}></span></td>;
                                            })
                                        }
                                    </tr>
                                )
                            })
                    }
                    </tbody>
                </table>
                <Pager 
                    pageIndex={params.pageIndex}
                    pageSize={params.pageSize}
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
    const { params, productList } = state;
    return { params, productList };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);