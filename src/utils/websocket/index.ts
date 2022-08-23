/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-15 13:48:27
 * @Description: websocket 管理
 */
import { TENANT_HEADER_TOKEN } from "@/configs/index.config"
import { v4 } from "uuid"
import { waitTime } from ".."
type UserWebSocketCallback = (data?: any) => any
type UserWebSocketServiceResponse = {
  event: string,
  data?: any
}
export type WebSocketEvent = {
  cb: UserWebSocketCallback
  key: string
  event: string
}
export class UserWebSocket {
  events: WebSocketEvent[] = []
  // 是否登录
  isLogin = false
  closeReconnect = false
  PING_TIME = 3000
  RECONNECT_WAIT_TIME = 10000
  url = ''
  token = ''
  ws: WebSocket | undefined
  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }
  login() {
    return new Promise((resolve, reject) => {
      this.closeReconnect = false
      this.ws = new WebSocket(this.url)
      this.ws.addEventListener("open", (event) => {
        // 连接成功便开始登录
        this.listenerEvent("login", "login", () => {
          console.log("websocket登录");
          this.sendJson('login', {
            token: this.token
          })
        })
        this.listenerEvent("login-success", "login-success", () => {
          this.isLogin = true;
          this.reconnect();
          resolve(true)
        })
        this.listenerEvent("login-error", "login-error", () => {
          this.isLogin = false;
          this.logout();
          reject();
        })

      })
      this.ws?.addEventListener("error", (error) => {
        console.log(error, "websocket连接错误");

        reject();
      })
      this.ws.addEventListener("message", (event) => {
        const jsonData: UserWebSocketServiceResponse = JSON.parse(event.data)
        this.events.forEach(evt => {
          if (evt.event === jsonData.event) {
            evt.cb(jsonData.data)
          }
        })
      })
    })

  }
  /**
   * 登出
   */
  logout() {
    this.events = [];
    this.isLogin = false;
    this.closeReconnect = true;
    this.ws?.close()
  }
  /**
   * 断线重连
   */
  private async reconnect() {
    let i = 0;
    const reconnectOperate = async () => {
      console.log(`第${++i}次重连`);
      await this.login().catch(async () => {
        await waitTime(this.RECONNECT_WAIT_TIME);
        reconnectOperate()
      });
    }
    const pingTimer = () => {
      setTimeout(async () => {
        try {
          await this.sendJson("ping");
          pingTimer();
        } catch (error) {
          console.log(error);
          reconnectOperate();
        }
      }, this.PING_TIME)
    }
    pingTimer();
  }
  /**
   * 监听消息
   */
  listenerEvent(key: string, event: string, cb: UserWebSocketCallback) {
    const findIndex = this.events.findIndex(evt => evt.key === key);
    const data = {
      key,
      event,
      cb
    }
    if (findIndex !== -1) {
      this.events.splice(findIndex, 1, data)
    } else {
      this.events.push(data)
    }
  }
  /**
   * 自动设置Key 则意味着你需要手动去重删除
   */
  autoKeyListenerEvent(event: string, cb: UserWebSocketCallback) {
    const uuid = v4();
    this.listenerEvent(uuid, event, cb);
    return uuid;
  }
  deleteEvents(keys: string[]) {
    this.events = this.events.filter(evt => keys.includes(evt.key));
  }
  sendJson(event: string, data?: any) {
    return new Promise((resolve, reject) => {
      let done = false;
      if (this.ws?.readyState === WebSocket.OPEN) {
        setTimeout(() => {
          if (!done) {
            reject(new Error("发送超时"))
          }
        }, this.RECONNECT_WAIT_TIME);
        this.ws?.send(JSON.stringify({
          event, data
        }));
        done = true
        resolve(true);
      } else {
        reject(new Error("连接已断开"))
      }
    })
  }
}
