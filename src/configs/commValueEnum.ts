/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-03 12:58:57
 * @Description: 公用的valueEnum
 */

import { MessageLevelEnum, MessageReadStatusEnum, MessageTypeEnum } from "@/apis/message/typing"

export const UserValueEnum = {
  Sex: new Map([
    ['0', { text: '女' }],
    ['1', { text: '男' }],
    ['2', { text: '保密' }],
  ]),
  Status: new Map([
    ['0', { text: '禁用', status: 'Error' }],
    ['1', { text: '正常', status: 'Success' }],
  ])
}
export const ProcessValueEnum = {
  ActTaskStatusEnum: new Map([
    ['0', { text: '未执行' }],
    ['1', { text: '执行中', status: 'Processing' }],
    ['2', { text: '已完成', status: 'Success' }],
    ['3', { text: '已同意', status: 'Success' }],
    ['4', { text: '被驳回', status: 'Error' }],
    ['5', { text: '已失效', status: 'Warning' }],
  ]),
  ActProcessStatusEnum: new Map([
    ['0', { text: '执行中', status: 'Processing' }],
    ['1', { text: '已完成', status: 'Success' }],
    ['2', { text: '已撤销', status: 'Error' }],
    ['3', { text: '被暂停', status: 'Warning' }],
    ['4', { text: '被驳回', status: 'Error' }],
  ]),
  ActApproveStatusEnum: new Map([
    ['0', { text: '未审批' }],
    ['1', { text: '已同意', status: 'Success' }],
    ['2', { text: '不同意', status: 'Error' }],
    ['3', { text: '抄送状态', }],
  ]),
  ActApproveModeEnum: new Map([
    ['0', { text: '依次审批' }],
    ['1', { text: '会签' }],
    ['2', { text: '或签' }],
  ]),
  ActApproveTypeEnum: new Map([
    ['0', { text: '选择人员' }],
    ['1', { text: '选择部门' }],
    ['2', { text: '选择角色' }],
    ['2', { text: '发起者指定' }],
  ]),
  ActTaskModelStatusEnum: new Map([
    ['0', { text: '已失效', status: 'Success' }],
    ['1', { text: '使用中', status: 'Error' }],
  ]),

}
export const MessageValueEnum = {
  MessageReadStatusEnum: new Map([
    [MessageReadStatusEnum.Read, { text: '已读', status: 'Success' }],
    [MessageReadStatusEnum.UnRead, { text: '未读', status: 'Error' }],
  ]),
  MessageLevelEnum: new Map([
    [MessageLevelEnum.Exigency, { text: '紧急', status: 'Error' }],
    [MessageLevelEnum.Importance, { text: '重要', status: 'Warning' }],
    [MessageLevelEnum.Normal, { text: '普通' }],
  ]),
  MessageDisableStatus: new Map([
    [true, { text: '已禁用', status: 'Error' }],
    [false, { text: '使用中', status: 'Success' }],
  ])
}
