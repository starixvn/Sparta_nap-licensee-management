import React, { Component } from 'react'

export default class IgnoredFunctionToggleable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            IgnoredFunctions: JSON.parse(this.props.functionList)
        }
    }

    toggleFunctionList = (event) => {
        event.preventDefault();

        this.setState({ show: !this.state.show });
    }

    render() {
        const { IgnoredFunctions, show } = this.state;
        return (
            <div className="ignored-function">
                <a href="javascript:;" title={`Click to ${show ? "collapse" : "expand"}`}
                    onClick={this.toggleFunctionList} style={{marginLeft: 10, display: "inline-block"}}>
                    <i class={show ? "icon-collapse" : "icon-expand"}></i> [{IgnoredFunctions.length} Function(s)]
                </a>

                <ul style={{ display: show ? "block" : "none" }}>
                    {
                        IgnoredFunctions.map((item, index) => {
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