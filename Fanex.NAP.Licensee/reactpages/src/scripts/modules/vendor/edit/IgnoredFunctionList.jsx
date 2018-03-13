import React, { Component } from 'react'
import Select from 'react-select'

import { AFFILIATE_PREREQUISITE_KEY, AffiliateFunctionList } from '../constant'

function isValidAffliateFunction(functionList) {
    const individualAffiliateFunction = functionList.find(f => AffiliateFunctionList.includes(f));

    return !individualAffiliateFunction ||
        (individualAffiliateFunction && functionList.indexOf(AFFILIATE_PREREQUISITE_KEY) !== -1);
}

export default class IgnoredFunctionList extends Component {
    constructor(props) {
        super(props);

        const selectedFunctionList = (this.props.exclusionList && JSON.parse(this.props.exclusionList)) || [];

        this.state = { selectedFunctionList }
    }

    handleChangeFunction = (newSelectedFunctions) => {
        let newFunctionList = newSelectedFunctions.map(item => item.value);
        const oldSelectedFunctionList = this.state.selectedFunctionList;

        const isAdding = newFunctionList.length > oldSelectedFunctionList.length;

        if (isAdding) {
            if (!isValidAffliateFunction(newFunctionList)) {
                alert("Please add 'AffiliateItems' first!");
                return;
            }
        }
        else {
            const isRemovingAffPrerequisiteKey = oldSelectedFunctionList.indexOf(AFFILIATE_PREREQUISITE_KEY) > -1 &&
                newFunctionList.indexOf(AFFILIATE_PREREQUISITE_KEY) === -1

            if (isRemovingAffPrerequisiteKey) {
                newFunctionList = confirm("All Affiliate functions will be removed, are you sure?") ?
                    newFunctionList.filter(item => item !== AFFILIATE_PREREQUISITE_KEY && AffiliateFunctionList.indexOf(item) === -1) :
                    oldSelectedFunctionList;
            }
        }

        this.setState({ selectedFunctionList: newFunctionList });

        const { onEdit } = this.props;
        onEdit && onEdit(newFunctionList);
    }

    handleChangeSelectedFunctionList = (selectedFunction) => {
        this.handleChangeFunction(selectedFunction);
    }

    _buildSelectOption() {
        return this.props.functionKeyList.map(item => {
            return {
                value: item,
                label: item
            }
        })
    }

    render() {
        const { selectedFunctionList } = this.state;
        return (
            <div className="col-sm-12">
                <div className="form-group row">
                    <p className="col-sm-12">Ignored Function List</p>
                </div>

                <div className="form-group row">
                    <div className="col-sm-10 col-md-10 col-lg-10">
                        <Select
                            name="form-field-name"
                            placeholder="Select Functions..."
                            multi={true}
                            closeOnSelect={false}
                            removeSelected={true}
                            value={selectedFunctionList}
                            onChange={this.handleChangeSelectedFunctionList}
                            options={this._buildSelectOption()}
                        />
                    </div>
                </div>
            </div>
        )
    }
}