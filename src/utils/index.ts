/*
 * @Author: mmmmmmmm
 * @Date: 2022-02-28 17:26:14
 * @Description: 通用工具
 */
import { isEmpty } from "lodash"
export function isUUID(s: string) {
  const UUIDReg = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return UUIDReg.test(s);
}

/**
 * 遍历树
 * @param tree
 * @param next
 */
export function traverseTree<T = any>(tree: T[], next: (value: T) => any) {
  tree.forEach((value: any) => {
    next(value);
    if (!isEmpty(value.children)) {
      traverseTree(value.children, next)
    }
  })
}

/**
 * 数组转对象
 * @param arr
 * @param key
 * @param value
 * @returns
 */
export function arrayToObject<T extends Record<any, any>>(arr: T[], key: keyof T, value: keyof T): any {
  return arr.reduce<Record<any, any>>((prev, next) => {
    prev[next[key]] = next[value]
    return prev;
  }, {})
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
    const uniqKey = uniqKeys.map(i => value[i]).join("+_+");
    console.log(uniqKey, indexes);

    if (!indexes[uniqKey]) {
      indexes[uniqKey] = true
      return true;
    } else {
      return false;
    }
  })
}
/**
 * 等待时间
 */
export function waitTime(n: number) {
  return new Promise<void>((r, j) => {
    setTimeout(() => {
      r()
    }, n);
  })
}

/**
 * 设置加载
 */
export function loadingRefresh(promise: Promise<any>, setLoading: (v: boolean) => any) {
  setLoading(true);
  promise.finally(() => {
    setLoading(false);
  })
  return promise
}
