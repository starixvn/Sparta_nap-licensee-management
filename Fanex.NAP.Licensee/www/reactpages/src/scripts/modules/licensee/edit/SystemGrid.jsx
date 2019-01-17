﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from './action';

export class SystemGrid extends Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.systemList !== this.props.systemList) {
            this.props.toggleLoader(false);
        }
    }

    render() {
        const { systemList, licensee } = this.props;

        return (
            <div>
                <div className='row'>
                    <div className='col-xs-12'>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>System Name</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                systemList.map((item, index) => {
                                    return (
                                        <tr key={item.Id}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{item.SystemName}</td>
                                            <td>{item.Description}</td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { systemList, licensee } = state;
    return { systemList, licensee };
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemGrid);