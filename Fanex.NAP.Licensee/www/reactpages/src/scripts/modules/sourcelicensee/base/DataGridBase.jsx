import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams, setCheckedList } from './action';
import Site from '../../../lib/site';
import Pager from '../../../components/Pager';

export class DataGridBase extends Component {
    constructor(props) {
        super(props);

        this.state = { gridData: [], totalItem: 0, activeItems: [] };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.timeStamp !== this.props.params.timeStamp) {
            this._getData();
        }
    }

    _getData() {
        this.props.toggleLoader(true);

        const { params, url, keyValue } = this.props;
        Site.fetchData(params, url).then(response => {
            const activeItems = response.data.Data.filter(item => item.IsActive).map(item => item[keyValue]);
            this.setState({ gridData: response.data.Data, totalItem: response.data.TotalItem, activeItems: activeItems });
            
            this.props.toggleLoader(false);
            this.props.setCheckedList([]);
        });
    }

    onItemChecked = (e) => {
        const value = parseInt(e.target.value);
        const { checkedList } = this.props;
        const { activeItems } = this.state;
        let newCheckedList = [];

        if (e.target.checked) {
            if (value === 0) {
                newCheckedList = [...activeItems];
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

        this.props.setCheckedList(newCheckedList);
    }

    _buildHeader(checkedList, activeItems, header) {
        return (
            <tr>
                <th style={{width: '40px'}}>{activeItems.length > 0 && <input type='checkbox' value={0} checked={activeItems.length === checkedList.length} onChange={this.onItemChecked} />}</th>
                {header()}
            </tr>
        );
    }

    _buildBody(checkedList, gridData, body, key) {
        return gridData.map((item, index) => {
            const checked = checkedList.indexOf(item[key]) > -1;
            const active = item.IsActive;

            return (
            <tr key={index} className={active ? '' : 'disable'}>
                <td className="text-center">{ active && <input type='checkbox' value={item[key]} checked={checked} onChange={this.onItemChecked} /> }</td>
                {body(item, index)}
            </tr>
           );
        })
    }

    onPaging = (index, size) => {
        let params = Object.assign({}, this.props.params, { pageIndex: index, pageSize: size, timeStamp: new Date().getTime() });

        this.props.setParams(params);
    }

    render() {
        const { totalItem } = this.state;

        if (totalItem === 0) {
            return false;
        }

        const { gridData, activeItems } = this.state;
        const { pageIndex, pageSize } = this.props.params;
        const { header, body, keyValue, checkedList } = this.props;

        return (
            <div>
                <p>Search results: <b>{totalItem}</b> item(s)</p>
                <table className='table table-bordered table-hover'>
                    <thead>
                        {this._buildHeader(checkedList, activeItems, header)}
                    </thead>

                    <tbody>
                        {this._buildBody(checkedList, gridData, body, keyValue)}
                    </tbody>
                </table>
                <Pager 
                    pageIndex={pageIndex}
                    pageSize={pageSize}
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
    const { params, checkedList } = state;
    return { params, checkedList };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGridBase);