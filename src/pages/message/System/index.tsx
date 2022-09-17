/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-15 13:49:04
 * @Description: 系统消息管理
 */
import { messageSystemMessage } from '@/apis/message';
import type { MessageSystemType } from '@/apis/message/typing';
import { MessageTypeEnum } from '@/apis/message/typing';
import ButtonModal from '@/components/Comm/ButtonModal';
import IdToPerson from '@/components/Comm/IdToPerson';
import { MessageValueEnum } from '@/configs/commValueEnum';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Descriptions, Popconfirm, Space } from 'antd';
import { pick } from 'lodash';
import React, { useRef } from 'react';
import MessageDescriptions from '../components/MessageDescriptions';
import { MessageLevelTag } from '../LayoutMessage/NoticeList';
import MessageSendPerson from './MessageSendPerson';
const MessageSystem: React.FC = () => {
  const tableRef = useRef<ActionType>();

  const columns: ProColumns<MessageSystemType>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'body',
      hideInSearch: true,
      renderText(text, record, index, action) {
        return text.description;
      },
      ellipsis: true,
    },
    {
      title: '业务类型',
      dataIndex: 'businessKey',
    },
    {
      title: '级别',
      dataIndex: 'level',
      valueEnum: MessageValueEnum.MessageLevelEnum,
      renderText: (text) => {
        return <MessageLevelTag level={text} />;
      },
    },
    {
      title: '过期时间',
      dataIndex: 'expiration',
      hideInSearch: true,
    },
    {
      title: '已读人数',
      dataIndex: 'messageAdopt',
      renderText(messageAdopt, record, index, action) {
        return messageAdopt?.length;
      },
    },
    ...COM_PRO_TABLE_TIME.createdAt,
    {
      title: '操作',
      fixed: 'right',
      render: (dom, record) => {
        return (
          <Space>
            <ButtonModal title="消息详情" buttonRender={<Button type="link">详情</Button>}>
              <MessageDescriptions info={record} type={MessageTypeEnum.System}>
                <Descriptions.Item span={3} label="已读人数">
                  {record?.messageAdopt?.length}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="已读人员">
                  <IdToPerson person={{ userIds: record?.messageAdopt?.map((i) => i.userId) }} />
                </Descriptions.Item>
              </MessageDescriptions>
            </ButtonModal>
          </Space>
        );
      },
    },
  ];
  return (
    <ProTable
      columns={columns}
      actionRef={tableRef}
      rowKey="id"
      headerTitle="系统消息列表"
      toolBarRender={() => {
        return [<MessageSendPerson key="MessageSendPerson" />];
      }}
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, messageSystemMessage);
      }}
    />
  );
};
export default MessageSystem;
