/**
 * Tree View.
 * 
 * Inspired by, but highly modified (MIT License):
 *      https://github.com/elifTech/treeview-react-bootstrap
 * or
 *      https://github.com/darwino/treeview-react-bootstrap
 */
import React from 'react'
import './TreeView.css';

let treeviewSpanStyle = {
    "width": "5px",
    "height": "5px"
};

let treeviewSpanIndentStyle = treeviewSpanStyle;
treeviewSpanIndentStyle["marginLeft"] = "2px";
treeviewSpanIndentStyle["marginRight"] = "2px";

let treeviewSpanIconStyle = treeviewSpanStyle;
treeviewSpanIconStyle["marginLeft"] = "2px";
treeviewSpanIconStyle["marginRight"] = "2px";

let nextId = 0;
export class DefaultTree {
    root(data) {
        return data;
    }
    id(data,level) {
        return (nextId++).toString();
    }
    text(data,level) {
        return data.label || data.text || data.toString();
    }
    icon(data,level) {
        return data.icon;
    }
    children(data,level) {
        return data.children;
    }
    selected(data,level) {
        return false;
    }
    expanded(data,level) {
        return level < 1;
    }
    selectable(data,level) {
        return true;
    }
    expandable(data,level) {
        return !!data.children;
    }
    linkHref(data,level) {
        return null;
    }
}

// Use for micro services specific trees
export class MicroserviceTree extends DefaultTree {
    id(data,level) {
        if(data.id) {
            return data._type + ':' + data.id;
        }
        return data._type;
    }
    text(data,level) {
        const id = data.id || data.label;
        const col = id.indexOf(":");
        return col>0 ? id.substring(col+1) : id;
    }
    selectable() {
        return false;
    }
}


class TreeView extends React.Component {

    constructor(props) {
        super(props);

        this.tree = props.tree || new DefaultTree();
        this.state = this.initState(props.data);

        // Events
        this.clicked = this.clicked.bind(this);
        this.doubleClicked = this.doubleClicked.bind(this);
        this.selectChanged = this.selectChanged.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.tree = nextProps.tree || new DefaultTree();
        // We currently only recompute the tree if the whoel dataset changes
        // We could do a 'DOM' comparison and only reinject the changes...
        // Future extension
        if(this.state.data!==nextProps.data) {
            this.setState(this.initState(nextProps.data));
        }
    }

    initState(data) {
        // Make sure that the state data is an array
        // So the tree supports both a root object and an array of roots
        let root = this.tree.root(data);
        if (!Array.isArray(root)) {
            root = [root];
        }
        return { data, nodes: this._createState(0, null, root) };
    }
    _createState(level, parentNode, children) {
        if (!children) return;
        return children.map(child => {
            const node = {
                nodeId: this.tree.id(child,level),
                data: child,
                level: level,
                parentNode: parentNode,
                selected: this.tree.selected(child,level),
                expanded: this.tree.expanded(child,level)
            }
            node.nodes = this._createState(level + 1, node, this.tree.children(child,level));
            return node;
        });
    }

    render() {
        const nodes = this.state.nodes;
        const children = [];
        if (nodes) {
            nodes.forEach((node) => {
                children.push(React.createElement(TreeNode, {
                    treeView: this,
                    node: node,
                    key: node.nodeId
                }));
            });
        }
        return (
            <div className="treeview">
                <ul className="list-group">
                    {children}
                </ul>
            </div>
        )
    }

    //
    // Access to the selection
    //
    selectedNodes() {
        const sel = [];
        function f(nodes) {
            nodes.forEach( (node) => {
                sel.push(node.data);
            })
        }
        f(this.state.nodes);
        return sel;
    }

    //
    // Events
    //
    clicked(node) {
        if(this.props.onClick) {
            this.props.onClick(node.data,node.level);
        }
    }
    doubleClicked(node) {
        if(this.props.onDoubleClick) {
            this.props.onDoubleClick(node.data,node.level);
        }
    }
    selectChanged(node) {
        this._selectChanged(node,node.selected);
    }
    _selectChanged(node,selected) {
        if(this.props.onSelectChange) {
            this.props.onSelectChange(node.data,node.level,selected);
        }
        if(node.nodes) {
            node.nodes.forEach( (n) => {
                n.selected = selected;
                this.selectChanged(n,selected);
            });
        }
    }
}

// TreeView.propTypes = {
//   levels: React.PropTypes.number,
//   expandIcon: React.PropTypes.string,

//   emptyIcon: React.PropTypes.string,
//   nodeIcon: React.PropTypes.string,

//   color: React.PropTypes.string,
//   backColor: React.PropTypes.string,
//   borderColor: React.PropTypes.string,
//   onhoverColor: React.PropTypes.string,
//   selectedColor: React.PropTypes.string,
//   selectedBackColor: React.PropTypes.string,

//   enableLinks: React.PropTypes.bool,
//   highlightSelected: React.PropTypes.bool,
// };

