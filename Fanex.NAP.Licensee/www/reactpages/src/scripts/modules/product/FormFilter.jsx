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
            pageIndex: 1,
            pageSize: this.props.params.pageSize || 20,
            timeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    onChangeLicensee = (value) => {
        this.setState({ selectedLicensee: value });
    };

    onLicenseeInputChange = (inputValue) => {
        this.setState({ inputValue }, () => {
            const { selectedLicensee } = this.state;
            const listInput = inputValue.toLowerCase().split(',').map(function (item) {
                return item.trim();
            });
            let selectedList = defaultState.licenseeList.filter(x => listInput.includes(x.label.toLowerCase()));

            if (selectedList.length <= 0) return;

            if (selectedLicensee && selectedLicensee.length > 0) {
                var codes = new Set(selectedLicensee.map(d => d.value));
                var mergedSelectedLicensee = [...selectedLicensee, ...selectedList.filter(d => !codes.has(d.value))];

                this.onChangeLicensee(mergedSelectedLicensee);
            } else if (selectedList.length > 0) {
                this.onChangeLicensee(selectedList);
            }
        });
    };

    render() {
        const { selectedLicensee, selectedProduct } = this.state;

        return (
            <div className="col-xs-12 filter-form">
                <div className="row">
                    <div className="col-xs-12 form-group row">
                        <label className="col-md-1 col-sm-2 col-xs-12">Licensee</label>
                        <Select instanceId="ddlLicensee"
                            onInputChange={this.onLicenseeInputChange}
                            value={selectedLicensee}
                            className="col-md-5 col-sm-4 col-xs-12"  
                            options={defaultState.licenseeList}
                            onChange={(item) => this.onChangeLicensee(item)}
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
    const { productList, params } = state;
    return { productList, params };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);