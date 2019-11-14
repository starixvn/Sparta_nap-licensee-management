import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setSelectedFuncs } from './action'
import React, { Component } from 'react';
import TreeNode from './TreeNode';

class Tree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nodes: props.nodes,
            selectedFunc: props.selectedFunc
        };
    }

    _onNodeSelect = (index, level) => {
        const { nodes } = this.state;

        let node = this._getNodeInState(index, level, nodes);
        node.isOpen = !node.isOpen;
        node.level = level

        this.setState({ nodes });
    }

    _onNodeCheck = (node, index, level, isSubChild) => {
        this._checkedChildNode(index, level, !node.isCheck, isSubChild);
        this._checkedParentNode(index, level, node.isCheck, isSubChild);

        this.props.setSelectedFuncs(this.state.selectedFunc);
    }

    _onRadioCheck = (parent, index, level) => {
        this._checkRadio(parent, index, level);
        this._checkedParentNode(index, level, true, true);

        this.props.setSelectedFuncs(this.state.selectedFunc);
    }

    _getChildNodes = (node) => {
        if (!node.Settings) {
            if (!node.FunctionKeys) {
                if (!node.SubFunctionKeys) {
                    return [];
                }
                return node.SubFunctionKeys;
            }
            return node.FunctionKeys
        }
        return node.Settings;
    }
    
    _getNodeInState(index, level, nodes) {
        let node = {};

        if (level.length == 1) {
            return nodes[index];
        }

        if (level.length == 2) {
            return nodes[level[0]].Settings[index];
        }

        if (level.length == 3) {
            node = nodes[level[0]].Settings[level[1]];
        }

        if (level.length == 4) {
            node = nodes[level[0]].Settings[level[1]].FunctionKeys[level[2]];
        }

        if (level.length == 5) {
            node = nodes[level[0]].Settings[level[1]].FunctionKeys[level[2]].FunctionKeys[level[3]];
        }

        if (node.FunctionKeys) {
            node = node.FunctionKeys[index]
        }

        else if (node.SubFunctionKeys) {
            node = node.SubFunctionKeys[index]
        }

        return node;
    }

    _addNodeIntoSelectedFunc(node, isSubChild) {
        const { selectedFunc } = this.state;

        if (node.FunctionKey != null && !isSubChild) {
            let result = selectedFunc.find(n => n.FunctionKey === node.FunctionKey)
            if (node.isCheck === true) {
                if (result == null) {
                    selectedFunc.push(node);
                }
            }
            else if (result != null) {
                selectedFunc.splice(selectedFunc.indexOf(result), 1);
            }
        }

        this.setState({ selectedFunc });
    }

    _checkRadio(parent, index, level) {
        const { nodes } = this.state;
        
        let node = this._getNodeInState(index, level, nodes);
        node.isCheck = true;

        let childNodes = this._getChildNodes(parent);
        childNodes.forEach((c, i) => {
            let child = this._getNodeInState(i, parent.level.concat(i), nodes);
            if (child.FunctionKey != node.FunctionKey) {
                child.isCheck = false;
            }
        })

        this.setState({ nodes });
    }

    _checkedParentNode(index, level, checked, isSubChild) {
        const { nodes } = this.state;
        
        let node = this._getNodeInState(index, level, nodes);
        node.isCheck = checked;

        this._addNodeIntoSelectedFunc(node, isSubChild);

        if (level.length >= 2) {
            let flag = false;
            const parentNodeLevel = level.splice(0, level.length - 1);
            const parentNodeIndex = parentNodeLevel[parentNodeLevel.length - 1];
            const parentNode = this._getNodeInState(parentNodeIndex, parentNodeLevel, nodes);

            this._getChildNodes(parentNode).forEach(c => {
                if (c.isCheck === true) {
                    flag = true;
                }
            })

            level.forEach(i => {
                this._checkedParentNode(parentNodeIndex, parentNodeLevel, flag, false)
            })
        }

        this.setState({ nodes });
    }

    _checkedChildNode(index, level, checked, isSubChild) {
        const { nodes } = this.state;
        
        let node = this._getNodeInState(index, level, nodes);
        node.isCheck = checked;

        this._addNodeIntoSelectedFunc(node, isSubChild);

        const childNodes = this._getChildNodes(node);
        if (childNodes.length != 0) {
            if (node.InputBoxType === "radio" && checked == true) {
                this._checkedChildNode(0, level.concat(0), node.isCheck, true)

            }
            else {
                childNodes.forEach((c, i) => {
                    const hasSubChild = (node.SubFunctionKeys != null)
                    this._checkedChildNode(i, level.concat(i), node.isCheck, hasSubChild)
                })
            }
        }

        this.setState({ nodes });
    }

    render() {
        const { nodes } = this.state;

        return (
            <div>
                {nodes.map((node, i) => (
                    <TreeNode
                        key={i}
                        index={i}
                        level={JSON.parse("[" + i + "]")}
                        node={node}
                        parent={null}
                        isSubChild={false}
                        getChildNodes={this._getChildNodes}
                        onNodeSelect={this._onNodeSelect}
                        onNodeCheck={this._onNodeCheck}
                        onRadioCheck={this._onRadioCheck}
                    />
                ))}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setSelectedFuncs }, dispatch);
}
function mapStateToProps(state) {
    const { selectedFunc } = state;
    return { selectedFunc };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tree);