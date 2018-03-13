import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Loader from '../../../components/Loader'
import IgnoredFunctionList from './IgnoredFunctionList'
import { updateVendor, toggleLoader } from './action'

export class EditForm extends Component {
    constructor(props) {
        super(props);

        const { vendorInfo } = this.props;
        const { VendorId, SiteName, InternalUrl, LrfUrl, AffiliateUrl, IgnoredFunctions } = vendorInfo;

        this.state = {
            vendorId: VendorId,
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
        const exclusions = ignoredFunctions.length ? JSON.stringify(ignoredFunctions) : null;

        this.setState({ exclusions });
    }

    submit = (event) => {
        event.preventDefault();

        const param = Object.assign({}, this.state);

        this.props.toggleLoader(true);
        this.props.updateVendor(param).then(response => {
            const message = response.data ? "Update Successfully" : "Update Failed";
            window.alert(message);
            this.props.toggleLoader(false);
        })
    }

    render() {
        const { siteName, internalUrl, lrfUrl, affiliateUrl, exclusions } = this.state;
        return (
            <div className="edit-form">
                <Loader isLoading={this.props.isLoading} />
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
                        <IgnoredFunctionList exclusionList={exclusions} functionKeyList={this.props.functionKeyList} onEdit={this.handleOnEditIgnoredFunction} />
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ updateVendor, toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { vendorInfo, functionKeyList, isLoading } = state;
    return { vendorInfo, functionKeyList, isLoading };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditForm);