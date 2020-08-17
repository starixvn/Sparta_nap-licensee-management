import React, { Component } from 'react'
import { connect } from 'react-redux'

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
                <FormFilter totalWinLoss={this.props.totalWinLoss} />
                <DataGrid />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { isLoading, totalWinLoss } = state;
    return { isLoading, totalWinLoss };
};

export default connect(mapStateToProps)(AppContainer);