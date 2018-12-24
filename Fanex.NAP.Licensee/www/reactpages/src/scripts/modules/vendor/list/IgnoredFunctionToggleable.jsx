import React, { Component } from 'react'

export default class IgnoredFunctionToggleable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        }
    }

    toggleFunctionList = (event) => {
        event.preventDefault();

        this.setState({ show: !this.state.show });
    }

    render() {
        const { show } = this.state;
        const { functionList } = this.props;

        return (
            <div className="ignored-function">
                <a href="javascript:;" title={`Click to ${show ? "collapse" : "expand"}`}
                    onClick={this.toggleFunctionList} style={{ marginLeft: 10, display: "inline-block" }}>
                    <i className={show ? "icon-collapse" : "icon-expand"}></i> [{functionList.length} Function(s)]
                </a>

                <ul style={{ display: show ? "block" : "none" }}>
                    {
                        functionList.map((item, index) => {
                            return (
                                <li key={`e-${index}`}>{item}</li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}