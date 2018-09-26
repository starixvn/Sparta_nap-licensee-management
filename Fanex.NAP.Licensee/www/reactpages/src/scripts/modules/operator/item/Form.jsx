import React, { Component } from 'react';
import Select from 'react-select';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        const agentId = defaultState.operator.AgentId;

        this.state = {
            selectedSiteName: agentId === 0 ? defaultState.selectedSiteName : { value: defaultState.operator.SiteName, label: defaultState.operator.SiteName },
            isValidSiteName: true,
            selectedCurrency: agentId === 0 ? defaultState.selectedCurrency : { value: defaultState.operator.CurrencyId, label: defaultState.operator.CurrencyName },
            isValidCurrency: true,
            isLoading: false,
            operator: defaultState.operator
        };

        this.params = {
            agentId: agentId === 0 ? '' : agentId,
            operatorId: agentId === 0 ? '' : defaultState.operator.OperatorId
        };
    }

    _handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;

        this.params[name] = target.value;
    }

    _handleSubmit = (e) => {
        e.preventDefault();

        if (this._validate()) {
            const params = {
                operatorId: this.params.operatorId,
                agentId: this.params.agentId,
                siteName: this.state.selectedSiteName.value,
                currencyId: this.state.selectedCurrency.value
            };

            this._submit(params);
        }
    }

    _submit(params) {
        this._toggleLoader(true);
        const url = this.state.operator.AgentId > 0 ? 'ManageOperator/Update' : 'ManageOperator/Add';
        Site.fetchData(params, url)
            .then(response => {
                this.setState({
                    operator: response.data, 
                    isLoading: false 
                });
                
                if (this.state.operator.AgentId > 0 && this.state.operator.OperatorId !== params.operatorId) {
                    this._alert('OperatorId has been updated by someone!');
                }
                else {
                    this._alert('Success!');
                }
            }).catch(err => {
                this._alert('Please try again!');
                this._toggleLoader(false);
            });
    }

    _alert(msg) {
        window.alert(msg);
    }

    _toggleLoader(isLoading) {
        this.setState({ isLoading: isLoading });
    }

    _validate() {
        return true;
    }

    render() {
        const { selectedSiteName, selectedCurrency, isLoading, operator } = this.state;
        const isNew = operator.AgentId === 0;
        const hasEmptyOperator = operator.OperatorId === null || operator.OperatorId === '';

        return (
            <div className="edit-form">
                <Loader isLoading={isLoading} />
                <div className="row">
                    <div className="col-xs-12">
                        <div className="form-group row">
                            <label className="col-sm-12 col-md-1 col-form-label">Site Name</label>
                            <div className="col-sm-12 col-md-5">
                            {
                                isNew
                                ? (<Select instanceId="ddlSiteName"
                                    className="full-width"
                                    value={selectedSiteName}
                                    options={defaultState.siteNameList}
                                    onChange={(item) => this.setState({ selectedSiteName: item })} />)
                                : selectedSiteName.label
                            }
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-12 col-md-1 col-form-label">Currency</label>
                            <div className="col-sm-12 col-md-5">
                            {
                                isNew
                                ? (<Select instanceId="ddlCurrency"
                                    className="full-width"
                                    value={selectedCurrency}
                                    options={defaultState.currencyList}
                                    onChange={(item) => this.setState({ selectedCurrency: item })} />)
                                : selectedCurrency.label
                            }
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-12 col-md-1 col-form-label">Agent ID</label>
                            <div className="col-sm-12 col-md-5">
                            {
                                isNew
                                ? (<input type="text" id="agentId" className="full-width" name="agentId" onChange={this._handleInputChange} />)
                                : operator.AgentId
                            }
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-12 col-md-1 col-form-label">Operator ID</label>
                            <div className="col-sm-12 col-md-5">
                            {
                                hasEmptyOperator
                                ? (<input type="text" id="operatorId" className="full-width" name="operatorId" onChange={this._handleInputChange} />)
                                : operator.OperatorId
                            }
                            </div>
                        </div>
                        {
                            hasEmptyOperator
                            &&
                            (<div className="form-group row col-sm-12">
                                <button type="button" className="btn btn-primary" onClick={this._handleSubmit}>Submit</button>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        )
    }
}