import React from 'react';
import ReactDOM from 'react-dom';
import Title from './Title';
import Content from './Content';

export default class CollapsiblePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: props.collapsed === undefined ? true : props.collapsed
        }
    };

    render() {
        const { collapsed } = this.state;

        return (
            <div className={`collapsible-panel ${collapsed ? 'collapsed' : ''}`}>
                <div className='collapsible-panel-title' onClick={() => this.setState((state) => ({ collapsed: !state.collapsed })) }>
                {
                    this.props.children.map(x => {
                        if (x.type.name === Title.name)
                            return x;
                    })
                }
                </div>
                <div className='collapsible-panel-content'>
                    {
                        this.props.children.map(x => {
                            if (x.type.name === Content.name)
                                return x;
                        })
                    }
                </div>
            </div>
        )
    }
};