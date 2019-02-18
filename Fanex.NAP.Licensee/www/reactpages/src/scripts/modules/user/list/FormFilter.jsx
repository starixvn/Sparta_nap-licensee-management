import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setParams } from './action';

export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.params = {
            userName: '',
            isClosed: ''
        }
    }

    onInputChange = (e) => {
        const target = e.target;
        const name = target.name;

        this.params[name] = target.value;
    }

    onCheck = (e) => {
        const target = e.target;
        const name = target.name;

        this.params[name] = target.checked;
    }

    onKeyPress = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            
            this._submit();
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _submit() {
        const params = {
            UserName: this.params.userName,
            IsClosed: this.params.isClosed,
            PageIndex: 1,
            PageSize: this.props.params.PageSize || 20,
            TimeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    render() {
        return (
        <div className="col-xs-12 form-inline filter-form">
                <div className="form-group">
                    <label>User Name</label>
                    <input type="text" maxLength='50' name='userName' onChange={this.onInputChange} onKeyPress={this.onKeyPress} />
                </div>

            <div className="form-group">
                <label className="checkbox-inline">           
                    <input type="checkbox" name='isClosed' onChange={this.onCheck} />
                    Close
                </label>
            </div>

            <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
            </div>
        </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParams }, dispatch);
}
function mapStateToProps(state) {
    const { params } = state;
    return { params };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);