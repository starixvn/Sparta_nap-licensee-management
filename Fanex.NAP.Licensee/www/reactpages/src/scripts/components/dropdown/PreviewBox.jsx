import React from 'react';
import { useDropdownContext } from './store/DropdownContext';

const PreviewBox = props => {
    const { value, toggleExpand } = useDropdownContext();

    const { placeHolder } = props;
    
    let selectedItem;
    if (value) {
        selectedItem = <span>{value.label}</span>;
    } else if (placeHolder) {
        selectedItem = <span className="placeholder">{placeHolder}</span>;
    } else {
        selectedItem = <span style={{ opacity: 0 }}>No Value</span>;
    }

    return (
        <button type="button" className="btn dropdown__preview" onClick={toggleExpand}>
            {selectedItem}
            <span className="caret pull-right"></span>
        </button>
    );
};

export default PreviewBox;