﻿import React, { Component } from 'react';
import { connect } from 'react-redux';

export class LicenseeInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const licensee = this.props.licensee;

        return (
        <div className='row'>
            <div className='col-xs-12'>
                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>Licensee Name</label>
                    <div className='col-sx-12 col-sm-9'>
                        {licensee.LicenseeName}
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>Description</label>
                    <div className='col-sx-12 col-sm-9'>
                        {licensee.Description}
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>Reseller</label>
                    <div className='col-sx-12 col-sm-9'>
                        {licensee.Reseller}
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>Deposit</label>
                    <div className='col-sx-12 col-sm-9'>
                        <span className={licensee.IsDeposit ? 'glyphicon glyphicon-ok' : ''}></span>
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>Affected Date</label>
                    <div className='col-sx-12 col-sm-9'>
                        {licensee.AffectedDateString}
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>Active</label>
                    <div className='col-sx-12 col-sm-9'>
                        <span className={licensee.IsActive ? 'glyphicon glyphicon-ok' : ''}></span>
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>Brand Name</label>
                    <div className='col-sx-12 col-sm-9'>
                        {licensee.BrandName}
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>Company Name</label>
                    <div className='col-sx-12 col-sm-9'>
                        {licensee.CompanyName}
                    </div>
                </div>

                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>KPI Active</label>
                    <div className='col-sx-12 col-sm-9'>
                        <span className={licensee.IsKPIActive ? 'glyphicon glyphicon-ok' : ''}></span>
                    </div>
                </div>

                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>OneWork Active</label>
                    <div className='col-sx-12 col-sm-9'>
                        <span className={licensee.IsOneWorkActive ? 'glyphicon glyphicon-ok' : ''}></span>
                    </div>
                </div>

                <div className='form-group row'>
                    <label className='col-sx-12 col-lg-3 col-sm-3 col-form-label'>Allow Member Comm</label>
                    <div className='col-sx-12 col-sm-9'>
                        <span className={licensee.IsAllowedMemberComm ? 'glyphicon glyphicon-ok' : ''}></span>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}


function mapStateToProps(state) {
    const { licensee } = state;
    return { licensee };
};

export default connect(mapStateToProps)(LicenseeInfo);