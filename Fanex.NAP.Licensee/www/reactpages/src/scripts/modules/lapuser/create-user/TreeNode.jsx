import React, { Component } from 'react';

export default class TreeNode extends Component {
    getNodeLabel = (node) => node.DisplayKey

    render() {
        const { index, node, parent, getChildNodes, level, onNodeSelect, onNodeCheck, onRadioCheck, isSubChild } = this.props;

        return (
            <React.Fragment>
                <div level={level} className={"node"} style={{ marginLeft: (level.length - 1) * 20 }}>
                    {getChildNodes(node).length > 0 ? node.isOpen == true ?
                        <div><i className='glyphicon glyphicon-chevron-down' onClick={() => onNodeSelect(index, level)}></i></div>
                        : <div><i className='glyphicon glyphicon-chevron-right' onClick={() => onNodeSelect(index, level)}></i></div>
                        : <div><i className='glyphicon'></i></div>
                    }
                    {
                        parent && parent.InputBoxType === "radio" ?
                            <span>
                                <input type="radio"
                                    checked={node.isCheck == true ? true : false}
                                    onChange={() => onRadioCheck(parent, index, level)}>
                                </input>
                            </span>
                            :
                            <span>
                                <input type="checkbox"
                                    checked={node.isCheck == true ? true : false}
                                    onChange={() => onNodeCheck(node, index, level, isSubChild)}>
                                </input>
                            </span>
                    }
                    <span role="button" onClick={() => onNodeSelect(index, level)}>
                        {this.getNodeLabel(node)}
                    </span>
                </div>

                {(node.isOpen == true) && getChildNodes(node).map((childNode, i) => (
                    <TreeNode
                        {...this.props}
                        key={i}
                        parent={node}
                        isSubChild={parent && node.SubFunctionKeys != null}
                        index={i}
                        node={childNode}
                        level={node.level.concat(i)}
                    />
                ))}
            </React.Fragment>
        );
    }
}
