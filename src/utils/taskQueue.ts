import { waitTime } from '.';

type QueuesType = {
  /**@name 调用时指针 */
  self: any;
  /**@name 调用函数 */
  func: Function;
  /**@name 调用参数 */
  args: any[];
  options?: {
    /**@name 任务超时时间 */
    taskTimeout?: number;
  };
  queuesResolve?: (value: any) => any;
  queuesReject?: (reason: any) => void;
};
/**
 * 任务队列
 */
export default class TaskQueue extends EventTarget {
  queues: QueuesType[];
  lock: boolean;
  close: boolean;
  /**@name 方法调用间隔时间 */
  loopWatch: number;
  taskTimeout: number;
  constructor(loopWatch?: number) {
    super();
    this.queues = [];
    this.lock = false;
    this.close = false;
    this.loopWatch = loopWatch || 50;
    this.taskTimeout = 5000;
  }

  /**
   * 加入任务队列
   */
  pushQueue(self: any, func: Function, options: QueuesType['options'], ...args) {
    return new Promise((resolve, reject) => {
      this.queues.push({
        self,
        func,
        args,
        options,
        queuesResolve: resolve,
        queuesReject: reject,
      });
      if (!this.lock) {
        this.loopEvent();
      }
      this.emit('push');
    }).catch((err) => {
      console.log(err, 'error');
      return err;
    });
  }
  emit(eventName: string) {
    this.dispatchEvent(new Event(eventName));
  }

  deleteQueue(index) {
    this.queues.splice(index, 1);
    this.emit('delete');
  }

  clear() {
    this.queues = [];
  }

  startQueue(index) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      this.lock = true;
      if (!this.queues[index]) return null;
      const { self, func, args, options, queuesResolve, queuesReject } = this.queues[index];
      let result = null;
      const timer = setTimeout(() => {
        queuesReject?.(new Error('任务运行超时'));
        clearTimeout(timer);
        resolve(false);
      }, options!.taskTimeout || this.taskTimeout);
      try {
        result = await func.call(self, ...args);
        this.emit('done');
        queuesResolve?.(result);
      } catch (error) {
        this.emit('error');
        queuesReject?.(error);
      } finally {
        resolve(true);
        clearTimeout(timer);
      }
    });
  }

  loopEvent() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!this.lock && this.queues.length) {
        const index = 0;
        try {
          await this.startQueue(index);
        } catch (error) {
          resolve(error);
          console.error(error, '任务超时');
        } finally {
          this.deleteQueue(index);
          await waitTime(this.loopWatch);
          resolve(true);
          this.lock = false;
          this.loopEvent();
        }
      }
    });
  }
}
