import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toggleLoader, setLicenseeList } from './action'
import Site from '../../../lib/site';

import Loader from '../../../components/Loader'
import EditFunction from './function'
import EditCurrency from './currency'
import Detail from './detail/Form'

export class AppContainer extends Component {
    constructor(props) {
        super(props);

        this.state = { tabId: 0 };
    }

    onTabChange(tabId) {
        if (tabId > 0 && this.props.licenseeList === null) {
            this.props.toggleLoader(true);

            const url = 'ITUserManagement/GetAssignedLicenseeUserList';
            const param = { UserId: this.props.user.UserId };
            Site.fetchData(param, url)
                .then(response => {
                    const licenseeList = response.data.map(x => { return { label: x.Name, value: x.Id }; });
                    this.props.setLicenseeList(licenseeList);
                    this.props.toggleLoader(false);
                }).catch(e => {
                    this.props.toggleLoader(false);
                });
        }

        this.setState({tabId: tabId});
    }

    render() {
        const { user } = this.props;

        if (!user) {
            return <b className='red'>User does not exist!</b>;
        }
        
        const { tabId } = this.state;
        const activeClass = 'tab-item active';
        const unactiveClass = 'tab-item';

        return (
            <div>
                <div className='tab'>
                    <span className={tabId === 0 ? activeClass : unactiveClass} onClick={() => this.onTabChange(0)}>User Detail</span>
                    <span className={tabId === 1 ? activeClass : unactiveClass} onClick={() => this.onTabChange(1)}>LRF Function</span>
                    <span className={tabId === 2 ? activeClass : unactiveClass} onClick={() => this.onTabChange(2)}>Currency</span>
                </div>
                <Loader isLoading={this.props.isLoading} />
                <Detail isActive={tabId === 0} />
                <EditFunction isActive={tabId === 1} />
                <EditCurrency isActive={tabId === 2} />
            </div>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, setLicenseeList }, dispatch);
}
function mapStateToProps(state) {
    const { isLoading, user, licenseeList } = state;
    return { isLoading, user, licenseeList };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);