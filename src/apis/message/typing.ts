/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-15 13:51:10
 * @Description: 消息中心类型
 */

export type MessageType = {
  id: number
  name: string;
  readStatus: MessageReadStatusEnum
  businessKey?: string
  level: MessageLevelEnum
  body: MessageDefaultBodyType
  adoptUserId: number
  createdAt: string
  updatedAt: string
}

export type MessageSystemType = {
  userIds?: number[]
  roleIds?: number[]
  deptIds?: number[]
  disable: boolean
  operatorId: number
  messageAdopt?: MessageAdoptType[]
} & Omit<MessageType, 'adoptUserId'>
export type MessageAdoptType = {
  messageSystemId: number;
  userId: number
}
/**
 * 消息级别
 */
export enum MessageLevelEnum {
  Exigency = '0', // 紧急
  Importance = '1', // 重要
  Normal = '2', // 一般
}
/**
* 消息阅读状态
*/
export enum MessageReadStatusEnum {
  Read = "Read", // 已读
  UnRead = "UnRead" // 未读
}
/**
* 消息类型
*/
export enum MessageTypeEnum {
  Person = "Person", // 人员
  System = "System" // 系统
}
export type MessageDefaultBodyType = {
  description: string
}

/**
 * 消息分页查询参数
 */
export type MessagePageQuery = {
  name?: string
  businessKey?: string
  level?: MessageLevelEnum
  createdAt?: PageRangeDateQuery
  updatedAt?: PageRangeDateQuery
  readStatus?: MessageReadStatusEnum
}

/**
 * 消息分页排序
 */
export type MessagePageOrder = {
  updatedAt?: string
  createdAt?: string
}
/**
 * 创建系统消息通知
 */
export type MessageSystemCreateDto = {
  name: string;
  level: MessageLevelEnum
  description: string
  expiration?: Date
  userIds?: number[]
  roleIds?: number[]
  deptIds?: number[]
}
