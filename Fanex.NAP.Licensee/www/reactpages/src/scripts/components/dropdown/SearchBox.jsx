import React from 'react';

const SearchBox = props => {
    const { searchKey, onKeyChange } = props;

    const onChange = e => {
        onKeyChange(e.target.value);
    };

    const emptyKeys = () => onKeyChange('');
    return (
        <div className="dropdown__search-container">
            <input
                type="text"
                placeholder="Search"
                autoFocus
                value={searchKey}
                onChange={onChange}>
            </input>
            <span
                className="searchclear glyphicon glyphicon-remove-circle"
                onClick={emptyKeys}>
            </span>
        </div>
    );
};

export default SearchBox;