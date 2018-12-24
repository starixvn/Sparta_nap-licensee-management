import React from 'react';
import ReactDOM from 'react-dom';

export default class Pager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageInput: props.pageIndex
        };
    };

    componentDidUpdate(prevProps, prevState) {
        const pageIndex = this.props.pageIndex;
        if (pageIndex !== prevProps.pageIndex) {
            this._updateState(pageIndex);
        }
    }

    _updateState(pageInput) {
        this.setState({ pageInput });
    }

    goToPage(index, pageSize) {
        this.props.onPaging && this.props.onPaging(index, pageSize);
    }

    onKeyUpHandle = (e, totalPage) => {
        const code = e.keyCode ? e.keyCode : e.which;
        if (code === 13) {
            var value = parseInt(this.state.pageInput);
            if (value > 0 && value <= totalPage) {
                this.goToPage(value, this.props.pageSize);
            }
        }
    }

    onClickHandle(isDisable, handleFunc) {
        if (!isDisable) {
            handleFunc();
        }
    }

    onInputChangeHandler = (e) => {
        const pattern = /^\d*$/;
        const { value } = e.target;
        const isValidNumber = pattern.test(value);
        if (isValidNumber) {
            this._updateState(value);
        }
    }

    _renderPageIcon(iconClass, isDisable, onClickFunc) {
        return (<a href='javascript:;' className={`glyphicon ${iconClass} ${isDisable ? 'disable' : ''}`} onClick={() => this.onClickHandle(isDisable, onClickFunc)}></a>);
    }

    _renderPageInput(index, totalPage) {
        return (
            <div className='page-input'>
                <span>| Page </span>
                <input type='text' value={index} maxLength='4' size='2'
                    onChange={this.onInputChangeHandler}
                    onKeyUp={(e) => this.onKeyUpHandle(e, totalPage)} />
                <span> of {totalPage} |</span>
            </div>);
    }

    _renderPageInfo(index, pageSize, totalItem) {
        const viewFrom = ((index - 1) * pageSize) + 1;
        const viewTo = index > totalItem ? index * pageSize : totalItem;
        return (
            <div className='page-info'>
                <span>View {viewFrom}-{viewTo} of {totalItem}</span>
            </div>);
    }

    _renderPageSizeSelection(isDisable, pageIndex, pageSize) {
        return (
            <select disabled={isDisable} value={pageSize} onChange={(e) => this.goToPage(1, Number(e.target.value))}>
                {this._renderPageSizeOption(this.props.pageList)}
            </select>
        );
    }

    _renderPageSizeOption(pageList) {
        return pageList.map(item => {
            return (<option key={item} value={item}>{item}</option>);
        });
    }

    render() {
        const { pageInput } = this.state;
        const { pageIndex, pageSize, totalItem, pageList } = this.props;
        const isDisable = isNaN(parseInt(pageInput));
        const totalPage = Math.ceil(totalItem / pageSize);
        const isShow = totalItem > pageList[0];

        return (
            <div className='pager' style={{ display: `${isShow ? 'block' : 'none'}` }}>
                <div className='page-container'>
                    {this._renderPageIcon('glyphicon-fast-backward', pageIndex === 1, () => this.goToPage(1, pageSize))}
                    {this._renderPageIcon('glyphicon-step-backward', isDisable || pageIndex <= 1 || pageIndex > totalPage, () => this.goToPage(pageIndex - 1, pageSize))}
                    {this._renderPageInput(pageInput, totalPage)}
                    {this._renderPageIcon('glyphicon-step-forward', isDisable || pageIndex >= totalPage || pageIndex < 1, () => this.goToPage(pageIndex + 1, pageSize))}
                    {this._renderPageIcon('glyphicon-fast-forward', pageIndex === totalPage, () => this.goToPage(totalPage, pageSize))}
                    {this._renderPageSizeSelection(isDisable, pageIndex, pageSize)}
                </div>
                {this._renderPageInfo(pageIndex, pageSize, totalItem)}
            </div>
        )
    }
};