import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Popup from '../../../components/Popup';
import ConfirmBox from '../../../components/ConfirmBox';
import Site from '../../../lib/site';
import Select from 'react-select';
import Utility from '../../../lib/utility';
import NumericInput from '../../../components/NumericInput';

export class AddAgent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            superWildCard: props.licensee.LicenseeName + 'Super',
            isShowConfirmBox: false,
            isSpecial: false,
            selectedCurrency: null,
            currencyList: [],
            isShow: false,
            redmineId: ''
        };

        this.changeCurrencyList = Utility.debounce(this._getCurrencyList, 2000).bind(this);
    };

    get isValid() {
        const { superWildCard, redmineId } = this.state;

        return superWildCard && redmineId;
    }

    onClose = () => {
        this.setState({ 
            superWildCard: this.props.licensee.LicenseeName + 'Super',
            isShowConfirmBox: false,
            isSpecial: false,
            selectedCurrency: null,
            currencyList: [],
            isShow: false,
            redmineId: ''
        });
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
        const url = 'LicenseeSetting/AddAgent';
        const params = this._getParams();

        Site.fetchData(params, url)
            .then(response => {
                if (!response.data.IsSuccess) {
                    Utility.showMessage(response.data.Error);
                }
                else {
                    Utility.showMessage(response.data.Data);
                }

                this.props.toggleLoader(false);
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    _getParams()
    {
        const { superWildCard, selectedCurrency, isSpecial, redmineId } = this.state;

        return {
            LicenseeName: this.props.licensee.LicenseeName,
            SuperWildCard: superWildCard,
            Currency: selectedCurrency == null ? 0 : selectedCurrency.value,
            IsSpecial: isSpecial,
            RedmineId: redmineId
        };
    }

    _getCurrencyList() {
        const superWildCard = this.state.superWildCard;
        
        if (superWildCard) {
            this.props.toggleLoader(true);
            const url = 'LicenseeSetting/GetSuperCurrencyList';
            const param = { SuperWildCard: superWildCard };

            Site.fetchData(param, url)
                .then(response => {
                    var data = response.data ? response.data.map((item) => { return { label: item.Name, value: item.Id }; }) : []

                    this.setState({ currencyList: data, selectedCurrency: null });

                    this.props.toggleLoader(false);
                }).catch(err => {
                    this.props.toggleLoader(false);
                });
        }
    }

    _addAgent = () => {
        this.setState({ isShow: true });

        this._getCurrencyList();
    }

    _onTextChange = (e) => {
        const value = e.target.value;
        this.setState({ superWildCard: value });

        this.changeCurrencyList();
    }

    _buildContent(selectedCurrency, currencyList, superWildCard, isSpecial, redmineId) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>Super Wild Card</label>
                    <input className={`full-width ${superWildCard ? '' : 'has-error'}`}
                        type='text'
                        maxLength='50'
                        value={superWildCard}
                        onChange={this._onTextChange} />
                    <i>(Manually changing <b>"Super Wild Card"</b> value will cause wrong setting for licensee agent. Please consider carefully)</i>
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Currency</label>
                    <Select instanceId='ddlProduct'
                        className='full-width'
                        value={selectedCurrency}
                        options={currencyList}
                        onChange={(item) => this.setState({ selectedCurrency: item })} />
                    <i>(If there is no currency seleted, all new agents/currencies will be added)</i>
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Special</label>
                    <div>
                        <input type='checkbox' checked={isSpecial} onChange={(e) => this.setState({ isSpecial: e.target.checked })} />
                        <i>(<b>Is Special</b> = true: Update [Description] of Agent with normal/affiliate/banner/income access)</i>
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Redmine Id</label>
                    <NumericInput className={`full-width ${redmineId ? '' : 'has-error'}`}
                        value={redmineId}
                        onChange={(value) => this.setState({ redmineId: value })} />
                </div>
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={this._onSubmit} disabled={!this.isValid}>
                        Submit
                    </button>
                    <button className='btn btn-red' onClick={this.onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    render()
    {
        const { superWildCard, isSpecial, isShowConfirmBox, selectedCurrency, currencyList, isShow, redmineId } = this.state;

        return (
        <div>
            <button className="btn btn-green" onClick={this._addAgent}>Add Agent/Currency</button>
            <ConfirmBox isShow={isShowConfirmBox}
                        title='Confirmation'
                        message='Do you want to add new agent/currency?'
                        style={{ height: '150px', width: '400px' }}
                        onClose={this.onConfirm} /> 
            <Popup isShow={isShow}
                title='Add Agent/Currency'
                content={this._buildContent(selectedCurrency, currencyList, superWildCard, isSpecial, redmineId)}
                className='no-scroll'
                style={{height: '420px', width: '720px'}}
                onClose={this.onClose} />
        </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { licensee } = state;
    return { licensee };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAgent);