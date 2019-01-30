import React, { Component } from 'react'

import FormFilter from './function/FormFilter'
import DataGrid from './function/DataGrid'

export default class EditFunction extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { isActive, userName, licenseeList, functionList } = this.props

        return (
            <div style={{display: isActive ? 'block' : 'none'}}>
                <FormFilter userName={userName}
                    licenseeList={licenseeList}
                    functionList={functionList} />
                <DataGrid />
            </div>
        )
    }
}