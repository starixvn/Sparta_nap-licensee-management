import React, { Component } from 'react'
import { AFFILIATE_PREREQUISITE_KEY, AffiliateFunctionList } from '../constant'

function isValidAffliateFunction(functionList) {
    const individualAffiliateFunction = functionList.find(f => AffiliateFunctionList.includes(f));

    return !individualAffiliateFunction ||
        (individualAffiliateFunction && functionList.indexOf(AFFILIATE_PREREQUISITE_KEY) !== -1);
}

export default class IgnoredFunctionList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            functionToAdd: "",
            functionList: this.props.functionList && JSON.parse(this.props.functionList)
        }
    }

    handleAddFunction = (event) => {
        event.preventDefault();

        const { functionToAdd, functionList } = this.state;

        if (!functionToAdd.trim() || functionList.indexOf(functionToAdd) !== -1) {
            this.setState({ functionToAdd: "" });
            return;
        }

        const newFunctionList = this._getFunctionListAfterAdding();

        if (!isValidAffliateFunction(newFunctionList)) {
            alert("Please add 'AffiliateItems' first!");
            return;
        }

        this.setState({
            functionList: newFunctionList,
            functionToAdd: ""
        });

        const { onEdit } = this.props;
        onEdit && onEdit(newFunctionList);
    }

    _getFunctionListAfterAdding() {
        const { functionToAdd, functionList } = this.state;

        const isMultiple = functionToAdd.indexOf(",") !== -1;
        let newFunctionList;
        if (isMultiple) {
            newFunctionList = [
                ...functionList,
                ...functionToAdd.split(",").reduce((addedList, item) => {
                    const func = item.trim();
                    if (func !== "" && functionList.indexOf(func) === -1) {
                        addedList.push(func);
                    }

                    return addedList;
                }, [])
            ]
        }
        else {
            newFunctionList = [...functionList, functionToAdd.trim()];
        }

        return newFunctionList;
    }

    handleRemoveFunction = (event, functionName) => {
        event.preventDefault();

        const newFunctionList = this._getFunctionListAfterRemoving(functionName);

        if (newFunctionList === null) {
            return;
        }

        this.setState({
            functionList: newFunctionList
        });

        const { onEdit } = this.props;
        onEdit && onEdit(newFunctionList);
    }

    _getFunctionListAfterRemoving(functionName) {
        const { functionList } = this.state;
        let newFunctionList;

        if (functionName === AFFILIATE_PREREQUISITE_KEY) {
            if (confirm("All Affiliate functions will be removed, are you sure?")) {
                newFunctionList = functionList.filter(item => item !== functionName && AffiliateFunctionList.indexOf(item) === -1);
            }
            else {
                return null;
            }
        }
        else {
            newFunctionList = functionList.filter(item => item !== functionName);
        }

        return newFunctionList;
    }

    handleChange = (event) => {
        this.setState({ functionToAdd: event.target.value });
    }

    render() {
        const { functionToAdd, functionList } = this.state;
        return (
            <div className="col-sm-12">
                <div className="form-group row">
                    <p className="col-sm-12">Ignored Function List</p>
                </div>

                <div className="form-group row">
                    <div className="col-sm-10 col-md-10 col-lg-6">
                        <input type="text" className="full-width" value={functionToAdd} onChange={this.handleChange} />
                    </div>
                    <button type="button" className="btn btn-green col-sm-2 col-md-1 addFunction" onClick={this.handleAddFunction}>Add</button>
                </div>

                <div className="form-group row">
                    <div className="col-sm-12 col-md-10 col-lg-6">
                        <ul className="ignored-function">
                            {
                                functionList &&
                                functionList.map((item, index) => {
                                    return (
                                        <li key={`f-${index}`}>
                                            {item}
                                            <a href="javascript:;"
                                                className="remove-function"
                                                title="Remove"
                                                onClick={(event) => { this.handleRemoveFunction(event, item) }}>
                                                <i className="icon-delete"></i>
                                            </a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}