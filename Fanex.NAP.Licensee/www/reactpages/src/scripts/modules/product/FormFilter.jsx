import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import { setParams } from './action';

const defaultState = Object.assign({}, { selectedLicensee: window.initialState.selectedLicensee, selectedProduct: window.initialState.selectedProduct, licenseeList: window.initialState.licenseeList });

export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedLicensee: defaultState.selectedLicensee,
            selectedProduct: defaultState.selectedProduct
        };

        this.params = {
            operatorId: '',
            agentId: '',
            isEmptyOperatorId: false
        };
    }

    _handleSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _submit() {
        const params = {
            licenseeList: this.state.selectedLicensee == null ? '' : this.state.selectedLicensee.map(i => i.value).join(','),
            productList: this.state.selectedProduct == null ? [] : this.state.selectedProduct,
            timeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    render() {
        const { selectedLicensee, selectedProduct } = this.state;

        return (
            <div className="col-xs-12 filter-form">
                <div className="row">
                    <div className="col-xs-12 form-group row">
                        <label className="col-md-1 col-sm-2 col-xs-12">Licensee</label>
                        <Select instanceId="ddlLicensee"
                            value={selectedLicensee}
                            className="col-md-5 col-sm-4 col-xs-12"  
                            options={defaultState.licenseeList}
                            onChange={(item) => this.setState({ selectedLicensee: item })}
                            multi={true} />
                    </div>

                    <div className="col-xs-12 form-group row">
                        <label className="col-md-1 col-sm-2 col-xs-12">Product</label>
                        <Select instanceId="ddlProduct"
                            value={selectedProduct}
                            className="col-md-5 col-sm-4 col-xs-12"
                            options={this.props.productList}
                            onChange={(item) => this.setState({ selectedProduct: item })}
                            multi={true} />
                    </div>
                    <div className="col-xs-12 form-group">
                        <button type="button" className="btn btn-primary" onClick={this._handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParams }, dispatch);
}
function mapStateToProps(state) {
    const { productList } = state;
    return { productList };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);