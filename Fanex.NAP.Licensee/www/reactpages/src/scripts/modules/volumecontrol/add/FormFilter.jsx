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

    componentDidMount() {
        this._submit();
    }

    _monthPickerHandle = async (item) => {
        if (item === null) {
            await this.setState({ selectedMonth: defaultDateConstraint.currentDate });
        }
        else {
            await this.setState({ selectedMonth: item.fromDate });
        }
        this._submit();
    }

    _handleSiteNameChange = async (item) => {
        if (item === null) {
            await this.setState({ selectedBrandCode: defaultState.selectedBrandCode });
        }
        else {
            await this.setState({ selectedBrandCode: item.value });
        }
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
                        onChange={this._handleSiteNameChange} 
                    />
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
                    <label>Win Loss</label>
                    <input type="text" className="text-right" maxLength='50' name='winLoss' value={this.props.totalWinLoss.toLocaleString('en', {maximumFractionDigits: 2, minimumFractionDigits: 2})} disabled={true} style={{width: '180px'}}/><span> USD</span>
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