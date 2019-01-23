﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setParams } from './action';

const defaultState = Object.assign({}, window.initialState);
export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedGroupFunction: defaultState.selectedGroupFunction
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

    onSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _submit() {
        const params = {
            ParentFunctionId: this.state.selectedGroupFunction ? this.state.selectedGroupFunction.value : 0,
            TimeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    render() {
        const { selectedGroupFunction } = this.state;        

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