import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Popup from '../../../components/Popup';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';
import RedmineConfirmForm from '../../../components/RedmineConfirmForm';

export class AssignFunctionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowConfirmBox: false,
            isShowOptionBox: false,
            licenseeList: [],
            licensee: '',
            searchText: '',
            assignedItems: [],
            unassignedItems: [],
            assignOption: '0',
            removeOption: '0',
            isAssigned: true
        };

        this.assignFunctionOption = [
            { value: '0', label: 'Only assign function to licensee'},
            { value: '1', label: 'Assign function to admin users' },
            { value: '2', label: 'Assign function to all users' }
        ];
        this.removeFunctionOption = [
           { value: '0', label: 'Only remove function from licensee' },
           { value: '1', label: 'Remove function from all users'}
        ];
    };

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props && this.props.isShow) {
            this._getLicenseeList(this.props.functionId);
        }
    }

    onClose(callback) {
        this.setState({ 
            licenseeList: [],
            licensee: '',
            searchText: '',
            assignedItems: [],
            unassignedItems: [],
            assignOption: '0',
            removeOption: '0',
            isAssigned: true
        });

        callback && callback();
    }

    onCloseOptionBox = () => {
        this._showOptionBox(false);
        this._showConfirmBox(true);
    }

    onSubmit = () => {
        this._showOptionBox(true);
    }

    onConfirm = (redmineId) => {
        this._showConfirmBox(false);

        if (redmineId) {
            this._submit(redmineId);
        }
    }

    onCheckedOption(name, e) {
        this.setState({ [name]: e.target.value });
    }

    onItemChecked(e, item) {
        const { isAssigned } = this.state;

        if ((item === null && isAssigned) || (item !== null && item.Checked)) {
            this._getUnassignedCheckedItems(item, e.target.checked);
        }
        else {
            this._getAssignedCheckedItems(item, e.target.checked);
        }

    }

    onKeyPress = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            
            this.setState({searchText: e.target.value});
        }
    }

    _getLicenseeList(functionId) {
        this.props.toggleLoader(true);
        const url = 'ManageLrfFunction/GetLicenseeFunctionList';
        const params = {
            FunctionId: functionId
        };

        Site.fetchData(params, url)
            .then(response => {
                if (!response.data || response.data.length === 0) {
                    Utility.showMessage('No Licensees found.');
                }
                else {
                    this.setState({ licenseeList: response.data });
                }

                this.props.toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please try later!');
                this.props.toggleLoader(false);
            });
    }

    _getAssignedCheckedItems(item, checked) {
        const { assignedItems, licenseeList, searchText } = this.state;
        let newCheckedItems = [];

        if (checked) {
            if (item === null) {
                if (searchText === '') {
                    newCheckedItems = licenseeList.filter(x => !x.Checked);
                }
                else {
                    const checkedList = licenseeList.filter(x => !x.Checked && x.Name.indexOf(searchText) > -1);
                    const removedDuplicatedList = assignedItems.filter(x => x.Name.indexOf(searchText) === -1);
                    newCheckedItems = checkedList.concat(removedDuplicatedList);
                }
            }
            else {
                newCheckedItems = [...assignedItems, item];
            }
        }
        else {
            if (item === null) {
                newCheckedItems = assignedItems.filter(x => x.Name.indexOf(searchText) === -1);
            }
            else {
                newCheckedItems = assignedItems.filter(x => x !== item);
            }
        }

        this.setState({ assignedItems: newCheckedItems });
    }

    _getUnassignedCheckedItems(item, checked) {
        const { unassignedItems, licenseeList, searchText } = this.state;
        let newUncheckedItems = [];

        if (checked) {
            if (item === null) {
                if (searchText === '') {
                    newUncheckedItems = [];
                }
                else {
                    newUncheckedItems = unassignedItems.filter(x => x.Name.indexOf(searchText) === -1);
                }
            }
            else {
                newUncheckedItems = unassignedItems.filter(x => x !== item);
            }
        }
        else {
            if (item === null) {
                const uncheckedList = licenseeList.filter(x => x.Checked && x.Name.indexOf(searchText) > -1);
                const removedDuplicatedList = unassignedItems.filter(x => x.Name.indexOf(searchText) === -1);
                newUncheckedItems = uncheckedList.concat(removedDuplicatedList);
            }
            else {
                newUncheckedItems = [...unassignedItems, item];
            }
        }

        this.setState({ unassignedItems: newUncheckedItems });
    }

    _showOptionBox(isShow) {
        this.setState({ isShowOptionBox: isShow });
    }

    _showConfirmBox(isShow) {
        this.setState({ isShowConfirmBox: isShow });
    }

    _submit(redmineId) {
        this.props.toggleLoader(true);
        const url = 'LicenseeSetting/OfferProduct';
        const params = this._getParams(redmineId);

        Site.fetchData(params, url)
            .then(response => {
                if (response.data.Error) {
                    Utility.showMessage(response.data.Error);
                }
                else {
                    Utility.showMessage('Success!');
                }
                this._getLicenseeList(params.FunctionId);
            }).catch(err => {
                Utility.showMessage('Error!');
                this.props.toggleLoader(false);
            });
    }

    _getParams(redmineId)
    {
        const { assignedItems, unassignedItems } = this.state;

        return {
            FunctionId: this.props.function.FunctionId,
            AssignedLicensees: assignedItems.map(x => x.LicenseeName).join(','),
            UnassignedLicensees: unassignedItems.map(x => x.LicenseeName).join(','),
            RedmineId: redmineId
        };
    }

    _buildLicenseeCheckList() {
        const { licenseeList, assignedItems, unassignedItems, searchText, isAssigned } = this.state;
        let checkList = [];
        let checkingItems = 0;
        let showingItems = 0;
        let totalSelectedItems = 0;

        for (let i = 0; i < licenseeList.length; i++) {
            const item = licenseeList[i];
            const checked = item.Checked ? unassignedItems.indexOf(item) === -1 : assignedItems.indexOf(item) > -1;
            const isShow = (searchText === '' || item.Name.indexOf(searchText) > -1) && item.Checked === isAssigned;

            checkingItems = checked && isShow ? checkingItems + 1 : checkingItems;
            showingItems = isShow ? showingItems + 1 : showingItems;
            totalSelectedItems = checked ? totalSelectedItems + 1 : totalSelectedItems;

            checkList.push(
                <div key={item.Name} style={{display: isShow ? 'block' : 'none'}}>
                    <input id={item.Name} type='checkbox' checked={checked} onChange={(e) => this.onItemChecked(e, item)} />
                    <label htmlFor={item.Name} className='optional-label'>{item.Name}</label>
                </div>
            );
        }

        return (
            <div className='form-group licensee-selection-container'>
                <div><b>{totalSelectedItems}</b> selected item(s)</div>
                <input id='0' type='checkbox' value='0' checked={showingItems > 0 && checkingItems === showingItems} onChange={(e) => this.onItemChecked(e, null)} />
                <label htmlFor='0' className='optional-label'>All</label>
              
                <div className='licensee-selection'>
                    {checkList}
                </div>
            </div>
        );

    }

    _buildContent() {
        const { licensee, isAssigned, assignedItems, unassignedItems } = this.state;
        const { onClose } = this.props;

        return (
            <div className='licensee-form edit-form'>
                <div className='row'>
                    <div className='col-xs-8'>
                        <input type='text'
                        value={licensee}
                        maxLength='50'
                        className='full-width'
                        placeholder='Licensee Name'
                        onChange={(e) => this.setState({licensee: e.target.value})}
                        onKeyPress={this.onKeyPress} />
                    </div>
                    <div className='col-xs-4'>
                        <input id='isAssigned' type='checkbox' checked={isAssigned} onChange={(e) => this.setState({isAssigned: e.target.checked})} />
                        <label htmlFor='isAssigned' className='optional-label'>Assigned</label>
                    </div>
                </div>
                {this._buildLicenseeCheckList()}
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={this.onSubmit} disabled={assignedItems.length === 0 && unassignedItems.length ===0} >
                        Submit
                    </button>
                    <button className='btn btn-red' onClick={() => this.onClose(onClose)}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    _buildOption(optionName, message, options, checkedValue) {
        return (
            <div key={optionName} className='form-group'>
                {message}
                {
                    options.map(x => {
                        const key = optionName + x.value;
                        return (
                            <div key={key}>
                                <input id={key} type='radio' value={x.value} name={optionName} checked={checkedValue === x.value} onChange={(e) => this.onCheckedOption(optionName, e)} />
                                <label htmlFor={key} className='optional-label'>{x.label}</label>
                            </div>
                        );
                    })
                }
            </div>);
    }

    _buildOptionContent(totalaAssignedItems, totalUnassignedItems, assignOption, removeOption) {
        let content = [];

        if (totalaAssignedItems) {
            const msg = `This function will be assigned to ${totalaAssignedItems} more licensee(s). Do you want to assgin to licensee users?`
            content.push(this._buildOption('assignOption', msg, this.assignFunctionOption, assignOption));
        }

        if (totalUnassignedItems) {
            const msg = `This function will be removed from ${totalUnassignedItems} licensee(s). Do you want to remove it from licensee users?`
            content.push(this._buildOption('removeOption', msg, this.removeFunctionOption, removeOption));
        }

        return (
            content.length > 0 &&
            <div className='edit-form'>
                { content }
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={this.onCloseOptionBox}>
                        Submit
                    </button>
                    <button className='btn btn-red' onClick={() => this._showOptionBox(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    _buildOptionPopup(isShow) {
        const { assignedItems, unassignedItems, assignOption, removeOption } = this.state;
        const totalaAssignedItems = assignedItems.length;
        const totalUnassignedItems = unassignedItems.length;
        const height = (totalaAssignedItems && totalUnassignedItems) ? '335px' : (totalaAssignedItems > 0 ? '235px' : '210px');

        return <Popup isShow={isShow}
            title='Confirmation'
            content={this._buildOptionContent(totalaAssignedItems, totalUnassignedItems, assignOption, removeOption)}
            className='no-scroll'
            style={{ height: height, width: '400px' }}
            zIndex={52}
            onClose={() => this._showOptionBox(false)} />
    }

    _buildConfirmationPopup(isShow) {
        const { assignedItems, unassignedItems, assignOption, removeOption } = this.state;
        const totalaAssignedItems = assignedItems.length;
        const totalUnassignedItems = unassignedItems.length;

        return <RedmineConfirmForm isShow={isShow}
                msg={this._getConfirmationMsg(totalaAssignedItems, totalUnassignedItems, assignOption, removeOption)}
                style={{height: '255px', width: '510px'}}
                onConfirm={this.onConfirm} />
    }

    _getConfirmationMsg(totalaAssignedItems, totalUnassignedItems, assignOption, removeOption) {
        return (
            <div>
                {
                    totalaAssignedItems ? '' : <p>- Assign this function to {totalaAssignedItems} more licensee(s).({this.assignFunctionOption[assignOption].label})</p>
                }
                {
                    totalUnassignedItems ? '' : <p>- Remove this function from {totalUnassignedItems} licensee(s).({this.removeFunctionOption[assignOption].label})</p>
                }
                <p>Do you want to perform this action?</p>
            </div>
        );
    }

    render() {
        const { isShowConfirmBox, isShowOptionBox } =  this.state;
        const { isShow, onClose } =  this.props;

        return (
            <div>
                {
                    isShowConfirmBox &&
                    this._buildConfirmationPopup(isShowConfirmBox)
                }
                {
                    isShowOptionBox &&
                    this._buildOptionPopup(isShowOptionBox)
                }
                <Popup isShow={isShow}
                    title='Assign Function'
                    content={this._buildContent()}
                    style={{height: '70%', width: '350px'}}
                    className='no-scroll'
                    onClose={() => this.onClose(onClose)} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignFunctionForm);