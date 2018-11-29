import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, getProductList } from './action';
import Popup from '../../../components/Popup';
import ConfirmBox from '../../../components/ConfirmBox';
import Site from '../../../lib/site';
import Select from 'react-select';
import Utility from '../../../lib/utility';

export class OfferProductForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: Utility.getTodayString(),
            isShowConfirmBox: false,
            isLoading: false,
            selectedproduct: null
        };
    };

    get isValid() {
        const selectedproduct = this.state.selectedproduct;

        return selectedproduct !== null && selectedproduct.length > 0;
    }

    onClose(result) {
        this.setState({ 
            date: Utility.getTodayString(),
            isShowConfirmBox: false,
            isLoading: false,
            selectedproduct: null,
            isShow: false,
            productList: []
        });

        if (result) {
            this.props.getProductList(this.props.licensee.LicenseeID);
        }
    }

    _onSubmit = () => {
        this._showConfirmBox(true);
    }

    _showConfirmBox(isShow) {
        this.setState({ isShowConfirmBox: isShow });
    }

    onConfirm = (value) => {
        this._showConfirmBox(false);

        if (value) {
            this._submit();
        }
    }

    _submit() {
        this.props.toggleLoader(true);
        const url = 'LicenseeSetting/OfferProduct';
        const params = this._getParams();

        Site.fetchData(params, url)
            .then(response => {
                if (!response.data.IsSuccess) {
                    Utility.showMessage(response.data.Error);
                }
                else {
                    Utility.showMessage('Success!');
                    this.onClose(true);
                }

                this.props.toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Error!');
                this.props.toggleLoader(false);
            });
    }

    _getParams()
    {
        const { date, selectedproduct } = this.state;

        return {
            LicenseeName: this.props.licensee.LicenseeName,
            ProductCode: selectedproduct == null ? '' : selectedproduct.map(i => i.value).join(','),
            EffectiveDate: new Date(date)
        };
    }

    _offerProduct = () => {
        this.props.toggleLoader(true);
        const url = 'LicenseeSetting/GetProductList';

        Site.fetchData({ ExcludeLicenseeId: this.props.licensee.LicenseeID }, url)
            .then(response => {
                if (!response.data || response.data.length === 0) {
                    Utility.showMessage('There is no product to offer!');
                }
                else {
                    const productList = response.data.map((item) => { return { label: item.ProductName, value: item.ProductCode }; });

                    this.setState({ productList: productList, isShow: true });
                }

                this.props.toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please try later!');
                this.props.toggleLoader(false);
            });
    }

    _buildContent(selectedproduct, productList, date) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>Product</label>
                    <Select instanceId='ddlProduct'
                        className={`full-width ${this.isValid ? '' : 'has-error'}`}
                        value={selectedproduct}
                        options={productList}
                        multi={true}
                        onChange={(item) => this.setState({ selectedproduct: item })} />
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Effective Date</label>
                    <input className='full-width' type='date' value={date} onChange={(e) => this.setState({ date: e.target.value })} />
                </div>
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={this._onSubmit} disabled={!this.isValid}>
                        Submit
                    </button>
                    <button className='btn btn-red' onClick={() => this.onClose(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    render()
    {
        const { date, isShowConfirmBox, selectedproduct, productList, isShow } = this.state;

        return (
        <div> 
            <button className="btn btn-green" onClick={this._offerProduct}>Offer New Product</button>
            <ConfirmBox isShow={isShowConfirmBox}
                        title='Confirmation'
                        message='Do you want to offer this product?'
                        style={{ height: '150px', width: '400px' }}
                        onClose={this.onConfirm} /> 
            <Popup isShow={isShow}
                title='Offer New Product'
                content={this._buildContent(selectedproduct, productList, date)}
                style={{height: '330px', width: '600px'}}
                onClose={() => this.onClose(false)} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, getProductList }, dispatch);
}
function mapStateToProps(state) {
    const { licensee } = state;
    return { licensee };
};

export default connect(mapStateToProps, mapDispatchToProps)(OfferProductForm);