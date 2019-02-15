import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from '../action';

import FormFilter from './FormFilter';
import DataGrid from './DataGrid';
import Site from '../../../../lib/site';

export class Index extends Component {
    constructor(props) {
        super(props);
    
        this.isFirstTime = false;

        this.state = { functionList: [] }
    }

    componentDidUpdate(prevState) {
        if (!this.isFirstTime && !prevState.isActive && this.props.isActive) {
            this.isFirstTime = true;

            this._getFunctionList();
        }
    }

    _getFunctionList()
    {
        this.props.toggleLoader(true);
        Site.fetchData(null, 'ITUserManagement/GetFunctionList')
            .then(response => {
                const functionList = response.data.map(x => { return { label: x.Name, value: x.Id }; });
                this.setState({ functionList: functionList });
                this.props.toggleLoader(false);
            }).catch(e => {
                this.props.toggleLoader(false);
            });
    }

    render() {
        return (
            <div style={{display: this.props.isActive ? 'block' : 'none'}}>
                <FormFilter functionList={this.state.functionList} />
                <DataGrid />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);