import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setParams } from './action';
import Select from 'react-select';
import MonthPicker from '../../../components/month-picker/index';

const defaultState = Object.assign({}, window.initialState);
const defaultDateConstraint = Object.assign({}, window.dateConstraint);

export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedBrandCode: defaultState.selectedBrandCode,
            selectedMonth: defaultDateConstraint.currentDate
        }
    }

    _monthPickerHandle = (item) => {
        if (item === null) {
            this.setState({ selectedMonth: defaultDateConstraint.currentDate });
        }
        else {
            this.setState({ selectedMonth: item.fromDate });
        }
    }

    _handleSiteNameChange = (item) => {
        if (item === null) {
            this.setState({ selectedBrandCode: defaultState.selectedBrandCode });
        }
        else {
            this.setState({ selectedBrandCode: item.value });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _submit() {
        const params = {
            monthDate: this.state.selectedMonth,
            brandCode: this.state.selectedBrandCode,
            TimeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    render() {
        const monthOption = {
            label: ''
        };

        const { selectedBrandCode } = this.state;

        return (
        <div className="col-xs-12 form-inline filter-form">
            <div className="form-group">
                <label>Site</label>
                <Select instanceId="ddlSiteName"
                        value={selectedBrandCode}
                        options={defaultState.siteNameList}
                        onChange={this._handleSiteNameChange} />
            </div>

            <div className="form-group">
                <label>Month</label>
                    <MonthPicker
                        minDate={defaultDateConstraint.minDate}
                        maxDate={defaultDateConstraint.maxDate}
                        fromDate={defaultDateConstraint.currentDate}
                        toDate={defaultDateConstraint.currentDate}
                        onChange={this._monthPickerHandle}
                        monthOption={monthOption}
                        showDate={false} />
            </div>

            <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
                <a className="btn btn-green" href={window.rootUrl + 'BetTicketVolumeControl/Add'}>+ Add Setting</a>
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