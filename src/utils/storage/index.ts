/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 19:39:55
 */
import { cloneDeep } from 'lodash';
import TaskQueue from '../taskQueue';
export type StorageModule<T = any, U = any> = {
  key: string;
  loader: (param: T) => U;
};
/**
 * 加载被缓存插件
 */
export class StorageDataSource {
  /**
   * 缓存数据
   */
  holder: Record<string, any> = {};
  /**
   * 被装载的模块
   */
  modules: Record<string, StorageModule> = {};
  queue: TaskQueue;
  constructor() {
    this.queue = new TaskQueue(50);
    this.loader();
  }
  async runLoader(key, params) {
    return await this.modules[key].loader(params);
  }
  convertKey(key: string, params: any) {
    return key + '+_+' + JSON.stringify(params);
  }
  /**
   * 获取缓存值
   * @param {*} key 缓存名
   * @param {*} sync 是否加载实时数据
   * @param {*} params 需要传入的参数
   * @returns
   */
  async getValue<T = any>(key: string, sync = false, params = {}): Promise<T> {
    return await this.queue.pushQueue(this, this.loaderValue, undefined, key, sync, params);
  }
  loaderValue<T = any>(key: string, sync = false, params = {}): Promise<T> {
    const onlyKey = this.convertKey(key, params);
    return new Promise(async (resolve, reject) => {
      try {
        if (this.holder[onlyKey] === undefined || this.holder[onlyKey] === null || sync) {
          this.holder[onlyKey] = await this.runLoader(key, params);
        }
        resolve(cloneDeep(this.holder[onlyKey]));
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }
  /**
   * 同步数据
   * @param {*} key 缓存名,如果设置为undefined 等于同步全部
   * @param {*} loaded 是否装载
   * @param {*} params 需要传入的参数,如果是同步全部,这会根据键值对传入对应的module中
   */
  syncValue<T = any>(key, loaded = false, params = {}): Promise<T | null> {
    return new Promise(async (resolve, reject) => {
      try {
        if (key !== undefined) {
          const onlyKey = this.convertKey(key, params);

          if (loaded) {
            this.holder[onlyKey] = await this.runLoader(key, params);
            resolve(cloneDeep(this.holder[onlyKey]));
          } else {
            this.holder[onlyKey] = null;
            resolve(null);
          }
        } else {
          // 同步全部数据
          await Promise.all(
            Object.keys(this.holder).map(async (cachekey) => {
              const loaderKey = cachekey.split('+_+')[0];
              if (loaded) {
                this.holder[cachekey] = await this.runLoader(loaderKey, params && params[cachekey]);
              } else {
                this.holder[cachekey] = null;
              }
            }),
          );
          resolve(null);
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }
  /**
   * 当前key是否在holder中
   */
  hasKey(key) {
    return Object.keys(this.holder).findIndex((itemKey) => itemKey.split('+_+')[0] === key) !== -1;
  }
  /**
   * 动态加入缓存模块
   * @param {*} key 缓存名
   * @param {*} module 模块模型
   * @param {*} sync 是否加入就同步一次
   * @param {*} params 同步的参数
   */
  setHolderModule(key: string, module: StorageModule, sync = false, params = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (key === undefined || module === undefined) {
          reject('无效参数名或者方法');
        } else {
          this.holder[key] = null;
          this.modules[key] = module;
          if (sync) {
            this.holder[key] = await this.getValue(key, sync, params);
          }
          resolve(this.holder[key]);
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }
  /**
   * 装载模块
   */
  async loader() {
    try {
      const Modules = require.context('./modules', true, /\.ts$/);
      await Promise.all(
        Modules.keys().map(async (key) => {
          const file: StorageModule = await Modules(key);
          this.modules[file.key] = file;
          this.holder[file.key] = null;
        }),
      );
    } catch (error) {
      console.error('加载失败');
    }
  }
}
const storageDataSource = new StorageDataSource();
export default storageDataSource;
