import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import { setParams } from './action';

const defaultState = Object.assign({}, window.initialState);

export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSiteName: defaultState.selectedSiteName,
            selectedCurrency: defaultState.selectedCurrency
        };

        this.params = {
            operatorId: '',
            agentId: '',
            isEmptyOperatorId: false
        };
    }

    _handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;

        this.params[name] = target.value;
    }

    _handleOnCheck = (e) => {
        const target = e.target;
        const name = target.name;

        this.params[name] = target.checked;
    }

    _handleKeyPress = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            
            this._submit();
        }
    }

    _handleSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _handleSiteNameChange = (item) => {
        if (item === null) {
            this.setState({ selectedSiteName: defaultState.selectedSiteName });
        }
        else {
            this.setState({ selectedSiteName: item });
        }
    }

    _handleCurrencyChange = (item) => {
        if (item === null) {
            this.setState({ selectedCurrency: defaultState.selectedCurrency });
        }
        else {
            this.setState({ selectedCurrency: item });
        }
    }

    _submit() {
        const params = {
            operatorId: this.params.operatorId,
            agentId: this.params.agentId,
            siteName: this.state.selectedSiteName.value,
            currencyId: this.state.selectedCurrency.value,
            isEmptyOperatorId: this.params.isEmptyOperatorId,
            timeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    render() {
        const { selectedSiteName, selectedCurrency } = this.state;

        return (
            <div className="col-xs-12 form-inline filter-form">
                <div className="form-group">
                    <label>Site Name</label>
                    <Select instanceId="ddlSiteName"
                        value={selectedSiteName}
                        options={defaultState.siteNameList}
                        onChange={this._handleSiteNameChange} />
                </div>

                <div className="form-group">
                    <label>Currency</label>
                    <Select instanceId="ddlCurrency"
                        value={selectedCurrency}
                        options={defaultState.currencyList}
                        onChange={this._handleCurrencyChange} />
                </div>

                <div className="form-group">
                    <label>Operator ID</label>
                    <input type="text" name="operatorId" onChange={this._handleInputChange} onKeyPress={this._handleKeyPress} />
                </div>

                <div className="form-group">
                    <label>Agent ID</label>
                    <input type="text" name="agentId" onChange={this._handleInputChange} onKeyPress={this._handleKeyPress} />
                </div>

                <div className="form-group">
                    <label className="checkbox-inline">           
                        <input type="checkbox" name="isEmptyOperatorId" onChange={this._handleOnCheck} />
                        Empty Operator ID
                    </label>
                </div>

                <div className="form-group">
                    <button type="button" className="btn btn-primary" onClick={this._handleSubmit}>Submit</button>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParams }, dispatch);
}
function mapStateToProps(state) {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);