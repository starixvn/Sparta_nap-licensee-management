import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormMessage, emptySelectedItem } from './constant/form';
import action from './action';
import DropDown from '../../../components/dropdown/DropDown';
import { DecimalRadixNumber } from '../../../lib/constant';

export const FormFilter = (props) => {
    const {
        licensees,
        selectedLicensee,
        currencies,
        selectedCurrency,
        sourceAgent,
        agencies,
    } = props;
    const [message, setMessage] = useState(null);
    const [number, setNumber] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const displayLicensees = licensees.map((licensee) => ({
        value: licensee.Id,
        label: licensee.Name,
    }));
    const displaySelectedLicensee = selectedLicensee &&
    {
        value: selectedLicensee.Id,
        label: selectedLicensee.Name
    };

    const displayCurrencies = currencies.map((currency) => ({
        value: currency.Id,
        label: currency.CurrencyWithSuper,
    }));
    const displaySelectedCurrency = selectedCurrency
                                        ? {
                                            value: selectedCurrency.Id,
                                            label: selectedCurrency.CurrencyWithSuper,
                                        }
                                        : emptySelectedItem;

    console.log('selected currency', selectedCurrency);
    useEffect(() => {
            props.fetchLicensees();
        },
        []);

    const displaySourceAgent = selectedCurrency ? sourceAgent : '(No Data)';

    useEffect(() => {
            if (selectedLicensee) {
                props.fetchCurrencies({ siteName: selectedLicensee.Name });
            }
        },
        [selectedLicensee]);

    useEffect(() => {
            if (selectedCurrency) {
                props.fetchSourceAgent({ customerId: selectedCurrency.Id });
                if (message === FormMessage.DB_ERROR) {
                    setMessage(null);
                }
                return;
            }
        },
        [selectedCurrency]);

    useEffect(() => {
            if (isSubmitted && !agencies.length) {
                setMessage(FormMessage.DB_ERROR);
            }

            setIsSubmitted(false);
        },
        [isSubmitted]);
    const onChangeLicensee = (item) => {
        const licensee = licensees.find((licensee) => licensee.Id === item.value);
        props.setSelectLicensee(licensee);
    };

    const onChangeCurrency = (item) => {
        const currency = currencies.find((currency) => currency.Id === item.value);
        props.setSelectCurrency(currency);
    };

    const validateNumber = (value) => {
        if (!value && value !== 0) {
            return FormMessage.EMPTY_NUMBER;
        }

        if (value > 500) {
            return FormMessage.MAX_NUMBER;
        }

        if (value < 1) {
            return FormMessage.MIN_NUMBER;
        }

        return null;
    };

    const onChangeNumber = (event) => {
        const value = parseInt(
                event.target.value.replace(/\D/g, ''),
                DecimalRadixNumber
            )
            .toString();
        if (isNaN(value)) {
            setMessage(null);
            setNumber('');
            return;
        }

        const invalidMessage = validateNumber(value);
        if (invalidMessage) {
            setMessage(invalidMessage);
            setNumber(value);
            return;
        }

        setMessage(null);
        setNumber(value);
    };

    const onKeyPress = (event) => {
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
    };

    const onSubmit = async () => {
        if (!number && !message) {
            setMessage(FormMessage.EMPTY_NUMBER);
            return;
        }

        if (!message) {
            props.setAgencyMessages([]);
            props.setAgencies([]);

            await props.fetchSubUsernames({
                sourceAgency: sourceAgent,
                quantity: number,
            });

            setIsSubmitted(true);
        }
    };

    const errMessage = () =>
        message &&
        (
            <div>
                <label className="has-error">{message}</label>
            </div>
        );

    return (
        <div className="col-xs-12 filter-form">
            <div className="col-xs-12 col-lg-11 row">
                <div className="col-xs-12 col-lg-3 label-group form-group">
                    <label>Licensee</label>
                    <DropDown
                        options={displayLicensees}
                        value={displaySelectedLicensee}
                        onChange={onChangeLicensee}/>
                </div>
                <div className="col-xs-12 col-lg-3 form-group label-group">
                    <label>{'Currency (Super)'}</label>
                    <DropDown
                        options={displayCurrencies}
                        value={displaySelectedCurrency}
                        onChange={onChangeCurrency}/>
                </div>
                <div className="col-xs-12 col-lg-3 form-group label-group">
                    <label>Source Agent</label>
                    <input
                        className="medium"
                        type="text"
                        name="agent"
                        value={`  ${displaySourceAgent}`}
                        readOnly/>
                </div>
                <div className="col-xs-12 col-lg-2 form-group label-group">
                    <label>Number</label>
                    <input
                        maxLength="50"
                        placeholder="Maximum is 500"
                        onKeyPress={onKeyPress}
                        value={number}
                        onChange={onChangeNumber}/>
                </div>
                <div className="col-xs-12 col-lg-1 form-group label-group">
                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={!selectedCurrency}
                        onClick={onSubmit}>
                        Generate
                    </button>
                </div>
            </div>
            {errMessage()}
        </div>
    );
};

const mapDispatchToProps = (dispatch) => bindActionCreators(action, dispatch);

const mapStateToProps = (state) => {
    const {
        licensees,
        selectedLicensee,
        currencies,
        selectedCurrency,
        sourceAgent,
        agencies,
    } = state;

    return {
        licensees,
        selectedLicensee,
        currencies,
        selectedCurrency,
        sourceAgent,
        agencies,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);