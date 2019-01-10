import React from 'react';
import ReactDOM from 'react-dom';

export default class NumericInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = { value: props.value === null ? '' : props.value };
    };

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    onChange(e, callback) {
        const value = e.target.value;

        if ((value.length <= 10 && /^\d+$/.test(value)) || value === '') {
            callback && callback(e.target.value);
        }
    }

    render() {
        const { className, onChange } = this.props;
        const { value } = this.state;

        return <input className={className}
                        type='text'
                        maxLength='10'
                        value={value}
                        onChange={(e) => this.onChange(e, onChange)} />
    }
};