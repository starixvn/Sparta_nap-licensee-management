import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setLicensee, getProductList } from './action';
import ConfirmBox from '../../../components/ConfirmBox';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';

export class TerminateLicensee extends Component {
    constructor(props) {
        super(props);

        this.state = { isShow: false };
    };

    _terminateLicensee = () => {
        this.setState({ isShow: true });
    }

    onConfirm = (value) => {
        if (value) {
            this.props.toggleLoader(true);
            const url = 'LicenseeSetting/TerminateLicensee';
            const param = {
                LicenseeName: this.props.licensee.LicenseeName
            };

            Site.fetchData(param, url)
                .then(response => {
                    if (!response.data.IsSuccess) {
                        Utility.showMessage(response.data.Error);
                    }
                    else {
                        this.props.setLicensee(response.data.Data);
                        this.props.getProductList(this.props.licensee.LicenseeID);
                    }

                    this.props.toggleLoader(false);
                }).catch(err => {
                    Utility.showMessage('Please try later!');
                    this.props.toggleLoader(false);
                });
        }

        this.setState({ isShow: false });
    }

    render()
    {
        const { isShow } = this.state;

        return (
        <div>
            <button className="btn btn-red" onClick={this._terminateLicensee}>Terminate Licensee</button>
            <ConfirmBox isShow={isShow}
                title='Confirmation'
                message='Do you want to terminate this licensee?'
                style={{ height: '150px', width: '400px' }}
                onClose={this.onConfirm} />
        </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, setLicensee, getProductList }, dispatch);
}
function mapStateToProps(state) {
    const { licensee } = state;
    return { licensee };
};

export default connect(mapStateToProps, mapDispatchToProps)(TerminateLicensee);