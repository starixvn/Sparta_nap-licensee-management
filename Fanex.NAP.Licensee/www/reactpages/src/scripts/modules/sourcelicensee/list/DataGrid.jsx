import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Site from '../../../lib/site'

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
        Site.fetchData(this.props.params, 'SourceLicenseeSetting/Search').then(response => {
            this.setState({ gridData: response.data });
            this.props.toggleLoader(false);
        });
    }

    render() {
        const gridData = this.state.gridData;

        if (gridData.length === 0) {
            return false;
        }

        return (
            <div>
                <p>Search results: <b>{gridData.length}</b> item(s)</p>
                <table className='table table-bordered table-hover'>
                    <thead>
                        <tr>
                            <th>Site Name</th>
                            <th>Source Id</th>
                            <th>Currency</th>
                            <th>Role</th>
                            <th>Source Site Name</th>
                            <th>Effective Date</th>
                            <th>End Date</th>
                            <th>Active</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            gridData.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.SiteName}</td>
                                        <td>{item.SourceId}</td>
                                        <td>{item.Currency}</td>
                                        <td>{item.Role}</td>
                                        <td>{item.SourceSiteName}</td>
                                        <td>{item.EffectiveDate}</td>
                                        <td>{item.EndDate}</td>
                                        <td>{item.SiteName}</td>
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
    const { params } = state;
    return Object.assign({}, { params });
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);