import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';
import Popup from '../../../components/Popup';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';
import RedmineConfirmForm from '../../../components/RedmineConfirmForm';

export class LicenseeForm extends Component {
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
            isAssigned: true,
            assignOption: '0',
            removeOption: '0'
        };

        this.assignUserOption = [
            { value: '0', label: 'Only add licensee'},
            { value: '1', label: 'Assign all currencies and functions, excluding "Account Management" and "Notification"' },
            { value: '2', label: 'Assign all currencies and functions, including "Account Management" and "Notification"' }
        ];
        this.removeUserOption = [
           { value: '0', label: 'Only remove licensee' },
           { value: '1', label: 'Remove all currencies and functions'}
        ];

        this.totalOriginalCheckedItems = 0;
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props && this.props.isShow) {
            this._getLicenseeList();
        }
    }

    onItemChecked(e, item) {
        const { isAssigned, unassignedItems } = this.state;
        const checked = e.target.checked;

        if ((item === null && isAssigned) || (item !== null && item.Checked)) {
            const newUnassignedItems = this._getUnassignedCheckedItems(item, checked);
            this.setState({ unassignedItems: newUnassignedItems });
        }
        else {
            const newAssignedItems = this._getAssignedCheckedItems(item, checked);
            const totalCheckedItems = this.totalOriginalCheckedItems + newAssignedItems.length - unassignedItems.length;
            if (checked && !this.props.isAdmin && totalCheckedItems > 1)
            {
                return;
            }
            this.setState({ assignedItems: newAssignedItems });
        }
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

    onKeyPress = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            
            this.setState({searchText: e.target.value.toLowerCase()});
        }
    }

    onClose(callback) {
        this.setState({
            isShowConfirmBox: false,
            isShowOptionBox: false,
            licensee: '',
            searchText: '',
            isAssigned: true
        });

        callback && callback();
    }

    _showOptionBox(isShow) {
        if (isShow) {
            this.setState({ isShowOptionBox: isShow, assignOption: '0', removeOption: '0' });
        }
        else {
            this.setState({ isShowOptionBox: isShow });
        }
    }

    _showConfirmBox(isShow) {
        this.setState({ isShowConfirmBox: isShow });
    }

    _getParams(redmineId)
    {
        const { assignedItems, unassignedItems, assignOption, removeOption } = this.state;

        return {
            UserId: this.props.userId,
            AssignedLicensees: assignedItems.map(x => x.Name).join(','),
            UnassignedLicensees: unassignedItems.map(x => x.Name).join(','),
            AssignOption: assignOption,
            RemoveOption: removeOption,
            RedmineId: redmineId
        };
    }

    _submit(redmineId) {
        this.props.toggleLoader(true);
        const url = 'ITUserManagement/AssignUser';
        const params = this._getParams(redmineId);

        Site.fetchData(params, url)
            .then(response => {
                if (!response.data.IsSuccess) {
                    Utility.showErrorMessage(response.data.Error);
                }
                else {
                    if (response.data.Error) {
                        Utility.showWarningMessage(response.data.Error);
                    }
                    else {
                        Utility.showMessage('Success!');
                    }
                }
                this._getLicenseeList();
            }).catch(err => {
                this.props.toggleLoader(false);
        });
    }

    _getLicenseeList() {
        this.props.toggleLoader(true);
        const url = 'ITUserManagement/GetLicenseeUserList';
        const params = {
            UserName: this.props.userName
        };

        Site.fetchData(params, url)
            .then(response => {
                if (!response.data || response.data.length === 0) {
                    Utility.showMessage('No Licensees found.');
                }
                else {
                    this.totalOriginalCheckedItems = response.data.filter(x => x.Checked).length;

                    this.setState({ licenseeList: response.data, assignedItems: [], unassignedItems: [] });
                }

                this.props.toggleLoader(false);
            }).catch(err => {
                this.props.toggleLoader(false);
        });
    }

    _getAssignedCheckedItems(item, checked) {
        const { assignedItems, licenseeList, searchText } = this.state;

        if (!checked) {
            return item === null ? assignedItems.filter(x => x.Name.toLowerCase().indexOf(searchText) === -1) : assignedItems.filter(x => x !== item);
        }

        if (item !== null) {
            return [...assignedItems, item];
        }

        if (searchText === '') {
            return licenseeList.filter(x => !x.Checked);
        }

        const checkedList = licenseeList.filter(x => !x.Checked && x.Name.toLowerCase().indexOf(searchText) > -1);
        const removedDuplicatedList = assignedItems.filter(x => x.Name.toLowerCase().indexOf(searchText) === -1);
        return checkedList.concat(removedDuplicatedList);
    }

    _getUnassignedCheckedItems(item, checked) {
        const { unassignedItems, licenseeList, searchText } = this.state;

        if (checked) {
            if (item === null) {
                return searchText === '' ? [] : unassignedItems.filter(x => x.Name.toLowerCase().indexOf(searchText) === -1);
            }

            return unassignedItems.filter(x => x !== item);
        }

        if (item !== null) {
            return [...unassignedItems, item];           
        }
        
        const uncheckedList = licenseeList.filter(x => x.Checked && x.Name.toLowerCase().indexOf(searchText) > -1);
        const removedDuplicatedList = unassignedItems.filter(x => x.Name.toLowerCase().indexOf(searchText) === -1);
        return uncheckedList.concat(removedDuplicatedList);
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
            const isShow = (searchText === '' || item.Name.toLowerCase().indexOf(searchText) > -1) && item.Checked === isAssigned;

            checkingItems = checked && isShow ? checkingItems + 1 : checkingItems;
            showingItems = isShow ? showingItems + 1 : showingItems;
            totalSelectedItems = checked ? totalSelectedItems + 1 : totalSelectedItems;

            checkList.push(
                <div key={i} style={{display: isShow ? 'block' : 'none'}}>
                    <input id={item.Name} type='checkbox' checked={checked} onChange={(e) => this.onItemChecked(e, item)} />
                    <label htmlFor={item.Name} className='optional-label'>{item.Name}</label>
                </div>
            );
        }

        return (
            <div className='form-group licensee-selection-container'>
                <div><b>{totalSelectedItems}</b> selected item(s) { this.props.isAdmin ? '' : <span>- <b className='red'>Only add 1 Licensee for this user!</b></span> }</div>
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
        const { onClose, isAdmin } = this.props;

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
                    <button className='btn btn-primary' onClick={this.onSubmit} disabled={assignedItems.length === 0 && unassignedItems.length === 0} >
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
            const msg = `${totalaAssignedItems} more licensee(s) will be added. Do you want to assgin these(this) licensee's currencies and functions to user?`
            content.push(this._buildOption('assignOption', msg, this.assignUserOption, assignOption));
        }

        if (totalUnassignedItems) {
            const msg = `${totalUnassignedItems} licensee(s) will be removed. Do you want to remove all these(this) licensee's currencies and functions from user?`
            content.push(this._buildOption('removeOption', msg, this.removeUserOption, removeOption));
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
        const height = (totalaAssignedItems && totalUnassignedItems) ? '340px' : (totalaAssignedItems > 0 ? '240px' : '215px');

        return <Popup isShow={isShow}
            title='Confirmation'
            content={this._buildOptionContent(totalaAssignedItems, totalUnassignedItems, assignOption, removeOption)}
            className='no-scroll'
            style={{ height: height, width: '580px' }}
            zIndex={52}
            onClose={() => this._showOptionBox(false)} />
    }

    _buildConfirmationPopup(isShow) {
        const { assignedItems, unassignedItems, assignOption, removeOption } = this.state;
        const totalaAssignedItems = assignedItems.length;
        const totalUnassignedItems = unassignedItems.length;
        const height = (totalaAssignedItems && totalUnassignedItems) ? '275px' : (totalaAssignedItems > 0 ? '245px' : '230px');

        return <RedmineConfirmForm isShow={isShow}
                msg={this._getConfirmationMsg(totalaAssignedItems, totalUnassignedItems, assignOption, removeOption)}
                style={{height: height, width: '510px'}}
                onConfirm={this.onConfirm} />
    }

    _getConfirmationMsg(totalaAssignedItems, totalUnassignedItems, assignOption, removeOption) {
        return (
            <div>
                {
                    totalaAssignedItems ? <p>- <b>Add</b> <b>{totalaAssignedItems}</b> more licensee(s) for user.({this.assignUserOption[assignOption].label})</p> : ''
                }
                {
                    totalUnassignedItems ? <p>- <b>Remove</b> <b>{totalUnassignedItems}</b> licensee(s) from user.({this.removeUserOption[removeOption].label})</p> : ''
                }
                <p>Do you want to perform this action?</p>
            </div>
        );
    }

    render() {
        const { isShowConfirmBox, isShowOptionBox } =  this.state;
        const { isShow, onClose, userName } =  this.props;

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
                    title={`Edit Licensee of "${userName}"`}
                    content={this._buildContent()}
                    style={{height: '70%', width: '445px'}}
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

export default connect(mapStateToProps, mapDispatchToProps)(LicenseeForm);