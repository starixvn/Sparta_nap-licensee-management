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
            licenseeList: [],
            licensee: '',
            searchText: '',
            assignedItems: [],
            unassignedItems: [],
            isAssigned: true
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props && this.props.isShow) {
            this._getLicenseeList(this.props.userId);
        }
    }

    onItemChecked(e, item) {
        const { isAssigned } = this.state;

        if ((item === null && isAssigned) || (item !== null && item.Checked)) {
            const newUnassignedItems = this._getUnassignedCheckedItems(item, e.target.checked);
            this.setState({ unassignedItems: newUnassignedItems });
        }
        else {
            const newAssignedItems = this._getAssignedCheckedItems(item, e.target.checked);
            this.setState({ assignedItems: newAssignedItems });
        }

    }

    onKeyPress = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            
            this.setState({searchText: e.target.value});
        }
    }

    onClose(callback) {
        this.setState({ 
            licenseeList: [],
            licensee: '',
            searchText: '',
            assignedItems: [],
            unassignedItems: [],
            isAssigned: true
        });

        callback && callback();
    }

    _getLicenseeList(userId) {
        this.props.toggleLoader(true);
        const url = 'ITUserManagement/GetLicenseeUserList';
        const params = {
            UserId: userId
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

        if (!checked) {
            return item === null ? assignedItems.filter(x => x.Name.indexOf(searchText) === -1) : assignedItems.filter(x => x !== item);
        }

        if (item !== null) {
            return [...assignedItems, item];
        }

        if (searchText === '') {
            return licenseeList.filter(x => !x.Checked);
        }

        const checkedList = licenseeList.filter(x => !x.Checked && x.Name.indexOf(searchText) > -1);
        const removedDuplicatedList = assignedItems.filter(x => x.Name.indexOf(searchText) === -1);
        return checkedList.concat(removedDuplicatedList);
    }

    _getUnassignedCheckedItems(item, checked) {
        const { unassignedItems, licenseeList, searchText } = this.state;

        if (checked) {
            if (item === null) {
                return searchText === '' ? [] : unassignedItems.filter(x => x.Name.indexOf(searchText) === -1);
            }

            return unassignedItems.filter(x => x !== item);
        }

        if (item !== null) {
            return [...unassignedItems, item];           
        }
        
        const uncheckedList = licenseeList.filter(x => x.Checked && x.Name.indexOf(searchText) > -1);
        const removedDuplicatedList = unassignedItems.filter(x => x.Name.indexOf(searchText) === -1);
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

    render() {
        const { isShow, onClose, userName } =  this.props;

        return (
            <div>
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