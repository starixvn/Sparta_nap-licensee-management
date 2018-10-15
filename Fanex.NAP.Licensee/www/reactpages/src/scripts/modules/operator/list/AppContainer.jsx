import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Loader from '../../../components/Loader'
import FormFilter from './FormFilter'
import DataGrid from './DataGrid'

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Loader isLoading={this.props.isLoading} />
                <FormFilter />
                <div style={{ display: 'inline-block' }}>
                    <a className="btn btn-green" href={window.rootUrl + 'ManageOperator/Get'}>+ Add New Operator</a>
                    <a className="btn btn-green" href={window.rootUrl + 'ManageOperator/Import'}><i className="list-icon"></i>Import file</a>
                </div>
                <DataGrid />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { isLoading } = state;
    return { isLoading };
};

export default connect(mapStateToProps)(AppContainer);