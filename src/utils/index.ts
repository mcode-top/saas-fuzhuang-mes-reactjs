/*
 * @Author: mmmmmmmm
 * @Date: 2022-02-28 17:26:14
 * @Description: 通用工具
 */
import { isEmpty } from 'lodash';
export function isUUID(s: string) {
  const UUIDReg = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return UUIDReg.test(s);
}

/**
 * 遍历树
 * @param tree
 * @param next
 */
export function traverseTree<T = any>(tree: T[], next: (value: T, parent?: T) => any, parent?: T) {
  tree.forEach((value: any) => {
    next(value, parent);
    if (!isEmpty(value.children)) {
      traverseTree(value.children, next, value);
    }
  });
}

/**
 * 数组转对象
 */
export function arrayToObject<T extends Record<any, any>>(
  arr: T[],
  key: keyof T | ((next: any) => any),
  value: keyof T | ((next: any) => any),
): any {
  return arr.reduce<Record<any, any>>((prev, next) => {
    let partKey = key;
    if (typeof key === 'function') {
      partKey = key(next);
    }
    if (typeof value === 'function') {
      prev[next[partKey]] = value(next);
    } else {
      prev[next[partKey as any]] = next[value];
    }
    return prev;
  }, {});
}

/**
 * json数组去重
 * @param objArr
 * @param uniqKey
 * @returns
 */
export function jsonUniq<T>(objArr: T[], ...uniqKeys: (keyof T)[]) {
  const indexes: any = {};
  return objArr.filter((value) => {
    const uniqKey = uniqKeys.map((i) => value[i]).join('+_+');
    if (!indexes[uniqKey]) {
      indexes[uniqKey] = true;
      return true;
    } else {
      return false;
    }
  });
}
/**
 * 等待时间
 */
export function waitTime(n: number) {
  return new Promise<void>((r) => {
    setTimeout(() => {
      r();
    }, n);
  });
}

/**
 * 设置加载
 */
export function loadingRefresh(promise: Promise<any>, setLoading: (v: boolean) => any) {
  setLoading(true);
  promise.finally(() => {
    setLoading(false);
  });
  return promise;
}

/**@name 对象数组属性名称更改 */
export function arrayAttributeChange<T = Record<any, any>>(
  data: T[],
  changeAttr: [keyof T | ((value) => any), string][],
) {
  return data.map((value) => {
    const temp = { ...value };
    changeAttr.forEach((item) => {
      if (typeof item[0] === 'function') {
        temp[item[1]] = item[0](temp);
      } else {
        Reflect.deleteProperty(temp as any, item[0]);
        temp[item[1]] = value[item[0]];
      }
    });
    return temp;
  });
}
