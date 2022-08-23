/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-15 13:51:01
 * @Description: 消息中心接口
 */
import { request } from 'umi';
import type { MessagePageOrder, MessagePageQuery, MessageSystemCreateDto, MessageSystemType, MessageType, MessageTypeEnum } from './typing';

/**
 * 通过消息Id获取消息详情
 */
export function messageFindOneById(messageId: number, type: MessageTypeEnum) {
  return request<RESULT_SUCCESS<MessageType | MessageSystemType>>('/message/' + messageId, {
    method: "GET",
    params: {
      type
    }
  })
}

/**
 * 设置消息已读
 */
export function messageSettingRead(messageId: number, type: MessageTypeEnum) {
  return request<RESULT_SUCCESS<MessageType | MessageSystemType>>('/message/read/' + messageId, {
    method: "GET",
    params: {
      type
    }
  })
}

/**
 * 获取当前个人消息分页
 */
export function messageCurrentMyMessage(data: PAGINATION_QUERY.Param<MessagePageQuery, MessagePageOrder>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<MessageType>>>('/message/my/current/page', {
    method: "POST",
    data
  })
}

/**
 * 获取当前系统消息分页
 */
export function messageCurrentSystemMessage(data: PAGINATION_QUERY.Param<MessagePageQuery, MessagePageOrder>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<MessageSystemType>>>('/message/system/current/page', {
    method: "POST",
    data
  })
}

/**
 * 获取全部系统消息分页 (鉴权)
 */
export function messageSystemMessage(data: PAGINATION_QUERY.Param<MessagePageQuery, MessagePageOrder>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<MessageSystemType>>>('/message/system/page', {
    method: "POST",
    data
  })
}

/**
 * 给系统发送消息
 */
export function messageSendSystemMessage(data: MessageSystemCreateDto) {
  return request('/message/system', {
    method: "POST",
    data
  })
}
