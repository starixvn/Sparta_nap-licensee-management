import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, getSystemList } from './action';
import Popup from '../../../components/Popup';
import ConfirmBox from '../../../components/ConfirmBox';
import Site from '../../../lib/site';
import Select from 'react-select';
import Utility from '../../../lib/utility';
import NumericInput from '../../../components/NumericInput';

export class ActivateNewSystemForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowConfirmBox: false,
            selectedSystem: null,
            isShow: false,
            systemList: [],
            redmineId: ''
        };
    };

    get isValid() {
        const { selectedSystem, redmineId } = this.state;

        return redmineId && selectedSystem !== null && selectedSystem.length > 0;
    }

    onClose() {
        this.setState({ 
            isShowConfirmBox: false,
            selectedSystem: null,
            isShow: false,
            systemList: [],
            redmineId: ''
        });
    }

    onSubmit = () => {
        this._showConfirmBox(true);
    }

    _showConfirmBox(isShow) {
        this.setState({ isShowConfirmBox: isShow });
    }

    onConfirm = (value) => {
        this._showConfirmBox(false);

        if (value) {
            this._submit();
        }
    }

    _submit() {
        this.props.toggleLoader(true);
        const url = 'LicenseeSetting/ActivateSystem';
        const params = this._getParams();

        Site.fetchData(params, url)
            .then(response => {
                if (response.data.Error) {
                    Utility.showMessage(response.data.Error);
                }
                else {
                    Utility.showMessage('Success!');
                }
                
                this.onClose();
                this.props.getSystemList(this.props.licensee.LicenseeID);
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    _getParams()
    {
        const { selectedSystem, redmineId } = this.state;

        return {
            LicenseeName: this.props.licensee.LicenseeName,
            SystemName: selectedSystem == null ? '' : selectedSystem.map(i => i.value).join(','),
            RedmineId: redmineId
        };
    }

    onClick = () => {
        this.props.toggleLoader(true);
        const url = 'LicenseeSetting/GetDeactiveSystemList';

        Site.fetchData({ LicenseeId: this.props.licensee.LicenseeID }, url)
            .then(response => {
                if (!response.data || response.data.length === 0) {
                    Utility.showMessage('There is no system to activate!');
                }
                else {
                    const systemList = response.data.map((item) => { return { label: item.Description, value: item.SystemName }; });

                    this.setState({ systemList: systemList, isShow: true });
                }

                this.props.toggleLoader(false);
            }).catch(err => {
                this.props.toggleLoader(false);
            });
    }

    _buildContent(selectedSystem, systemList, redmineId) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>System</label>
                    <Select instanceId='ddlSystem'
                        className={`full-width big-box ${selectedSystem !== null && selectedSystem.length > 0 ? '' : 'has-error'}`}
                        value={selectedSystem}
                        options={systemList}
                        multi={true}
                        onChange={(item) => this.setState({ selectedSystem: item })} />
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Redmine Id</label>
                    <NumericInput className={`full-width ${redmineId ? '' : 'has-error'}`}
                        value={redmineId}
                        onChange={(value) => this.setState({ redmineId: value })} />
                </div>
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={this.onSubmit} disabled={!this.isValid}>
                        Submit
                    </button>
                    <button className='btn btn-red' onClick={() => this.onClose()}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    render()
    {
        const { isShowConfirmBox, selectedSystem, systemList, isShow, redmineId } = this.state;

        return (
        <div> 
            <button className="btn btn-green" onClick={this.onClick}>Activate New System</button>
            <ConfirmBox isShow={isShowConfirmBox}
                        title='Confirmation'
                        message='Do you want to activate this system?'
                        style={{ height: '150px', width: '400px' }}
                        onClose={this.onConfirm} /> 
            <Popup isShow={isShow}
                title='New System'
                content={this._buildContent(selectedSystem, systemList, redmineId)}
                style={{height: '325px', width: '600px'}}
                onClose={() => this.onClose()} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, getSystemList }, dispatch);
}
function mapStateToProps(state) {
    const { licensee } = state;
    return { licensee };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivateNewSystemForm);