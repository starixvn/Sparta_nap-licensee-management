import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, setLicensee, getProductList, getSystemList } from './action';
import RedmineConfirmForm from '../../../components/RedmineConfirmForm';
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

    onConfirm = (redmineId) => {
        if (redmineId) {
            this.props.toggleLoader(true);
            const url = 'LicenseeSetting/TerminateLicensee';
            const param = {
                LicenseeName: this.props.licensee.LicenseeName,
                RedmineId: redmineId
            };

            Site.fetchData(param, url)
                .then(response => {
                    if (!response.data.IsSuccess) {
                        Utility.showMessage(response.data.Error);
                    }
                    else {
                        this.setState({ isShow: false });
                        Utility.showMessage('Success!');
                    }

                    if (response.data.Data) {
                        this.setState({ isShow: false });
                        this.props.setLicensee(response.data.Data);
                        this.props.getProductList(this.props.licensee.LicenseeID);
                        this.props.getSystemList(this.props.licensee.LicenseeID);
                    }
                    else {
                        this.props.toggleLoader(false);
                    }
                }).catch(err => {
                    this.props.toggleLoader(false);
                });
        }
        else {
            this.setState({ isShow: false });
        }
    }

    render()
    {
        const { isShow } = this.state;

        return (
        <div>
            <button className="btn btn-red" onClick={this._terminateLicensee}>Terminate Licensee</button>
            <RedmineConfirmForm isShow={isShow}
                msg='Do you want to terminate this licensee?'
                style={{height: '210px', width: '400px'}}
                onConfirm={this.onConfirm} />
        </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, setLicensee, getProductList, getSystemList }, dispatch);
}
function mapStateToProps(state) {
    const { licensee } = state;
    return { licensee };
};

export default connect(mapStateToProps, mapDispatchToProps)(TerminateLicensee);