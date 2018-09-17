import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getGridData } from './action'


export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.params = {
            vendorId: "",
            siteName: ""
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.params[name] = target.value;
    }

    handleKeyPress = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();
            this.props.getGridData(this.params);
        }
    }

    submit = (event) => {
        event.preventDefault();
        this.props.getGridData(this.params);
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
                    <button type="button" className="btn btn-primary" onClick={this.submit}>Submit</button>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getGridData }, dispatch);
}

export default connect(null, mapDispatchToProps)(FormFilter);