import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import action from './action';
import { MessageBox } from './Message';
import { MessageStatus, AgencyStatus } from './constant/grid';
import { Status } from './Status';

export const DataGrid = (props) => {
    const { agencies, gridMessages, sourceAgent, selectedLicensee, selectedCurrency } = props;
    const [isSubmitted, setIsSubmitted] = useState(false);

    const usernames = agencies.map((agency) => agency.username);
    const createSubsidiariesRequest = useMemo(
        () => ({
            Usernames: usernames,
            SourceAgency: sourceAgent,
            SiteName: selectedLicensee && selectedLicensee.Name,
            CustomerId: selectedCurrency && selectedCurrency.Id,
            ExchangeId: selectedCurrency && selectedCurrency.CurrencyId
        }),
        [agencies]
    );

    useEffect(() => {
            if (isSubmitted && !gridMessages.length) {
                props.addAgencyMessage({ status: MessageStatus.Success });
            }

            return () => setIsSubmitted(false);
        },
        [isSubmitted, gridMessages]);

    const subsidiariesCreated = () => gridMessages.length > 0;
    const onClickCreate = async () => {
        if (subsidiariesCreated()) {
            return;
        }

        props.toggleProcess(agencies, AgencyStatus.NotCreated, AgencyStatus.InProcess);

        await props.createAgencies(createSubsidiariesRequest);

        setIsSubmitted(true);
    };

    if (!agencies || !Array.isArray(agencies) || agencies.length === 0) {
        return <div></div>;
    }

    return (
        <div className="filter-form grid col-lg-9 col-xs-12">
            <MessageBox messages={gridMessages}/>
            <div className="table-container">
                <table className="table table-bordered table-hover form-group grid row">
                    <thead>
                    <tr>
                        <th className="index">#</th>
                        <th>Copied Account</th>
                        <th>Status</th>
                    </tr>
                    </thead>

                    <tbody>
                    {agencies.map((agency, index) => {
                        return (
                            <tr key={agency.username}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{agency.username}</td>
                                <td className="text-center">
                                    <Status status={agency.status}/>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <button
                type="button"
                className="btn btn-primary form-group"
                onClick={onClickCreate}>
                Create Account
            </button>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => bindActionCreators(action, dispatch);

const mapStateToProps = (state) => {
    const {
        agencies,
        gridMessages,
        sourceAgent,
        selectedLicensee,
        selectedCurrency,
    } = state;
    return {
        agencies,
        gridMessages,
        sourceAgent,
        selectedLicensee,
        selectedCurrency,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataGrid);