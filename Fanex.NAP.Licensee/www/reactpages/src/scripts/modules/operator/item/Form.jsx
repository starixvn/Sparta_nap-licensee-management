import React, { Component } from 'react';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';
import Select from 'react-select';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.originalAgentId = defaultState.operator.AgentId;
        this.originalOperatorId = defaultState.operator.OperatorId;

        this.state = {
            isLoading: false,
            operator: Object.assign({}, defaultState.operator),
            error: this.originalAgentId ? '' : 'Agent ID is empty',
            agentId: this.originalAgentId === 0 ? '' : this.originalAgentId,
            selectedSiteName: this.originalAgentId === 0 
                ? defaultState.selectedSiteName 
                : { label: defaultState.operator.SiteName, value: defaultState.operator.SiteName }
        };
    }

    _handleSubmit = (e) => {
        e.preventDefault();

        const { operator, error, agentId, selectedSiteName } = this.state;

        if (!error && selectedSiteName) {
            const param = Object.assign({}, operator, { AgentId: agentId, SiteName: selectedSiteName.value });

            this._submit(param);
        }
        else {
            this._alert('Invalid input!');
        }
    }

    _handleOperatorIdChanged = (e) => {
        let operator = Object.assign({}, this.state.operator);
        operator.OperatorId = e.target.value;

        this.setState({operator: operator});
    }

    _submit(params) {
        this._toggleLoader(true);
        const url = this.originalAgentId > 0 ? 'ManageOperator/Update' : 'ManageOperator/Add';
        Site.fetchData(params, url)
            .then(response => {                
                if (!response.data.IsSuccess) {
                    this._alert('OperatorId has been added/updated by someone!');
                }
                else {
                    this._alert('Success!');
                }

                this.originalAgentId = response.data.Data.AgentId;
                this.originalOperatorId = response.data.Data.OperatorId;
                this.setState({
                    operator: response.data.Data, 
                    isLoading: false 
                });
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

    _validateAgent = () => {
        const agentId = this.state.agentId.trim();

        if (!agentId)
        {
            this.setState({ error: 'Agent ID is empty' });
            return;
        }

        Site.fetchData({ agentId : agentId }, 'ManageOperator/Validate')
            .then(response => {                
                if (response.data.IsValid) {
                    this.setState({
                        operator: response.data.Agent,
                        error: '',
                        isLoading: false 
                    });
                }
                else {
                    this.setState({
                        error: response.data.Error,
                        isLoading: false,
                        operator: Object.assign({}, defaultState.operator)
                    });
                }
            }).catch(err => {
                this.setState({
                    error: "Error",
                    isLoading: false,
                    operator: Object.assign({}, defaultState.operator)
                });
            });
    }

    _handleKeyPress = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            
            this._validateAgent();
        }
    }

    render() {
        const { isLoading, operator, error, agentId, selectedSiteName } = this.state;
        const isNew = this.originalAgentId === 0;
        const hasEmptyOperator = this.originalOperatorId === null || this.originalOperatorId === '';

        return (
            <div className="edit-form">
                <Loader isLoading={isLoading} />
                <div className="row">
                    <div className="col-xs-12">
                        <div className="form-group row">
                            <label className="col-sm-12 col-lg-1 col-md-2 col-form-label">Agent ID</label>
                            {
                                isNew
                                ? (<div className="col-sm-12 col-md-5">
                                    <div className="group-input">
                                        <input type="text"
                                            value={agentId}
                                            className={`full-width ${error ? 'has-error' : 'valid'}`}
                                            onChange={(e) => this.setState({ agentId: e.target.value })} 
                                            onKeyPress={this._handleKeyPress} />
                                        <button type="button" className="btn btn-green" onClick={this._validateAgent}>Validate</button>
                                    </div>
                                    <span className="error-message">{error}</span>                                      
                                </div>)
                                : (<div className="col-sm-12 col-md-5">{operator.AgentId}</div>)
                            }
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-12 col-lg-1 col-md-2 col-form-label">User Name</label>
                            <div className="col-sm-12 col-md-5">
                                {operator.UserName}
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-12 col-lg-1 col-md-2 col-form-label">Site Name</label>
                            <div className="col-sm-12 col-md-5">
                            {
                                isNew
                                ? (<Select instanceId="ddlSiteName"
                                    className={`full-width ${selectedSiteName ? '' : 'has-error'}`}
                                    value={selectedSiteName}
                                    options={defaultState.siteNameList}
                                    onChange={(item) => this.setState({ selectedSiteName: item })} />)
                                : operator.SiteName
                            }
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-12 col-lg-1 col-md-2 col-form-label">Currency</label>
                            <div className="col-sm-12 col-md-5">
                                {operator.CurrencyName}
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-12 col-lg-1 col-md-2 col-form-label">Operator ID</label>
                            <div className="col-sm-12 col-md-5">
                            {
                                hasEmptyOperator
                                ? (<input type="text" value={operator.OperatorId ? operator.OperatorId : ''}
                                    className="full-width"
                                    onChange={this._handleOperatorIdChanged} />)
                                : operator.OperatorId
                            }
                            </div>
                        </div>
                        {
                            hasEmptyOperator
                            &&
                            (<div className="form-group row col-sm-12">
                                <button type="button" className="btn btn-primary" onClick={this._handleSubmit} disabled={error || !selectedSiteName}>
                                    Submit
                                </button>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        )
    }
}