import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Site from '../../../lib/site';
import FormFilter from './currency/FormFilter';
import DataGrid from './currency/DataGrid';

export class EditCurrency extends Component {
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
        Site.fetchData(this.props.params, 'ITUserManagement/GetCurrencyList').then(response => {
            const currencyList = response.data.map(x => { return { label: x.Name, value: x.Id }; });
            this.setState({ currencyList: currencyList });
            this.props.toggleLoader(false);
        }).catch(e => {
            this.props.toggleLoader(false);
        });
    }

    render() {
        const { isActive, userName, licenseeList } = this.props
        const { currencyList } = this.state;

        return (
            <div style={{display: isActive ? 'block' : 'none'}}>
                <FormFilter userName={userName}
                    licenseeList={licenseeList}
                    currencyList={currencyList} />
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

export default connect(mapStateToProps, mapDispatchToProps)(EditCurrency);