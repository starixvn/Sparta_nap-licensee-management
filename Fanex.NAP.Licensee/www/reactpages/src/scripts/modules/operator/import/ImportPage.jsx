import React, { Component } from 'react';
import Select from 'react-select';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';

export default class ImportPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            file: null,
            errors: [],
            result: [],
            fileValue: ''
        };
    }

    _toggleLoader(isLoading) {
        this.setState({ isLoading: isLoading });
    }

    _handleUploadFile = (e) => {
        if (e.target.files.length > 0) {
            this.setState({ file: e.target.files[0], result: [], fileValue: e.target.value });
        }
        else {
            this.setState({ file: null, result: [], fileValue: e.target.value });
        }
    }

    _handleSubmit = () => {
        const file = this.state.file;
        
        if (this._validate(file)) {
            let formData = new FormData();
            formData.append('file', file);

            this._toggleLoader(true);
            Site.fetchData(formData, "ManageOperator/ImportFile")
               .then(response => {
                   if (response.data.IsSuccess) {
                       this.setState({ errors: '', isLoading: false, result: response.data.Data ? response.data.Data : [], file: null, fileValue: '' });
                   }
                   else {
                       this.setState({ errors: response.data.Error, isLoading: false });
                   }

                   this._toggleLoader(false);
               }).catch(err => {
                   this.setState({ errors: ["Failed!"], isLoading: false });
               });
        }
    }

    _validate(file) {
        return file !== null;
    }

    _buildErrorBlock(errors) {
        return errors.map((item, index) => {
            return <p key={index}>- {item}</p>
        });
    }

    _buildResultBlock(result) {
        return <table className="table table-bordered">
                    <thead>
                        <tr>                       
                            <th>Agent ID</th>
                            <th>User Name</th>
                            <th>Site Name</th>
                            <th>Operator ID</th>
                            <th>Status</th>
                            <th>Error</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        result.map((item, index) => {
                            return (
                                <tr key={index}>                              
                                    <td>{item.AgentId}</td>
                                    <td>{item.UserName}</td>
                                    <td>{item.SiteName}</td>
                                    <td>{item.OperatorId}</td>
                                    <td className={`${item.Status} text-center`}>{item.Status}</td>
                                    <td>{item.Error}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
            </table>;
    }

    render() {
        const { isLoading, file, fileValue, errors, result } = this.state;
        return (
            <div className="import-page">
                <Loader isLoading={isLoading} />
                <div className="col-xs-12 filter-form">
                    <div className="form-group">
                        <label>Please choose file (.csv)</label>
                        <input type="file" accept=".csv" value={fileValue} className="full-width" onChange={this._handleUploadFile} />
                    </div>
                </div>
                <div style={{display: "inline-block"}}>
                    <button type="button" className="btn btn-primary" onClick={this._handleSubmit} disabled={!this._validate(file)}>
                        Import
                    </button>
                    <a href={window.rootUrl + "ManageOperator/DownLoadImportTemplate"} type="button" className="btn btn-green">
                        Download Template
                    </a>
                </div>
                <div className="help-block">             
                    { 
                        errors.length > 0 && 
                        <div className="has-error">
                            <h5>Import failed!</h5>
                            {this._buildErrorBlock(errors)}
                        </div>
                    }
                    {
                        result.length > 0 &&
                        <div>
                            <h5>Import result:</h5>
                            {this._buildResultBlock(result)}
                        </div>
                    }
                </div>
            </div>
        )
    }
}