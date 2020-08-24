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