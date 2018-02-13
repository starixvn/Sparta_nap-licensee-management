import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getGridData } from '../action'


export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.params = {
            vendorId: "",
            siteName: ""
        }
    }

    handleChangeVendorId = (event) => {
        this.params.vendorId = event.target.value;
    }

    handleChangeSiteName = (event) => {
        this.params.siteName = event.target.value;
    }

    submit = (event) => {
        event.preventDefault();
        console.log(this.params);
        this.props.getGridData({data: this.params});
    }

    render() {
        return (
            <div className="col-xs-12 form-inline filter-form">
                <div className="form-group">
                    <label>VendorId</label>
                    <input type="text" onChange={this.handleChangeVendorId} />
                </div>

                <div className="form-group">
                    <label>Site Name</label>
                    <input type="text" onChange={this.handleChangeSiteName} />
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