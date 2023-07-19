import React, { useState } from 'react';
import SearchBox from './SearchBox';
import { useDropdownContext } from './store/DropdownContext';

const ContentBox = props => {
    const [searchKey, setSearchKey] = useState('');
    const { isExpand, toggleExpand } = useDropdownContext();
    if (!isExpand) {
        return null;
    }

    const { options, onChange } = props;

    const displayData = options.filter(item => item.label.toLowerCase().includes(searchKey.toLowerCase()));

    return (
        <div className="dropdown__content">
            <SearchBox searchKey={searchKey} onKeyChange={setSearchKey}></SearchBox>
            <div className="dropdown__options">
                {displayData.map(item => (
                    <div
                        key={item.value}
                        onClick={() => {
                            onChange(item);
                            toggleExpand();
                        }}>
                        <span className="dropdown__option-item">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentBox;