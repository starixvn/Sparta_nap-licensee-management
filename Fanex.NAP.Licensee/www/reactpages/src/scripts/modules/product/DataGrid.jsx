import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams, setCheckedList } from './action';
import Site from '../../lib/site';
import Pager from '../../components/Pager';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { gridData: [], totalItem: 0, licenseeIdList: [] };
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
        const value = e.target.value;
        const { checkedList } = this.props;
        const { licenseeIdList } = this.state;
        let newCheckedList = [];

        if (e.target.checked) {
            if (value === '0') {
                newCheckedList = [...licenseeIdList];
            }
            else {
                newCheckedList = [...checkedList, value];
            }
        }
        else {
            if (value === '0') {
                newCheckedList = [];
            }
            else {
                newCheckedList = checkedList.filter(item => item !== value);
            }
        }

        this.props.setCheckedList(newCheckedList);
    }

    _getData() {
        this.props.toggleLoader(true);
        const params = {
            licenseeList: this.props.params.licenseeList,
            productList: this.props.params.productList.map(i => i.value).join(','),
            pageIndex: this.props.params.pageIndex,
            pageSize: this.props.params.pageSize
        }

        Site.fetchData(params, 'ManageProduct/Search').then(response => {
            const data = response.data.Data ? JSON.parse(response.data.Data) : [];
            this.setState({ gridData: data, totalItem: response.data.TotalItem, licenseeIdList: data.map(item => item.LicenseeName ) });
            this.props.toggleLoader(false);
            this.props.setCheckedList([]);
        });
    }

    render() {
        const { totalItem } = this.state;

        if (totalItem === 0) {
            return false;
        }

        const { gridData, confirmBox, licenseeIdList } = this.state;
        const { params, productList, checkedList } = this.props;
        const header = params.productList.length > 0 ? params.productList : productList;

        return (
            <div>
                <p>Search results: <b>{totalItem}</b> item(s)</p>
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
                                const checked = checkedList.indexOf(item.LicenseeName) > -1;

                                return (
                                    <tr key={item.LicenseeId}>
                                        <td className='text-center'><input type='checkbox' value={item.LicenseeName} checked={checked} onChange={this.onItemChecked} /></td>
                                        <td>{item.LicenseeName}</td>
                                        { 
                                            header.map(x => {
                                                return <td key={x.value} className='text-center'>{item[x.value] !== null && <span className='glyphicon glyphicon-ok green'></span>}</td>;
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
    return bindActionCreators({ toggleLoader, setParams, setCheckedList }, dispatch);
}
function mapStateToProps(state) {
    const { params, productList, checkedList } = state;
    return { params, productList, checkedList };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);