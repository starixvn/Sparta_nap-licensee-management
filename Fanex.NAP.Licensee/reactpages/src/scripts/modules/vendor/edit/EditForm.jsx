import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import IgnoredFunctionList from './IgnoredFunctionList'
import Site from '../../../lib/site'
import { updateVendor } from './action'

export class EditForm extends Component {
    constructor(props) {
        super(props);

        const { SiteName, InternalUrl, LrfUrl, AffiliateUrl, IgnoredFunctions } = this.props.vendorInfo;

        this.state = {
            vendorId: Site.getUrlParameter("vendorId"),
            siteName: SiteName,
            internalUrl: InternalUrl,
            lrfUrl: LrfUrl,
            affiliateUrl: AffiliateUrl,
            exclusions: IgnoredFunctions
        }
    }

    handleOnChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({ [name]: target.value });
    }

    handleOnEditIgnoredFunction = (ignoredFunctions) => {
        const ignoredFunctionsJson = ignoredFunctions && ignoredFunctions.length ?
            JSON.stringify(ignoredFunctions) : "";
        console.log(ignoredFunctionsJson);

        this.setState({ exclusions: ignoredFunctionsJson });
    }

    submit = (event) => {
        event.preventDefault();
        
        const param = Object.assign({}, this.state);

        this.props.updateVendor(param).then(response => {
            const message = response.data ? "Update Successfully" : "Update Failed";
            window.alert(message);
        })
    }

    render() {
        const { siteName, internalUrl, lrfUrl, affiliateUrl } = this.state;
        return (
            <div className="edit-form">
                <div className="row">
                    <div className="col-sm-6 sol-md-6">
                        <div className="form-group row">
                            <label className="col-sm-3 col-md-3 col-form-label">Site Name</label>
                            <div className="col-sm-9 col-md-8">
                                <p>{siteName}</p>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="internalUrl" className="col-sm-3 col-md-3 col-form-label">Internal Url</label>
                            <div className="col-sm-9 col-md-8">
                                <input type="text" id="internalUrl" className="full-width" name="internalUrl" value={internalUrl} onChange={this.handleOnChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="lrfUrl" className="col-sm-3 col-md-3 col-form-label">Lrf Url</label>
                            <div className="col-sm-9 col-md-8">
                                <input type="text" id="lrfUrl" className="full-width" name="lrfUrl" value={lrfUrl} onChange={this.handleOnChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="affiliateUrl" className="col-sm-3 col-md-3 col-form-label">Affiliate Url</label>
                            <div className="col-sm-9 col-md-8">
                                <input type="text" id="affiliateUrl" className="full-width" name="affiliateUrl" value={affiliateUrl} onChange={this.handleOnChange} />
                            </div>
                        </div>

                        <div className="form-group row col-sm-2 col-md-1">
                            <button type="button" className="btn btn-primary" onClick={this.submit}>Submit</button>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-6">
                        <IgnoredFunctionList functionList={this.state.exclusions} onEdit={this.handleOnEditIgnoredFunction} />
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateVendor }, dispatch);
}
function mapStateToProps(state) {
    const { vendorInfo } = state;
    return { vendorInfo };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditForm);