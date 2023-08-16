import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setSelectedFuncs, setIsCheckGroup } from './action'
import React, { Component } from 'react';
import TreeNode from './TreeNode';

class Tree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nodes: props.nodes,
            selectedNode: props.selectedNode ? props.selectedNode : [],
            isSelectedAllNode: false,
            isSelectedAllMode: props.selectAllNode,
            defaultSelectedNode: props.defaultSelectedNode ? props.defaultSelectedNode : []
        };
    }

    _onNodeSelect = (node, level) => {
        const { nodes } = this.state;

        node.isOpen = !node.isOpen;
        node.level = level;

        this.setState({ nodes });
    }

    _onNodeCheck = (node, parent, isSubChild) => {
        const { nodes } = this.state;

        this._checkedChildNode(node, !node.isCheck, isSubChild);
        if (parent) {
            this._checkedParentNode(parent);
        }

        this.setState({ nodes });
    }

    _onRadioCheck = (parent, node) => {
        if (parent.isDisable) {
            return;
        }

        const { nodes } = this.state;

        this._checkedRadioNode(parent, node);
        if (parent) {
            this._checkedParentNode(parent);
        }

        this.setState({ nodes });
    }

    _onNodeSelectAll(isCheckedAll) {
        const { nodes } = this.state;

        nodes.forEach(node => {
            this._checkAllChildNode(node, isCheckedAll, false);
        });

        this.setState({ isSelectedAllNode: isCheckedAll });
    }

    _checkAllChildNode(node, checked, isSubChild) {
        const children = this._getChildNodes(node);
        if (node.isDisable) {
            if (children.length && node.InputBoxType === 'radio') {
                return;
            }

            children.forEach(child => {
                const hasSubChild = (node.SubFunctionKeys != null);
                this._checkAllChildNode(child, checked, hasSubChild);
            });

            return;
        }

        node.isCheck = checked;

        this._addNodeIntoSelectedFunc(node, isSubChild);

        if (!children.length) {
            return;
        }

        if (node.InputBoxType === 'radio') {
            children.forEach(radioNode => this._checkAllChildNode(radioNode, false, false));

            children[0].isCheck = checked;
            this._addNodeIntoSelectedFunc(node, isSubChild);
            return;
        }

        children.forEach(child => {
            const hasSubChild = (node.SubFunctionKeys != null);
            this._checkAllChildNode(child, node.isCheck, hasSubChild);
        });
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
        return node.Settings; 
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
            node = node.FunctionKeys[index];
        }

        else if (node.SubFunctionKeys) {
            node = node.SubFunctionKeys[index];
        }

        return node;
    }

    _addNodeIntoSelectedFunc(node, isSubChild) {
        const { selectedFunc } = this.props;

        if (node.FunctionKey != null && !isSubChild) {
            let result = selectedFunc.find(n => n.FunctionKey === node.FunctionKey);
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
        });

        this.setState({ nodes });
    }

    _checkedParentNode(parent) {
        let isChildrenChecked = false;
        this._getChildNodes(parent)
            .forEach(child => {
                if (child.isCheck) {
                    isChildrenChecked = true;
                }
            });

        parent.isCheck = isChildrenChecked;
        if (isChildrenChecked) {
            this._addNodeIntoSelectedFunc(parent, false);
        }

        const parentLevel = [...parent.level];
        const parentNode = this._getParentNode(parentLevel);
        if (parentNode.length) {
            this._checkedParentNode(parentNode);
        }
    }

    _checkedChildNode(node, checked, isSubChild) {
        node.isCheck = checked;

        this._addNodeIntoSelectedFunc(node, isSubChild);

        const children = this._getChildNodes(node);
        if (children.length != 0) {
            if (node.InputBoxType === "radio" && checked == true) {
                this._checkedChildNode(children[0], node.isCheck, true);
            }
            else {
                children.forEach(child => {
                    const hasSubChild = (node.SubFunctionKeys != null);
                    this._checkedChildNode(child, node.isCheck, hasSubChild);
                });
            }
        }
    }

    _prepareListNodes() {
        const { nodes } = this.state;
    
        nodes.map(node => {
            this._checkedNodeInStateIfExistInSelectedNode(node, null);
            this._checkedNodeInStateIfExistInDefaultSelectedNode(node, null, this.props.isCheckGroup);
        })

        return nodes;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.isCheckGroup != this.props.isCheckGroup){
            const { nodes } = this.state;

            nodes.map(node => {
                this._checkedNodeInStateIfExistInDefaultSelectedNode(node, null, nextProps.isCheckGroup);
            });
    
            return nodes;
        }
    }

    componentDidMount() {
        this._prepareListNodes();
    }

    _checkedNodeInStateIfExistInSelectedNode(node, parent) {
        const { selectedNode } = this.state;
        const children = this._getChildNodes(node);

        selectedNode.map((selNode) => {

            if (selNode.FunctionKey !== node.FunctionKey) {
                return;
            }

            node.isCheck = true;
            if (parent) {
                parent.isCheck = true;
            }

            this._addNodeIntoSelectedFunc(node, false);

            if (selNode.SubFunctionKeys && node.SubFunctionKeys) {
                selNode.SubFunctionKeys.map(selSubNode => {
                    node.SubFunctionKeys.map(nodeSub => {
                        if (selSubNode.FunctionKey === nodeSub.FunctionKey) {
                            nodeSub.isCheck = true;
                        }
                    });
                });
            }
        });

        if (children && node.InputBoxType !== 'radio') {
            children.map(child => this._checkedNodeInStateIfExistInSelectedNode(child, node));
        }

        this.setState({ selectedNode });
    }

    _checkedNodeInStateIfExistInDefaultSelectedNode(node, parent, isCheck) {
        const { defaultSelectedNode } = this.state;
        const children = this._getChildNodes(node);

        defaultSelectedNode.map((selNode) => {
            if (selNode.FunctionKey !== node.FunctionKey) {
                return;
            }

            node.isCheck = true;
            node.isDisable = isCheck;

            if (parent) {
                parent.isCheck = true;
                parent.isDisable = isCheck;
            }

            this._addNodeIntoSelectedFunc(node, false);

            if (selNode.SubFunctionKeys && node.SubFunctionKeys) {
                if (node.InputBoxType === 'radio') {
                    node.SubFunctionKeys.map(nodeSub => {
                        nodeSub.isCheck = false;
                    });
                }

                selNode.SubFunctionKeys.map(selSubNode => {
                    node.SubFunctionKeys.map(nodeSub => {
                        if (selSubNode.FunctionKey === nodeSub.FunctionKey) {
                            nodeSub.isCheck = true;
                            nodeSub.isDisable = isCheck;
                        }
                    });
                });
            }
        });

        if (children && node.InputBoxType !== 'radio') {
            children.map(child => this._checkedNodeInStateIfExistInDefaultSelectedNode(child, node, isCheck));
        }

        this.setState({ defaultSelectedNode });
    }


    _renderSelectAllNode(selectedAllMode) {
        const { isSelectedAllNode } = this.state;
        return selectedAllMode &&
            <div className="node">
                <div>
                    <i className="glyphicon" style={{ opacity: 0 }}></i>
                </div>
                <span>
                    <input
                        type="checkbox"
                        checked={isSelectedAllNode}
                        disabled={this.props.isDisableAll}
                        onChange={() => this._onNodeSelectAll(!isSelectedAllNode)} />
                </span>
                <span role="button" onClick={() => this._onNodeSelectAll(!isSelectedAllNode)}>
                    Select All
                </span>
            </div>;
    }

    render() {
        const { nodes, isSelectedAllMode } = this.state;

        return (
            <div>
                {this._renderSelectAllNode(isSelectedAllMode)}
                {nodes.map((node, i) => (
                    <TreeNode
                        key={i}
                        level={JSON.parse("[" + i + "]")}
                        node={node}
                        parent={null}
                        isDisableAll={this.props.isDisableAll}
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
    return bindActionCreators({ setSelectedFuncs, setIsCheckGroup }, dispatch);
}
function mapStateToProps(state) {
    const { selectedFunc, isCheckGroup } = state;
    return { selectedFunc, isCheckGroup };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tree);