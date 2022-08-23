/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-18 13:22:40
 * @Description: 消息详情
 */

import type { MessageSystemType, MessageType } from '@/apis/message/typing';
import { MessageReadStatusEnum } from '@/apis/message/typing';
import { MessageTypeEnum } from '@/apis/message/typing';
import IdToPerson from '@/components/Comm/IdToPerson';
import { TodoMessageAPI } from '@/models/useTodoMessageModel';
import { Descriptions, Modal } from 'antd';
import React from 'react';
import { Access, useAccess, useModel } from 'umi';
import { MessageLevelTag } from '../LayoutMessage/components/NoticeList';

export type MessagMessageDescriptionsProps = {
  info: MessageType | MessageSystemType;
  type: MessageTypeEnum;
  children?: React.ReactNode;
};

const MessageDescriptions: React.FC<MessagMessageDescriptionsProps> = ({
  info,
  type,
  children,
}) => {
  return (
    <Descriptions column={3}>
      <Descriptions.Item label="消息名称" span={3}>
        {info.name}
      </Descriptions.Item>
      <Descriptions.Item label="消息类型">
        {type === MessageTypeEnum.Person ? '个人消息' : '系统消息'}
      </Descriptions.Item>
      <Descriptions.Item label="消息级别">
        <MessageLevelTag level={info.level} />
      </Descriptions.Item>
      <Descriptions.Item label="业务类型">{info.businessKey || '-'}</Descriptions.Item>
      {type === MessageTypeEnum.System && (
        <Descriptions.Item label="发送人" span={3}>
          <IdToPerson person={{ userIds: [(info as MessageSystemType).operatorId] }} />
        </Descriptions.Item>
      )}
      <Descriptions.Item label="创建时间" span={3}>
        {info.createdAt}
      </Descriptions.Item>
      <Descriptions.Item label="消息描述" span={3}>
        {info.body.description}
      </Descriptions.Item>
      {children}
    </Descriptions>
  );
};
export default MessageDescriptions;

export function MessageReadConfirm({ info, type }: MessagMessageDescriptionsProps) {
  if (info.readStatus === MessageReadStatusEnum.Read) {
    return Modal.info({
      title: `消息详情`,
      content: <MessageDescriptions info={info} type={type} />,
      width: 600,
    });
  }
  return Modal.confirm({
    title: `消息详情`,
    content: <MessageDescriptions info={info} type={type} />,
    width: 600,
    okText: '已读',
    onOk: () => {
      return TodoMessageAPI.readMessage(info.id, type);
    },
  });
}