TreeView.defaultProps = {
    expandIcon: 'glyphicon glyphicon-plus',
    collapseIcon: 'glyphicon glyphicon-minus',

    nodeIcon: 'glyphicon glyphicon-stop',

    unselectedIcon: 'glyphicon glyphicon-unchecked',
    selectedIcon: 'glyphicon glyphicon-check',

    indent: 5,
    indentUnit: 'px',

    color: "#428bca",
    backColor: undefined,
    borderColor: undefined,
    onhoverColor: '#F5F5F5',
    selectedColor: '#000000',
    selectedBackColor: '#FFFFFF',

    highlightSelected: true,
};

class TreeNode extends React.Component {

    constructor(props) {
        super(props);

        this.treeView = props.treeView;
        this.state = this.initState(props.node);

        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
        this.clicked = this.clicked.bind(this);
        this.doubleClicked = this.doubleClicked.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.treeView = nextProps.treeView;
        this.setState(this.initState(nextProps.node));
    }

    initState(node) {
        return {
            node: node
        };
    }

    toggleExpanded(event) {
        event.preventDefault();
        event.stopPropagation();
        const node = this.state.node;
        node.expanded = !node.expanded;
        this.setState(this.initState(node));
    }
    toggleSelected(event) {
        event.preventDefault();
        event.stopPropagation();
        const node = this.state.node;
        node.selected = !node.selected;
        this.setState(this.initState(node));
        this.treeView.selectChanged(node);
    }

    clicked(event) {
        event.preventDefault();
        event.stopPropagation();
        const node = this.state.node;
        this.treeView.clicked(node);
    }

    doubleClicked(event) {
        event.preventDefault();
        event.stopPropagation();
        const node = this.state.node;
        this.treeView.doubleClicked(node);
    }

    render() {
        const node = this.state.node;
        const { expanded, selected } = node;
        const treeView = this.treeView;
        const options = treeView.props;
        const tree = treeView.tree;

        let text = tree.text(node.data,node.level);
        const style = {
            userSelect: 'none',
            border: 'none',
            padding: 0            
        };
 
        if (options.highlightSelected && selected) {
            style.color = options.selectedColor;
            style.backgroundColor = options.selectedBackColor;
        } else {
            style.color = node.color || options.color;
            style.backgroundColor = node.backColor || options.backColor;
        }

        let indents = "";
        if(node.level) {
            const style = { 
                marginLeft: treeView.props.indent*node.level + treeView.props.indentUnit
            }
            indents = <span className={'indent'} style={style}/>;
        }

        // Assign the exapnd/collapse icon
        let expandCollapseIcon="";
        if (tree.expandable(node.data,node.level)) {
            if (!expanded) {
                expandCollapseIcon = (
                    <span className='icon' style={treeviewSpanStyle} onClick={this.toggleExpanded} onDoubleClick={this.toggleExpanded}>
                        <i className={options.expandIcon}></i>
                    </span>
                )
            } else {
                expandCollapseIcon = (
                    <span className='icon'  style={treeviewSpanStyle} onClick={this.toggleExpanded} onDoubleClick={this.toggleExpanded}>
                      <i className={options.collapseIcon}></i>
                    </span>
                )
            }
        } else {
            expandCollapseIcon = (
                <span className='icon' style={treeviewSpanStyle}>
                    <i className={options.expandIcon} style={{visibility: 'hidden'}}></i>
                </span>
            )
        }

        // Assign the selectable icon
        let selectIcon = "";
        if (tree.selectable(node.data,node.level)) {
            selectIcon = (
                <span className='icon' onClick={this.toggleSelected} style={treeviewSpanIconStyle}>
                    <i className={selected ? options.selectedIcon : options.unselectedIcon}></i>
                </span>
            );
        }

        // Assign the node txt and icon
        const icon = tree.icon(node.data,node.level);
        const linkHref = tree.linkHref(node.data,node.level);
        let nodeIconText = 
            <span onClick={this.clicked} onDoubleClick={this.doubleClicked}>
                {icon && (
                    <span className='icon' style={treeviewSpanIconStyle} >
                        <i className={icon}></i>
                    </span>)}
                {linkHref
                    ? <a href={linkHref}>{text}</a>
                    : <span style={treeviewSpanStyle}>{text}</span>
                }
            </span>
        ;


        // Calculate the children
        let children = [];
        if (expanded && node.nodes) {
            node.nodes.forEach((node) => {
                children.push(React.createElement(TreeNode, {
                    treeView: this.treeView,
                    node: node,
                    key: node.nodeId                
                }));
            });
        }

        // Leave an option for other options, like actions...
        let postNode = "";
            // <span className="glyphicon glyphicon-plus addElement" style={{ float: "right", cursor: "pointer" }}
            //     onClick={this.newNodeForm}></span>) : "";

        style["cursor"] = "pointer";

        let treeNode = (
            <li className="list-group-item"
                style={style}
                key={node.nodeId}>
                {indents}
                {expandCollapseIcon}
                {selectIcon}
                {nodeIconText}
                {postNode}
                {children}
            </li>
        );

        return (
            <ul>
                {treeNode}
            </ul>
        );
    }
}

export default TreeView;
