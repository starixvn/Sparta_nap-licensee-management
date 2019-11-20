import React, { Component } from 'react';
import { language } from '../language'

export default class TreeNode extends Component {
    constructor(props) {
        super(props);
    }

    getNodeLabel = (node) => {
        return language[node.DisplayKey] ? language[node.DisplayKey] : node.DisplayKey
    }

    render() {
        const { node, parent, level, getChildNodes, isSubChild, isDisable , onNodeSelect, onNodeCheck, onRadioCheck } = this.props;

        if(!parent && getChildNodes(node).length === 0)
        {
            return (null);
        }

        return (
            <React.Fragment>
                <div level={level} className={"node"} style={{ marginLeft: (level.length - 1) * 20 }}>
                    {getChildNodes(node).length > 0 ? node.isOpen == true ?
                        <div><i className='glyphicon glyphicon-chevron-down' onClick={() => onNodeSelect(node, level)}></i></div>
                        : <div><i className='glyphicon glyphicon-chevron-right' onClick={() => onNodeSelect(node, level)}></i></div>
                        : <div><i className='glyphicon'></i></div>
                    }
                    {
                        parent && parent.InputBoxType === "radio" ?
                            <span>
                                <input type="radio"
                                    disabled={isDisable}
                                    checked={node.isCheck == true ? true : false}
                                    onChange={() => onRadioCheck(parent, node)}>
                                </input>
                            </span>
                            :
                            <span>
                                <input type="checkbox"
                                    disabled={isDisable}
                                    checked={node.isCheck == true ? true : false}
                                    onChange={() => onNodeCheck(node, parent, isSubChild)}>
                                </input>
                            </span>
                    }
                    <span role="button" onClick={() => onNodeSelect(node, level)}>
                        {this.getNodeLabel(node)}
                    </span>
                </div>

                {(node.isOpen == true) && getChildNodes(node).map((childNode, i) => (
                    <TreeNode
                        {...this.props}
                        key={i}
                        parent={node}
                        isSubChild={node && node.SubFunctionKeys != null}
                        node={childNode}
                        level={level.concat(i)}
                    />
                ))}
            </React.Fragment>
        );
    }
}
