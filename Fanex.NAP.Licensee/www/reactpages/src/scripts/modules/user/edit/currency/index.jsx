import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from '../action';

import Site from '../../../../lib/site';
import FormFilter from './FormFilter';
import DataGrid from './DataGrid';

export class Index extends Component {
    constructor(props) {
        super(props);

        this.isFirstTime = false;

        this.state = { currencyList: [] }
    }

    componentDidUpdate(prevState) {
        if (!this.isFirstTime && !prevState.isActive && this.props.isActive) {
            this.isFirstTime = true;

            this._getCurrencyList();
        }
    }

    _getCurrencyList()
    {
        this.props.toggleLoader(true);
        Site.fetchData(null, 'ITUserManagement/GetCurrencyList')
            .then(response => {
                const currencyList = response.data.map(x => { return { label: x.Name, value: x.Id }; });
                this.setState({ currencyList: currencyList });
                this.props.toggleLoader(false);
            }).catch(e => {
                this.props.toggleLoader(false);
            });
    }

    render() {
        return (
            <div style={{display: this.props.isActive ? 'block' : 'none'}}>
                <FormFilter currencyList={this.state.currencyList} />
                <DataGrid />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);