/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-18 15:28:25
 * @Description: 个人消息记录
 */

import { messageCurrentMyMessage, messageCurrentSystemMessage } from '@/apis/message';
import { MessageType, MessageTypeEnum } from '@/apis/message/typing';
import { MessageValueEnum } from '@/configs/commValueEnum';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import ProCard from '@ant-design/pro-card';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ProTableColumn } from '@ant-design/pro-table/lib/container';
import { Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useLocation, Access } from 'umi';
import { MessageReadConfirm } from '../components/MessageDescriptions';
import { MessageLevelTag } from '../LayoutMessage/components/NoticeList';

const MessageAccount: React.FC = () => {
  const [tab, setTab] = useState<MessageTypeEnum>(MessageTypeEnum.Person);
  const location = useLocation() as any;
  useEffect(() => {
    if (location.query?.type) {
      setTab(location.query?.type);
    }
  }, [location]);
  const commMessateColumns: ProColumns[] = [
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
      title: '阅读状态',
      dataIndex: 'readStatus',
      valueEnum: MessageValueEnum.MessageReadStatusEnum,
    },
    ...COM_PRO_TABLE_TIME.createdAt,
    {
      title: '操作',
      render: (dom, record) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                MessageReadConfirm({
                  info: record,
                  type: tab,
                });
              }}
            >
              详情
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <ProCard
      tabs={{
        activeKey: tab,
        onChange: (key) => {
          setTab(key as MessageTypeEnum);
        },
      }}
    >
      <ProCard.TabPane key={MessageTypeEnum.System} tab="系统消息">
        <ProTable
          rowKey="id"
          columns={commMessateColumns}
          request={(params, sort, filter) => {
            return nestPaginationTable(
              {
                ...params,
              },
              sort,
              filter,
              messageCurrentSystemMessage,
            );
          }}
        />
      </ProCard.TabPane>
      <ProCard.TabPane key={MessageTypeEnum.Person} tab="个人消息">
        <ProTable
          rowKey="id"
          columns={commMessateColumns}
          request={(params, sort, filter) => {
            return nestPaginationTable(
              {
                ...params,
              },
              sort,
              filter,
              messageCurrentMyMessage,
            );
          }}
        />
      </ProCard.TabPane>
    </ProCard>
  );
};
export default MessageAccount;
