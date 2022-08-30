import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { useModel } from 'umi';

import NoticeIcon from './components/NoticeIcon';
import styles from './index.less';
import type { UserWebSocket } from '@/utils/websocket';
import { MESSAGE_SOCKET_BRODACAST } from '../message.config';
import type { MessageSystemType, MessageType } from '@/apis/message/typing';
import { MessageTypeEnum } from '@/apis/message/typing';
import { MessageLevelEnum } from '@/apis/message/typing';
import type { InitialStateType } from '@/app';
import { loadingRefresh } from '@/utils';
import LoadingButton from '@/components/Comm/LoadingButton';
import { MessageReadConfirm } from '../components/MessageDescriptions';

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const NoticeIconView: React.FC = () => {
  const initialState = useModel('@@initialState').initialState as InitialStateType;
  const [loading, setLoading] = useState(false);
  const {
    refreshMyMessage,
    refreshSystemMessage,
    addMessage,
    readMessage,
    myMessage,
    systemMessage,
  } = useModel('useTodoMessageModel');
  useEffect(() => {
    if (initialState.userWebSocket) {
      addMessageListener(initialState.userWebSocket);
    }
  });
  useEffect(() => {
    refreshMyMessage();
    refreshSystemMessage();
  }, []);
  /**
   * 添加消息监听器
   */
  function addMessageListener(uws: UserWebSocket) {
    const ReadButton = ({ messageId, type }: { messageId: number; type: MessageTypeEnum }) => {
      return (
        <LoadingButton
          type="link"
          key="read"
          onLoadingClick={() => {
            return readMessage(messageId, type).then((res) => {
              notification.close(type + '_' + messageId);
            });
          }}
        >
          已读
        </LoadingButton>
      );
    };
    uws.listenerEvent(
      MESSAGE_SOCKET_BRODACAST,
      MESSAGE_SOCKET_BRODACAST,
      async (data: { messageId: number; type: MessageTypeEnum }) => {
        return addMessage(data.messageId, data.type).then((res) => {
          const result = res;
          if (result.level === MessageLevelEnum.Normal) {
            notification.info({
              key: data.type + '_' + data.messageId,
              message: result.name,
              description: result.body.description,
              duration: 10,
              btn: <ReadButton messageId={data.messageId} type={data.type} />,
            });
          } else if (result.level === MessageLevelEnum.Importance) {
            notification.warning({
              key: data.type + '_' + data.messageId,
              message: result.name,
              description: result.body.description,
              duration: 0,
              btn: <ReadButton messageId={data.messageId} type={data.type} />,
            });
          } else if (result.level === MessageLevelEnum.Exigency) {
            MessageReadConfirm({ info: result, type: data.type });
          }
        });
      },
    );
  }

  return (
    <NoticeIcon
      className={styles.action}
      count={systemMessage.total + myMessage.total}
      loading={loading}
      clearText="清空"
      viewMoreText="查看更多"
      clearClose
    >
      <NoticeIcon.Tab<MessageSystemType>
        tabKey={MessageTypeEnum.System}
        count={systemMessage.total}
        list={systemMessage.list}
        title="系统消息"
        onRefrsh={() => {
          console.log(111);

          loadingRefresh(refreshSystemMessage(), setLoading);
        }}
        emptyText="暂无新的系统消息"
        showViewMore
      />
      <NoticeIcon.Tab<MessageType>
        tabKey={MessageTypeEnum.Person}
        count={myMessage.total}
        list={myMessage.list}
        title="个人消息"
        onRefrsh={() => loadingRefresh(refreshMyMessage(), setLoading)}
        emptyText="暂无新的消息"
        showViewMore
      />
    </NoticeIcon>
  );
};

export default NoticeIconView;
