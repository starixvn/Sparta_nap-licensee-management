import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Site from '../../../lib/site';
import Popup from '../../../components/Popup';

export class LAPExclusions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShow: false,
            content: null
        }
    };

    onClose = () => {
        this.setState({ 
            isShow: false,
            content: null
        });
    }

    _getLapExclusions = () => {
        this.props.toggleLoader(true);
        const url = 'LicenseeSetting/GetLapExclusions';

        Site.fetchData({ LicenseeId: this.props.licensee.LicenseeID }, url)
            .then(response => {
                this.setState({ 
                    isShow: true,
                    content: response.data
                });

                this.props.toggleLoader(false);
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    _buildContent (content) {
        return content && content.map((item, index) => {
            return <p key={index}>{item}</p>
        });
    }

    render()
    {
        const { isShow, content } = this.state;

        return (
         <div>
            <button className="btn btn-primary" onClick={this._getLapExclusions}>Generate LAP Exclusions</button>
            <Popup isShow={isShow}
                title='LAP EXCLUSIONS'
                content={this._buildContent(content)}
                style={{width: '300px', height: `${content ? (content.length * 28 + 80) : '80'}px`}}
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

export default connect(mapStateToProps, mapDispatchToProps)(LAPExclusions);