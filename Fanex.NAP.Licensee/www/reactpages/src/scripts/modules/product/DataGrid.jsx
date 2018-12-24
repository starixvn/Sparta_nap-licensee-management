import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Site from '../../lib/site';
import ConfirmBox from '../../components/ConfirmBox';
import Utility from '../../lib/utility';

export class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.state = { gridData: [] };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.timeStamp !== this.props.params.timeStamp) {
            this._getData();
        }
    }

    _getData() {
        this.props.toggleLoader(true);
        const params = {
            licenseeList: this.props.params.licenseeList,
            productList: this.props.params.productList.map(i => i.value).join(',')
        }

        Site.fetchData(this.props.params, 'ManageProduct/Search').then(response => {
            const data = response.data ? JSON.parse(response.data) : [];
            this.setState({ gridData: data });
            this.props.toggleLoader(false);
        });
    }

    render() {
        const { gridData, confirmBox } = this.state;
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
                                return (
                                    <tr key={item.LicenseeId}>
                                        <td>{item.LicenseeName}</td>
                                        { 
                                            header.map(x => {
                                                return <td key={x.value}>{item[x.value]}</td>;
                                            })
                                        }
                                    </tr>
                                )
                            })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { params, productList } = state;
    return { params, productList };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);