<script>
import { el } from '@/i18n/en_US';
import { getNewNode, getUUID, isNullObj } from '../common';
import Element from './element';
export default {
  name: 'Chart',
  data() {
    return {
      dateMap: new Map(),
      dataList: [],
      // domList: []
      curNode: null
    };
  },
  computed: {},
  mounted() {
    const tempNode = {
      id: getUUID(),
      pid: '',
      type: 'root',
      name: '开始',
      attrs: {},
      props: {},
      conditions: [],
      children: {
        id: getUUID(),
        pid: '',
        type: 'func',
        name: '函数1',
        attrs: {},
        props: {},
        conditions: [],
        children: {
          id: getUUID(),
          pid: '',
          type: 'condition',
          name: '判断',
          attrs: {},
          props: {},
          conditions: [
            {
              id: getUUID(),
              pid: '1',
              type: 'branch',
              name: '条件1',
              attrs: {},
              props: {},
              conditions: [],
              children: {
                id: getUUID(),
                pid: '',
                type: 'condition',
                name: '条件头',
                attrs: {},
                props: {},
                conditions: [
                  {
                    id: getUUID(),
                    pid: '2',
                    type: 'branch',
                    name: '条件11',
                    attrs: {},
                    props: {},
                    conditions: [],
                    children: {}
                  },
                  {
                    id: getUUID(),
                    pid: '3',
                    type: 'branch',
                    name: '条件12',
                    attrs: {},
                    props: {},
                    conditions: [],
                    children: {
                      id: getUUID(),
                      pid: '',
                      type: 'algo',
                      name: '算法12',
                      attrs: {},
                      props: {},
                      children: {},
                      conditions: []
                    }
                  }
                ],
                children: {
                  id: getUUID(),
                  pid: '',
                  type: 'empty',
                  name: '空',
                  attrs: {},
                  props: {},
                  conditions: [],
                  children: {
                    id: getUUID(),
                    pid: '',
                    type: 'func',
                    name: '函数3',
                    attrs: {},
                    props: {},
                    children: {},
                    conditions: []
                  }
                }
              }
            },
            {
              id: getUUID(),
              pid: '2',
              type: 'branch',
              name: '条件2',
              attrs: {},
              props: {},
              conditions: [],
              children: {
                id: getUUID(),
                pid: '',
                type: 'algo',
                name: '算法2',
                attrs: {},
                props: {},
                children: {},
                conditions: []
              }
            }
          ],
          children: {
            id: getUUID(),
            pid: '',
            name: '空',
            type: 'empty',
            attrs: {},
            props: {},
            conditions: [],
            children: {
              id: getUUID(),
              pid: '',
              type: 'func',
              name: '函数4',
              attrs: {},
              props: {},
              children: {},
              conditions: []
            }
          }
        }
      }
    };

    this.curNode = tempNode;
  },
  methods: {
    /**
     * @description:渲染流程图
     * @param {*} node
     * @return {*}
     */
    renderFlow(node) {
      if (!node) {
        return [];
      }
      const domList = [];
      if (node.type !== 'condition') {
        domList.push(this.createNode(node));
      } else if (node.type === 'condition' && node.conditions.length > 1) {
        const branchs = node.conditions.map(item => {
          return this.renderFlow(item);
        });

        const condition = this.createCondtionNode(branchs);
        domList.push(condition);
      }
      if (node.children && !isNullObj(node.children)) {
        // 递归，为啥vnode数组会平铺渲染?
        domList.push(this.renderFlow(node.children));
      }

      return domList;
    },

    createNode(node) {
      return (
        <Element
          node={node}
          onAddNode={this.addNode}
          onDelNode={this.delNode}
        ></Element>
      );
    },

    createCondtionNode(branchs) {
      return (
        <div class='branch-box'>
          {branchs.map(item => (
            <div class='branch'>
              {item}
              <div class='center-line'></div>
            </div>
          ))}
        </div>
      );
    },

    addNode(type, node) {
      if (type !== 'condition') {
        const newNode = getNewNode(type);
        newNode.children = node.children;
        node.children = newNode;
      } else if (type === 'condition') {
        const emptyNode = getNewNode('empty');
        emptyNode.children = node.children;

        const conditionNode = getNewNode('condition');
        conditionNode.conditions = [getNewNode('branch'), getNewNode('branch')];
        conditionNode.children = emptyNode;

        node.children = conditionNode;
      }
    },
    delNode(node) {
      const type = node.type;
      const parentNode = this.getParentNode(this.curNode, node);
      if (type !== 'branch') {
        parentNode.children = node.children;
      } else if (type === 'branch') {
        if (parentNode.conditions.length > 2) {
          for (let i = 0; i < parentNode.conditions.length; i++) {
            if (parentNode.conditions[i].id === node.id) {
              parentNode.conditions.splice(i, 1);
            }
          }
        } else if (parentNode.conditions.length === 2) {
          let otherBranch = {};
          for (let i = 0; i < parentNode.conditions.length; i++) {
            if (parentNode.conditions[i].id !== node.id) {
              otherBranch = parentNode.conditions[i];
            }
          }
          this.delCondition(parentNode, otherBranch);
        }
      }
    },
    getFootNode(node) {
      if (!isNullObj(node.children)) {
        return this.getFootNode(node.children);
      } else {
        return node;
      }
    },
    delCondition(conditionNode, otherBranch) {
      let parentNode = this.getParentNode(this.curNode, conditionNode);
      if (!isNullObj(parentNode)) {
        parentNode.children = otherBranch.children;
        const footNode = this.getFootNode(otherBranch);
        if (otherBranch === footNode) {
          parentNode.children = conditionNode.children.children;
        } else {
          footNode.children = conditionNode.children.children;
        }
      }
    },
    addCard() {},
    renderEnd() {
      return <div>结束</div>;
    },
    getParentNode(tree, node) {
      let res = '';
      if (!isNullObj(tree.children) && tree.children.id === node.id) {
        res = tree;
        return res;
      }
      if (!isNullObj(tree.children)) {
        res = this.getParentNode(tree.children, node);
        if (res) {
          return res;
        }
      }
      if (tree.type === 'condition' && tree.conditions.length > 1) {
        for (let i = 0; i < tree.conditions.length; i++) {
          if (tree.conditions[i].id === node.id) {
            res = tree;
            break;
          } else {
            res = this.getParentNode(tree.conditions[i], node);
            if (res) {
              break;
            }
          }
        }
        return res;
      }
    }
  },
  render() {
    return (
      <div class='chart-container'>
        {this.renderFlow(this.curNode)}
        {this.renderEnd()}
      </div>
    );
  }
};
</script>
<style lang="scss" scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}
.branch-box {
  display: flex;
  justify-content: center;
  background: #fff;
  z-index: 10;
}
.branch {
  position: relative;
  border-top: 2px solid #d9d9d9;
  border-bottom: 2px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:first-child::before {
    content: '';
    position: absolute;
    left: -20px;
    top: -2px;
    width: calc(50% + 19px);
    height: 2px;
    background-color: #fff;
  }
  &:last-child::before {
    content: '';
    position: absolute;
    top: -2px;
    right: -20px;
    width: calc(50% + 19px);
    height: 2px;
    background-color: #fff;
  }
  &:first-child::after {
    content: '';
    position: absolute;
    left: -20px;
    bottom: -2px;
    width: calc(50% + 19px);
    height: 2px;
    background-color: #fff;
  }
  &:last-child::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -20px;
    width: calc(50% + 19px);
    height: 2px;
    background-color: #fff;
  }
  .center-line {
    position: absolute;
    height: 100%;
    width: 2px;
    background-color: #d9d9d9;
  }
}
</style>
