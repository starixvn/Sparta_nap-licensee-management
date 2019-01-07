import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Select from 'react-select'
import { setParams } from './action'

export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.params = {
            vendorId: "",
            siteName: "",
            functionKey: ""
        };

        this.state = {
            selectedFunctionKey: null
        };
    }

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.params[name] = target.value;
    }

    handleKeyPress = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();
            this._submit();
        }
    }

    handleFunctionKeyChange = (item) => {
        this.setState({ selectedFunctionKey: item });
        this.params.functionKey = item === null ? "" : item.value;
    }

    handleClick = (event) => {
        event.preventDefault();

        this._submit();
    }

    _submit() {
        const params = Object.assign(
            {},
            this.params,
            { 
                pageIndex: 1,
                pageSize: this.props.params.pageSize || 20,
                timeStamp: new Date().getTime()
            });
        this.props.setParams(params);
    }

    render() {
        return (
            <div className="col-xs-12 form-inline filter-form">
                <div className="form-group">
                    <label>VendorId</label>
                    <input type="text" name="vendorId" onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                </div>

                <div className="form-group">
                    <label>Site Name</label>
                    <input type="text" name="siteName" onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                </div>

                <div className="form-group">
                    <label>Function Key</label>
                    <Select instanceId="ddlFunction"
                    value={this.state.selectedFunctionKey}
                    options={this.props.functionKeyList}
                    onChange={this.handleFunctionKeyChange} />
                </div>

                <div className="form-group">
                    <button type="button" className="btn btn-primary" onClick={this.handleClick}>Submit</button>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParams }, dispatch);
}
function mapStateToProps(state) {
    const { functionKeyList, params } = state;
    return { functionKeyList, params };
};
export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);