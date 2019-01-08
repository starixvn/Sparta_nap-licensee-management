﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import { setParams } from './action';

const defaultState = Object.assign({}, window.initialState);
export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedGroupFunction: defaultState.selectedGroupFunction,
            selectedType: defaultState.selectedType,
            selectedEnvironment: defaultState.selectedEnvironment
        }
    }

    onGroupFunctionChange = (item) => {
        if (item === null) {
            this.setState({ selectedGroupFunction: defaultState.selectedGroupFunction });
        }
        else {
            this.setState({ selectedGroupFunction: item });
        }
    }

    onTypeChange = (item) => {
        if (item === null) {
            this.setState({ selectedType: defaultState.selectedType });
        }
        else {
            this.setState({ selectedType: item });
        }
    }

    onEnvironmentChange = (item) => {
        if (item === null) {
            this.setState({ selectedEnvironment: defaultState.selectedEnvironment });
        }
        else {
            this.setState({ selectedEnvironment: item });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _submit() {
        const params = {
            ParentFunctionId: this.state.selectedGroupFunction ? this.state.selectedGroupFunction.value : 0,
            Environment: this.state.selectedEnvironment ? this.state.selectedEnvironment.value : '',
            Type: this.state.selectedType ? this.state.selectedType.value : 0,
            TimeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    render() {
        const { selectedGroupFunction, selectedType, selectedEnvironment } = this.state;        

        return (
        <div className="col-xs-12 form-inline filter-form">
            <div className="form-group">
                <label>Group Function</label>
                <Select instanceId="ddlGroupFunction"
                    value={selectedGroupFunction} 
                    options={defaultState.groupFunctionList}
                    onChange={this.onGroupFunctionChange} />
            </div>

            <div className="form-group">
                <label>Type</label>
                <Select instanceId="ddlType"
                    value={selectedType}
                    options={defaultState.typeList}
                    onChange={this.onTypeChange} />
            </div>

            <div className="form-group">
                <label>Environment</label>
                <Select instanceId="ddlEnvironment"
                    value={selectedEnvironment}
                    options={defaultState.environmentList}
                    onChange={this.onEnvironmentChange} />
            </div>

            <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
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