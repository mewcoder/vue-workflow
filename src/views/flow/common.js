/**
 * @description:
 * type:
 *  root
 *  conditon
 *  empty
 *
 *  func
 *  algo
 *  action
 *
 */
const nodeType = {
  root: 'root',
  conditon: 'conditon',
  empty: 'empty',
  func: 'func',
  algo: 'algo',
  action: 'action',
  branch: 'branch'
};
const nodeObj = {
  id: '',
  pid: '',
  type: '',
  name: ' ',
  attrs: {},
  props: {},
  conditions: [],
  children: {}
};
const getNewNode = (type, name, pid) => {
  const node = JSON.parse(JSON.stringify(nodeObj));
  node.id = getUUID();
  node.type = type;
  name ? (node.name = name) : (node.name = type + '_' + node.id);
  pid && (node.pid = pid);
  return node;
};

const getUUID = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4();
};

const isNullObj = obj => {
  if (obj === null || obj === undefined) {
    return true;
  } else {
    return Object.keys(obj).length === 0;
  }
};
export { nodeType, getNewNode, getUUID, isNullObj };
