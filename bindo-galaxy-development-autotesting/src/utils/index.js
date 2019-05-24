import uuidV1 from 'uuid/v1';

export const createUuid = () => uuidV1().split('-').join('');

export const setLocalStorageJson = (key, json) => {
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(json));
};

export const getLocalStorageJson = key => {
  if (!key) return;

  let json = localStorage.getItem(key);

  if (json) {
    json = JSON.parse(json);
  }

  return json;
};

/**
 * 根据list中对象属性key，找到对应的节点
 * @param {*} list [{}, {}]
 * @param {*} key 对象属性key
 * @param {*} value 对象属性key的值
 */
export const findNode = (list = [], key, value) => {
  for (let i = 0; i < list.length; i++) {
    const node = list[i];
    if (node[key] === value) {
      return node;
    } else if (node.children && node.children.length > 0) {
      const tempNode = findNode(node.children, key, value);
      if (tempNode) {
        return tempNode;
      }
    }
  }

  return null;
}

/**
 * 找出所有兄弟节点
 * @param {*} list [{}, {}]
 * @param {*} key 对象属性key
 * @param {*} value 对象属性key的值
 */
export const findBrotherNodes = (list = [], key, value) => {
  for (let i = 0; i < list.length; i++) {
    const node = list[i];
    if (node[key] === value) {
      return list;
    } else if (node.children && node.children.length > 0) {
      const nodes = findBrotherNodes(node.children, key, value);
      if (nodes) {
        return nodes;
      }
    }
  }

  return null;
}

/**
 * 比较两个字符串数组
 * @param {*} arr1
 * @param {*} arr2
 */
export const stringArrayEqual = (arr1, arr2) => {
  if (!arr1 || !arr2) {
    return false;
  }

  if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  const arr1Set = new Set(arr1);

  for (let i = 0; i < arr2.length; i++) {
    const item = arr2[i];
    if (!arr1Set.has(item)) {
      return false;
    }
  }

  return true;
}

export const getSearchParams = (props) => {
  const {
    location = {},
  } = props;

  let {
    search = '',
  } = location;
  let searchStrings = [];
  const params = {}
  if (search) {
    search = search.slice(1);
    searchStrings = search.split('&')
    searchStrings.forEach(item => {
      item = item.split('=')
      /* eslint-disable */
      params[item[0]] = item[1]
      /* eslint-able */
    })
    return params;
  }
}

export function formatTime(time) {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}
