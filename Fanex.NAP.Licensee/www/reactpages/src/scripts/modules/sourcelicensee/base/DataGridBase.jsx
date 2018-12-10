import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from './action';
import Site from '../../../lib/site'
import Pager from '../../../components/Pager'

export class DataGridBase extends Component {
    constructor(props) {
        super(props);

        this.state = { gridData: [], totalItem: 0, checkedList: [] };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.timeStamp !== this.props.params.timeStamp) {
            this._getData();
        }
    }

    _getData() {
        this.props.toggleLoader(true);
        Site.fetchData(this.props.params, this.props.url).then(response => {
            this.setState({ gridData: response.data.Data, totalItem: response.data.TotalItem });
            this.props.toggleLoader(false);
        });
    }

    onItemChecked = (e) => {
    }

    _buildHeader(header) {
        return (
            <tr>
                <th><input type='checkbox' value={0} onChange={this.onItemChecked} /></th>
                {header()}
            </tr>
        );
    }

    _buildBody(gridData, body, key) {
        return gridData.map((item, index) => {
            return (
            <tr key={index}>
                <td className="text-center"><input type='checkbox'value={item[key]} onChange={this.onItemChecked /></td>
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
        const { gridData, totalItem } = this.state;
        const { pageIndex, pageSize } = this.props.params;
        const { header, body, key, onItemChecked } = this.props;

        if (totalItem === 0) {
            return false;
        }

        return (
            <div>
                <table className='table table-bordered table-hover'>
                    <thead>
                        {this._buildHeader(header)}
                    </thead>

                    <tbody>
                        {this._buildBody(gridData, body, key)}
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
    return bindActionCreators({ toggleLoader, setParams }, dispatch);
}
function mapStateToProps(state) {
    const { params } = state;
    return { params };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGridBase);