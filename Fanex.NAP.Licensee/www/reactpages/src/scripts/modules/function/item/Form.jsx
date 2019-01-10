import React, { Component } from 'react';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';
import Select from 'react-select';
import Utility from '../../../lib/utility';
import NumericInput from '../../../components/NumericInput';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SelectedParent: defaultState.selectedParent ? Object.assign({}, defaultState.selectedParent) : null,
            FunctionId: defaultState.function.FunctionId,
            Name: defaultState.function.Name || '',           
            FunctionKey: defaultState.function.FunctionKey || '',
            Description: defaultState.function.Description || '',
            Url: defaultState.function.Url || '',
            IsMenu: defaultState.function.IsMenu,
            IsActive: defaultState.function.IsActive,
            DisplayOrder: defaultState.function.DisplayOrder,
            IsNew: defaultState.function.IsNew,
            IsFunction: defaultState.function.IsFunction,
            Environment: defaultState.function.Environment || '',
            RedmineId: '',
            IsLoading: false
        };
    }

    get isValid() {
        const { Name, FunctionKey, RedmineId} = this.state;

        return Name && FunctionKey && RedmineId;
    }

    _getParams() {
        return {
            FunctionId: this.state.FunctionId,
            Name: this.state.Name,
            Description: this.state.Description,
            ParentId: this.state.SelectedParent === null ? 0 : this.state.SelectedParent.value,
            Url: this.state.Url,
            IsMenu: this.state.IsMenu,
            IsActive: this.state.IsActive,
            DisplayOrder: this.state.DisplayOrder,
            IsNew: this.state.IsNew,
            FunctionKey: this.state.FunctionKey,
            Environment: this.state.Environment,
            IsFunction: this.state.IsFunction,
            RedmineId: this.state.RedmineId
        };
    }

    onSubmit = () => {
        if (this.isValid) {
            const param = this._getParams();

            this._submit(param);
        }
        else {
            Utility.showMessage('Invalid input!');
        }
    }

    _submit(params) {
        this._toggleLoader(true);
        const url = params.FunctionId === 0 ? 'ManageLrfFunction/Add' : 'ManageLrfFunction/Edit';
        Site.fetchData(params, url)
            .then(response => {                
                if (response.data.IsSuccess) {
                    if (params.FunctionId === 0) {
                        Utility.showMessage('Function Id: ' + response.data.Data.FunctionId);
                    }
                    else {
                        Utility.showMessage('Success!');
                    }
                }
                else {
                    Utility.showMessage(response.data.Error);
                }

                if (response.data.Data) {
                    this.setState({ ...response.data.Data });
                }

                this._toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please try again!');
                this._toggleLoader(false);
            });
    }

    _toggleLoader(isLoading) {
        this.setState({ IsLoading: isLoading });
    }

    render() {
        const { SelectedParent, FunctionId, Name, FunctionKey, IsMenu, IsFunction, Description, 
            Url, IsNew, IsActive, DisplayOrder, Environment, RedmineId, IsLoading } = this.state;

        return (
            <div className='edit-form'>
                <Loader isLoading={IsLoading} />
                <div className='row'>
                    <div className='col-xs-12'>
                        {
                            FunctionId > 0 &&
                            <div className='form-group row'>
                                <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Id</label>
                                <div className='col-sm-12 col-md-5'>
                                {FunctionId}
                                </div>
                            </div>
                        }
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Name</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='text' 
                                    value={Name}
                                    maxLength='100'
                                    className={`full-width ${Name ? '' : 'has-error'}`}
                                    onChange={(e) => this.setState({ Name: e.target.value })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Function Key</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='text'
                                    value={FunctionKey}
                                    maxLength='100'
                                    className={`full-width ${FunctionKey ? '' : 'has-error'}`}
                                    onChange={(e) => this.setState({ FunctionKey: e.target.value })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Type</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='checkbox'
                                    id='Menu'
                                    checked={IsMenu}
                                    onChange={(e) => this.setState({ IsMenu: e.target.checked })} />
                                <label htmlFor='Menu' className='optional-label'>Menu</label>
                                <input type='checkbox'
                                    id='Function'
                                    checked={IsFunction}
                                    onChange={(e) => this.setState({ IsFunction: e.target.checked })} />
                                <label htmlFor='Function' className='optional-label'>Function</label>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Description</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='text'
                                    className='full-width'
                                    value={Description}
                                    onChange={(e) => this.setState({ Description: e.target.value })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Url</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='text'
                                    maxLength='200'
                                    className='full-width'
                                    value={Url}
                                    onChange={(e) => this.setState({ Url: e.target.value })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Status</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='checkbox'
                                    id='New'
                                    checked={IsNew}
                                    onChange={(e) => this.setState({ IsNew: e.target.checked })} />
                                <label htmlFor='New' className='optional-label'>New</label>
                                <input type='checkbox'
                                    id='Active'
                                    checked={IsActive}
                                    onChange={(e) => this.setState({ IsActive: e.target.checked })} />
                                <label htmlFor='Active' className='optional-label'>Active</label>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Parent</label>
                            <div className='col-sm-12 col-md-5'>
                                <Select instanceId='ddlParent'
                                    className='full-width'
                                    value={SelectedParent}
                                    options={defaultState.parentFunctionList}
                                    onChange={(item) => this.setState({ SelectedParent: item })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Display Order</label>
                            <div className='col-sm-12 col-md-5'>
                                <NumericInput
                                    className='full-width'
                                    value={DisplayOrder}
                                    onChange={(value) => this.setState({ DisplayOrder: value })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Environment</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='radio'
                                    id='UAT'
                                    value='UAT'
                                    name='Environment'
                                    checked={Environment === 'UAT'}
                                    onChange={(e) => this.setState({ Environment: e.target.value })} />
                                <label htmlFor='UAT' className='optional-label'>UAT</label>
                                <input type='radio'
                                    id='LIVE'
                                    value='LIVE'
                                    name='Environment'
                                    checked={Environment === 'LIVE'}
                                    onChange={(e) => this.setState({ Environment: e.target.value })} />
                                <label htmlFor='LIVE' className='optional-label'>LIVE</label>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Redmine Id</label>
                            <div className='col-sm-12 col-md-5'>
                                <NumericInput value={RedmineId}
                                    className={`full-width ${RedmineId ? '' : 'has-error'}`}
                                    onChange={(value) => this.setState({ RedmineId: value })} />
                            </div>
                        </div>
                        <div className='form-group row col-sm-12'>
                            <button className='btn btn-primary' onClick={this.onSubmit} disabled={!this.isValid}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
}
}