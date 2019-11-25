import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setSelectedFuncs } from './action'
import React, { Component } from 'react';
import TreeNode from './TreeNode';

class Tree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nodes: props.nodes
        };
    }

    _onNodeSelect = (node, level) => {
        const { nodes } = this.state;

        node.isOpen = !node.isOpen;
        node.level = level

        this.setState({ nodes });
    }

    _onNodeCheck = (node, parent, isSubChild) => {
        const { nodes } = this.state;

        this._checkedChildNode(node, !node.isCheck, isSubChild);
        this._checkedParentNode(parent, node.isCheck);

        this.setState({ nodes });
    }

    _onRadioCheck = (parent, node) => {
        const { nodes } = this.state;

        this._checkedRadioNode(parent, node);
        this._checkedParentNode(parent, true);

        this.setState({ nodes });
    }

    _getChildNodes(node) {
        if (!node.Settings) {
            if (!node.FunctionKeys) {
                if (!node.SubFunctionKeys) {
                    return [];
                }
                return node.SubFunctionKeys;
            }
            return node.FunctionKeys;
        }
        else{
            return node.Settings.filter(funs => funs.Type != 0);
        }
    }

    _getParentNode(level) {
        const parentNodeLevel = level.splice(0, level.length - 1);
        const parentNodeIndex = parentNodeLevel[parentNodeLevel.length - 1];

        return this._getNodeInState(parentNodeIndex, parentNodeLevel);
    }

    _getNodeInState(index, level) {
        const { nodes } = this.state;
        let node = [];

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
        const { selectedFunc } = this.props;

        if (node.FunctionKey != null && !isSubChild) {
            let result = selectedFunc.find(n => n.FunctionKey === node.FunctionKey)
            if (node.isCheck === true && !node.Settings) {
                if (result == null) {
                    selectedFunc.push(node);
                }
            }
            else if (result != null) {
                selectedFunc.splice(selectedFunc.indexOf(result), 1);
            }
        }

        this.props.setSelectedFuncs(selectedFunc);
    }

    _checkedRadioNode(parent, node) {
        const { nodes } = this.state;
        const children = this._getChildNodes(parent);

        node.isCheck = true;

        children.forEach(child => {
            if (child.FunctionKey != node.FunctionKey) {
                child.isCheck = false;
            }
        })

        this.setState({ nodes });
    }

    _checkedParentNode(parent) {
        if (parent) {
            let flag = false;
            this._getChildNodes(parent).forEach(child => {
                if (child.isCheck == true) {
                    flag = true;
                }
            })

            parent.isCheck = flag;
            if (flag == true) {
                this._addNodeIntoSelectedFunc(parent, false);
            }

            const parentLevel = [...parent.level];
            const parentNode = this._getParentNode(parentLevel);
            if (parentNode.length != 0) {
                this._checkedParentNode(parentNode)
            }
        }
    }

    _checkedChildNode(node, checked, isSubChild) {
        node.isCheck = checked;

        this._addNodeIntoSelectedFunc(node, isSubChild);

        const children = this._getChildNodes(node);
        if (children.length != 0) {
            if (node.InputBoxType === "radio" && checked == true) {
                this._checkedChildNode(children[0], node.isCheck, true)
            }
            else {
                children.forEach(child => {
                    const hasSubChild = (node.SubFunctionKeys != null)
                    this._checkedChildNode(child, node.isCheck, hasSubChild)
                })
            }
        }
    }

    render() {
        const { nodes } = this.state;

        return (
            <div>
                {nodes.map((node, i) => (
                    <TreeNode
                        key={i}
                        level={JSON.parse("[" + i + "]")}
                        node={node}
                        parent={null}
                        isDisable={this.props.isDisable}
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