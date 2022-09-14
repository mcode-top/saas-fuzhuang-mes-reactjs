import { Avatar, Button, List, Tag, Tooltip } from 'antd';

import React from 'react';
import classNames from 'classnames';
import styles from './NoticeList.less';
import type { MessageSystemType, MessageType, MessageTypeEnum } from '@/apis/message/typing';
import { MessageLevelEnum } from '@/apis/message/typing';
import { history, useModel } from 'umi';
import LoadingButton from '@/components/Comm/LoadingButton';
import MessageDescriptions, { MessageReadConfirm } from '../../components/MessageDescriptions';
import HeaderDropdown from '@/components/HeaderDropdown';
import { MessageLevelTag } from '../NoticeList';
export type NoticeIconTabProps<T = any> = {
  count?: number;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title: string;
  tabKey: MessageTypeEnum;
  onClick?: (item: T) => void;
  onClear?: () => void;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list: T[];
  onViewMore?: (e: any) => void;
  onRefrsh?: () => void;
};
function NoticeList<T extends MessageType | MessageSystemType>({
  list = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
  onRefrsh,
  tabKey,
}: NoticeIconTabProps<T>): React.ReactElement {
  const { readMessage } = useModel('useTodoMessageModel');
  return (
    <div>
      {!list || list.length === 0 ? (
        <div className={styles.notFound}>
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            alt="not found"
          />
          <div>{emptyText}</div>
        </div>
      ) : (
        <List<T>
          className={styles.list}
          dataSource={list}
          renderItem={(item, i) => {
            return (
              <HeaderDropdown
                overlay={
                  <div style={{ padding: 12 }}>
                    <MessageDescriptions info={item} type={tabKey} />
                  </div>
                }
                overlayClassName={styles.popover}
                trigger={['click']}
              >
                <List.Item
                  key={item.id}
                  className={styles.item}
                  actions={[
                    <LoadingButton
                      type="link"
                      key="read"
                      style={{ width: 100 }}
                      onLoadingClick={(e) => {
                        e.stopPropagation();

                        e.preventDefault();
                        return readMessage(item.id, tabKey);
                      }}
                    >
                      已读
                    </LoadingButton>,
                  ]}
                >
                  <List.Item.Meta
                    className={styles.meta}
                    title={
                      <div className={styles.title}>
                        <MessageLevelTag level={item.level} />
                        <div>{item.name}</div>
                      </div>
                    }
                    description={
                      <div>
                        <div className={styles.description}>{item.body.description}</div>
                        <div className={styles.datetime}>{item.createdAt}</div>
                      </div>
                    }
                  />
                </List.Item>
              </HeaderDropdown>
            );
          }}
        />
      )}
      <div className={styles.bottomBar}>
        {showViewMore ? (
          <div
            onClick={(e) => {
              history.push('/account/message?type=' + tabKey);
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
        <div
          onClick={() => {
            onRefrsh?.();
          }}
        >
          刷新消息
        </div>
      </div>
    </div>
  );
}

export default NoticeList;
