import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Loader from '../../../components/Loader'
import EditFunction from './EditFunction'
import EditCurrency from './EditCurrency'

const defaultState = Object.assign({}, window.initialState);

export class AppContainer extends Component {
    constructor(props) {
        super(props);

        this.state = { tabId: 0 };
    }

    render() {
        if (!defaultState.user) {
            return <b className='red'>User does not exist!</b>;
        }
        
        const { tabId } = this.state;
        const activeClass = 'tab-item active';
        const unactiveClass = 'tab-item';

        return (
            <div>
                <div className='tab'>
                    <span className={tabId === 0 ? activeClass : unactiveClass} onClick={() => this.setState({tabId: 0})}>LRF Function</span>
                    <span className={tabId === 1 ? activeClass : unactiveClass} onClick={() => this.setState({tabId: 1})}>Currency</span>
                </div>
                <Loader isLoading={this.props.isLoading} />              
                <EditFunction isActive={tabId === 0}
                    user={defaultState.user}
                    licenseeList={defaultState.licenseeList}
                    functionList={defaultState.functionList} />
                <EditCurrency isActive={tabId === 1}
                    user={defaultState.user}
                    licenseeList={defaultState.licenseeList} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { isLoading } = state;
    return { isLoading };
};

export default connect(mapStateToProps)(AppContainer);