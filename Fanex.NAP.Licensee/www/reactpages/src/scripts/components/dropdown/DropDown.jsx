import React, { useState, useRef, useEffect } from 'react';
import Provider from './store/DropdownContext';
import PreviewBox from './PreviewBox';
import ContentBox from './ContentBox';

const DropDown = props => {
    const { className, value, options, onChange, placeHolder } = props;
    const [isExpand, setIsExpand] = useState(false);
    const componentRef = useRef(null);

    const handleClickOutside = event => {
        if (componentRef.current && !componentRef.current.contains(event.target)) {
            setIsExpand(false);
        }
    };

    useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        },
        []);

    const toggleExpand = () => setIsExpand(!isExpand);

    const context = {
        value,
        isExpand,
        toggleExpand
    };
    
    return (
        <Provider value={context}>
            <div ref={componentRef} className={`dropdown ${className}`}>
                <PreviewBox placeHolder={placeHolder}></PreviewBox>
                <ContentBox
                    options={options}
                    value={value}
                    onChange={onChange}>
                </ContentBox>
            </div>
        </Provider>
    );
};

export default DropDown;