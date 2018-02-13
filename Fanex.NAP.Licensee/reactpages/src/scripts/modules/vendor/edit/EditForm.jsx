import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Site from '../../../lib/site'
import { getVendorById } from './action'

export class EditForm extends Component {
    constructor(props) {
        super(props);

        const { SiteName, InternalUrl, LrfUrl, AffiliateUrl } = this.props.vendorInfo;
        this.state = {
            vendorId: Site.getUrlParameter("vendorId"),
            siteName: SiteName,
            internalUrl: InternalUrl,
            lrfUrl: LrfUrl,
            affiliateUrl: AffiliateUrl
        }
    }

    handleOnChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({ [name]: target.value });
    }

    submit = (event) => {
        event.preventDefault();
        console.log(this.state);
    }

    render() {
        const { siteName, internalUrl, lrfUrl, affiliateUrl } = this.state;
        return (
            <div>
                <div className="form-group row">
                    <label htmlFor="siteName" className="col-sm-2 col-md-1 col-form-label">Site Name</label>
                    <div className="col-sm-9 col-md-10">
                        <input type="text" id="siteName" name="siteName" value={siteName} onChange={this.handleOnChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="internalUrl" className="col-sm-2 col-md-1 col-form-label">Internal Url</label>
                    <div className="col-sm-9 col-md-10">
                        <input type="text" id="internalUrl" name="internalUrl" value={internalUrl} onChange={this.handleOnChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="lrfUrl" className="col-sm-2 col-md-1 col-form-label">Lrf Url</label>
                    <div className="col-sm-9 col-md-10">
                        <input type="text" id="lrfUrl" name="lrfUrl" value={lrfUrl} onChange={this.handleOnChange} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="affiliateUrl" className="col-sm-2 col-md-1 col-form-label">Affiliate Url</label>
                    <div className="col-sm-9 col-md-10">
                        <input type="text" id="affiliateUrl" name="affiliateUrl" value={affiliateUrl} onChange={this.handleOnChange} />
                    </div>
                </div>

                <div className="form-group row col-sm-2 col-md-1">
                    <button type="button" className="btn btn-primary" onClick={this.submit}>Submit</button>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getVendorById }, dispatch);
}
function mapStateToProps(state) {
    const { vendorInfo } = state;
    return { vendorInfo };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditForm);