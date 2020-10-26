import React, { Component } from 'react';

export class HeaderTitle extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <thead>
                <tr>
                    <th colSpan={this.props.cols} style={{ textAlign: 'left' }}>{this.props.title}</th>
                </tr>
            </thead>
        );
    }
}

export default HeaderTitle;