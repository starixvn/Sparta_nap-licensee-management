import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setParams } from './action';
import Utility from '../../lib/utility';
import Site from '../../lib/site';
import Popup from '../../components/Popup';
import ConfirmBox from '../../components/ConfirmBox';
import Select from 'react-select';
import NumericInput from '../../components/NumericInput';

export class Button extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redmineId: '',
            isShowPopup: false,
            isShowConfirmation: false,
            msg: '',
            productList: [],
            selectedProduct: null,
            date: Utility.getTodayString(),
            isAddNew: true,
            isRemovePullService: true
        };
    }

    get isValidPopup() {
        const { redmineId, selectedProduct } = this.state;

        return redmineId && selectedProduct;
    }


    onSubmit(isAddNew) {
        const msg = isAddNew ? 'Do you want to offer this(these) product(s)?' : 'Do you want to remove this(these) product(s)?';
        this.setState({ isShowConfirmation: true, msg: msg });
    }

    onPopupClose = () => {
        this.setState({
            redmineId: '',
            isShowPopup: false,
            isShowConfirmation: false,
            msg: '',
            productList: [],
            selectedProduct: null,
            date: Utility.getTodayString(),
            isAddNew: true,
            isRemovePullService: true
        });
    }

    onConfirm = (value) => {
        if (value) {
            this._submit();
        }
        this.setState({ isShowConfirmation: false });
    }

    _getParam() {
        let params = {};
        params['licenseeName'] = this.props.checkedList.toString();
        params['productCode'] = this.state.selectedProduct ? this.state.selectedProduct.map(i => i.value).join(',') : '';
        params[this.state.isAddNew ? 'effectiveDate' : 'isRemovePullService'] = this.state.isAddNew ? this.state.date : this.state.isRemovePullService;
        params['redmineId'] = this.state.redmineId;

        return params;
    }

    _submit() {
        this.props.toggleLoader(true);
        const url = this.state.isAddNew ? 'ManageProduct/Add' : 'ManageProduct/Remove';
        const param = this._getParam();

        Site.fetchData(param, url)
            .then(response => {
                if (response.data.Error) {
                    Utility.showMessage(response.data.Error);
                }
                else {
                    Utility.showMessage('Success!');
                }

                this._updateGrid();
                this.onPopupClose();
            }).catch(err => {
                Utility.showMessage('Please try again!');
                this.props.toggleLoader(false);
            });
    }

    onClick(isAddNew) {
        this.props.toggleLoader(true);
        const url = isAddNew ? 'ManageProduct/GetNewProductList' : 'ManageProduct/GetRemoveProductList';

        Site.fetchData({ licenseeList: this.props.checkedList.toString() }, url)
            .then(response => {
                if (!response.data || response.data.length === 0) {
                    Utility.showMessage(isAddNew ? 'There is no product to offer!' : 'There is no product to remove!');
                }
                else {
                    const productList = response.data.map((item) => { return { label: item.ProductName, value: item.ProductCode }; });

                    this.setState({ productList: productList, isShowPopup: true, popupTitle: isAddNew ? 'Offer new product' : 'Remove product', isAddNew: isAddNew });
                }

                this.props.toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please try later!');
                this.props.toggleLoader(false);
            });
    }

    _updateGrid() {
        const filterParams = Object.assign({}, this.props.params, { timeStamp: new Date().getTime() });
        this.props.setParams(filterParams);
    }

    _buildPopupContent(isAddNew, productList, selectedProduct, date, isRemovePullService, redmineId) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>Product</label>
                    <Select instanceId='ddlProduct'
                        className={`full-width big-box ${selectedProduct !== null && selectedProduct.length > 0 ? '' : 'has-error'}`}
                        value={selectedProduct}
                        options={productList}
                        multi={true}
                        onChange={(item) => this.setState({ selectedProduct: item })} />
                </div>
                { 
                    isAddNew &&
                    <div className='form-group'>
                        <label className='col-form-label'>Effective Date</label>
                        <input className='full-width' type='date' value={date} onChange={(e) => this.setState({ date: e.target.value })} />
                    </div>
                }
                { 
                   !isAddNew &&
                    <div className='form-group'>
                        <label className='col-form-label'>Remove Pull Service</label>
                        <div>
                            <input type='checkbox'
                                checked={isRemovePullService}
                                onChange={(e) => this.setState({ isRemovePullService: e.target.checked })} />
                            <i>(Apply for "Gold Deluxe" and "AG Casino")</i>
                        </div>
                    </div>
                }
                <div className='form-group'>
                    <label className='col-form-label'>Redmine Id</label>
                    <NumericInput className={`full-width ${redmineId ? '' : 'has-error'}`}
                        value={redmineId}
                        onChange={(value) => this.setState({ redmineId: value })} />
                </div>
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={() => this.onSubmit(isAddNew)} disabled={!this.isValidPopup}>
                        Submit
                    </button>
                    <button className='btn btn-red' onClick={this.onPopupClose}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    render() {
        const { isAddNew, redmineId, isShowPopup, isShowConfirmation, msg, productList, selectedProduct, date, popupTitle, isRemovePullService } = this.state;
        const countSelectedItem = this.props.checkedList.length;

        return(
        <div>
            <div style={{ display: 'inline-block' }}>
                <button className='btn btn-green' onClick={() => this.onClick(true)} disabled={countSelectedItem === 0}>Offer New Product</button>
                <button className='btn btn-red' onClick={() => this.onClick(false)} disabled={countSelectedItem === 0}>Remove Product</button>
            </div>
            <ConfirmBox isShow={isShowConfirmation}
                title='Confirmation'
                message={msg}
                style={{ height: '160px', width: '400px' }}
                onClose={this.onConfirm} /> 
            <Popup isShow={isShowPopup}
                title={popupTitle}
                content={this._buildPopupContent(isAddNew, productList, selectedProduct, date, isRemovePullService, redmineId)}
                style={{height: '385px', width: '600px'}}
                onClose={this.onPopupClose} />
        </div>);
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, setParams }, dispatch);
}
function mapStateToProps(state) {
    const { params, checkedList } = state;
    return { params, checkedList };
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);