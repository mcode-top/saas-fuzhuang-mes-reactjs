import { Avatar, Button, List, Tag } from 'antd';

import React from 'react';
import classNames from 'classnames';
import styles from './NoticeList.less';
import type { MessageSystemType, MessageType, MessageTypeEnum } from '@/apis/message/typing';
import { MessageLevelEnum } from '@/apis/message/typing';
import { useModel } from 'umi';
import LoadingButton from '@/components/Comm/LoadingButton';
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
              <List.Item
                key={item.id}
                className={styles.item}
                onClick={() => {
                  onClick?.(item);
                }}
                actions={[
                  <LoadingButton
                    type="link"
                    key="read"
                    onLoadingClick={() => {
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
            );
          }}
        />
      )}
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e);
              }
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
export function MessageLevelTag(props: { level: MessageLevelEnum }) {
  if (props.level === MessageLevelEnum.Exigency) {
    return <Tag color="red">紧急</Tag>;
  } else if (props.level === MessageLevelEnum.Importance) {
    return <Tag color="blue">重要</Tag>;
  } else {
    return <Tag>普通</Tag>;
  }
}

export default NoticeList;
