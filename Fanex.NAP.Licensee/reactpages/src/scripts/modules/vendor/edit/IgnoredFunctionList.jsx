import React, { Component } from 'react'
import Select from 'react-select'

import { AFFILIATE_PREREQUISITE_KEY, AffiliateFunctionList } from '../constant'

function isValidAffliateFunction(functionList) {
    const individualAffiliateFunction = functionList.find(f => AffiliateFunctionList.includes(f));

    return !individualAffiliateFunction ||
        (individualAffiliateFunction && functionList.indexOf(AFFILIATE_PREREQUISITE_KEY) === -1);
}

export default class IgnoredFunctionList extends Component {
    constructor(props) {
        super(props);

        const selectedFunctionList = this._parseExclusionList();
        
        this.state = {
            selectedFunctionList: selectedFunctionList,
            functionKeyList: this._buildFunctionKeyList()
        }

        this.originalFunctionList = selectedFunctionList;
    }

    _parseExclusionList() {
        const { exclusionList } = this.props;
        return (exclusionList && JSON.parse(exclusionList)) || [];
    }

    _buildFunctionKeyList() {
        const { functionKeyList } = this.props;

        return functionKeyList && functionKeyList.map(item => {
            return {
                value: item,
                label: item
            }
        })
    }

    get originalFunctionText() {
        return this.originalFunctionList.join(",");
    }

    get addingFunctionText() {
        return this.state.selectedFunctionList.filter(item => !this.originalFunctionList.includes(item)).join(",")
    }

    get removingFunctionText() {
        return this.originalFunctionList.filter(item => !this.state.selectedFunctionList.includes(item)).join(",");
    }

    handleChangeFunction = (newSelectedFunctions) => {
        let newFunctionList = newSelectedFunctions.map(item => item.value);
        const oldSelectedFunctionList = this.state.selectedFunctionList;

        const isAdding = newFunctionList.length > oldSelectedFunctionList.length;
        if (isAdding) {
            if (!isValidAffliateFunction(newFunctionList)) {
                alert("Please use either 'AffiliateItems' or Affiliate function!");
                return;
            }
        }

        this._setState(newFunctionList);

        const { onEdit } = this.props;
        onEdit && onEdit(newFunctionList);
    }

    _setState(newFunctionList) {
        const { functionKeyList } = this.state;
        const exceptionFunctionList = newFunctionList.filter(item => !functionKeyList.includes(item));

        const newState = {
            selectedFunctionList: newFunctionList
        }

        if (exceptionFunctionList.length) {
            newState["functionKeyList"] = functionKeyList.concat(exceptionFunctionList);
        }

        this.setState(newState);
    }

    handleChangeSelectedFunctionList = (selectedFunction) => {
        this.handleChangeFunction(selectedFunction);
    }

    render() {
        const { selectedFunctionList, functionKeyList } = this.state;
        return (
            <div className="col-sm-12">
                <div className="form-group row">
                    <p className="col-sm-12">Ignored Function List</p>
                </div>

                <div className="form-group row">
                    <label className="col-sm-3 col-md-3 col-lg-2 col-form-label">Old List: </label>
                    <div className="col-sm-9 col-md-9 col-lg-10">
                        <p className="text-wrap">{this.originalFunctionText}</p>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-3 col-md-3 col-lg-2 col-form-label">Adding: </label>
                    <div className="col-sm-9 col-md-9 col-lg-10">
                        <p className="text-wrap">{this.addingFunctionText}</p>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-3 col-md-3 col-lg-2 col-form-label">Removing: </label>
                    <div className="col-sm-9 col-md-9 col-lg-10">
                        <p className="text-wrap">{this.removingFunctionText}</p>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <label className="text-wrap"><i>Selected Functions (Enter a value that's NOT in the list)</i></label>
                    </div>
                    <div className="col-sm-10 col-md-10 col-lg-10">
                        <Select.Creatable
                            name="form-field-name"
                            placeholder="Select Functions..."
                            multi={true}
                            closeOnSelect={false}
                            removeSelected={true}
                            value={selectedFunctionList}
                            onChange={this.handleChangeSelectedFunctionList}
                            options={functionKeyList}
                        />
                    </div>
                </div>
            </div>
        )
    }
}