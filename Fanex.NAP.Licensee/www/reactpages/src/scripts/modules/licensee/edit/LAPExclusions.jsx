import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';

export class LAPExclusions extends Component {
    constructor(props) {
        super(props);
    };

    _getLapExclusions = () => {
        this.props.toggleLoader(true);
        const url = 'LicenseeSetting/GetLapExclusions';

        Site.fetchData({ LicenseeId: this.props.licensee.LicenseeID }, url)
            .then(response => {
                Utility.showMessage(response.data);

                this.props.toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please try later!');
                this.props.toggleLoader(false);
            });
    }

    render()
    {
        return (<button className="btn btn-primary" onClick={this._getLapExclusions}>Generate LAP Exclusions</button>);
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { licensee } = state;
    return { licensee };
};

export default connect(mapStateToProps, mapDispatchToProps)(LAPExclusions);