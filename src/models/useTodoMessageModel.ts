/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-17 20:43:29
 * @Description: 待办消息
 */

import {
  messageCurrentMyMessage,
  messageCurrentSystemMessage,
  messageFindOneById,
  messageSettingRead,
} from '@/apis/message';
import type { MessageSystemType, MessageType } from '@/apis/message/typing';
import { MessageLevelEnum } from '@/apis/message/typing';
import { MessageReadStatusEnum, MessageTypeEnum } from '@/apis/message/typing';
import { MessageReadConfirm } from '@/pages/message/components/MessageDescriptions';
import { useState } from 'react';
export type MessageBox<T> = {
  total: number;
  list: T[];
};
const unReadMessageParam = {
  limit: 20,
  page: 1,
  query: {
    readStatus: MessageReadStatusEnum.UnRead,
  },
};
export const TodoMessageAPI: any = {};
const syncValue: {
  myMessage: MessageBox<MessageType>;
  systemMessage: MessageBox<MessageSystemType>;
} = {
  myMessage: {
    total: 0,
    list: [],
  },
  systemMessage: {
    total: 0,
    list: [],
  },
};
/**
 * 指定紧急消息
 */
function topExigency(list: any[], type: MessageTypeEnum) {
  const exigencyList = list.filter((item) => item.level === MessageLevelEnum.Exigency);
  if (exigencyList.length > 0) {
    exigencyList.forEach((item) => {
      MessageReadConfirm({ info: item, type: type });
    });
  }
}
export default () => {
  const [myMessage, setMyMessage] = useState<MessageBox<MessageType>>({ total: 0, list: [] });
  const [systemMessage, setSystemMessage] = useState<MessageBox<MessageSystemType>>({
    total: 0,
    list: [],
  });
  function refreshMyMessage() {
    return messageCurrentMyMessage(unReadMessageParam).then((res) => {
      const { data } = res;
      syncValue.myMessage = {
        total: data.meta.totalItems,
        list: data.items,
      };
      topExigency(data.items, MessageTypeEnum.Person);
      setMyMessage(syncValue.myMessage);
    });
  }
  function refreshSystemMessage() {
    return messageCurrentSystemMessage(unReadMessageParam).then((res) => {
      const { data } = res;
      syncValue.systemMessage = {
        total: data.meta.totalItems,
        list: data.items,
      };
      topExigency(data.items, MessageTypeEnum.System);
      setSystemMessage(syncValue.systemMessage);
    });
  }
  function addMessage(
    messageId: number,
    type: MessageTypeEnum,
  ): Promise<MessageType | MessageSystemType> {
    return messageFindOneById(messageId, type).then((res) => {
      const { data } = res;
      if (type === MessageTypeEnum.Person) {
        syncValue.myMessage.total += 1;
        syncValue.myMessage.list.unshift(data as MessageType);
        setMyMessage({ ...syncValue.myMessage });
      } else {
        syncValue.systemMessage.total += 1;
        syncValue.systemMessage.list.unshift(data as MessageSystemType);
        setSystemMessage({ ...syncValue.systemMessage });
      }
      return res.data;
    });
  }
  function readMessage(messageId: number, type: MessageTypeEnum) {
    return messageSettingRead(messageId, type).then((res) => {
      if (type === MessageTypeEnum.Person) {
        syncValue.myMessage.total -= 1;
        syncValue.myMessage.list = syncValue.myMessage.list.filter((m) => m.id !== messageId);
        setMyMessage({ ...syncValue.myMessage });
        if (syncValue.myMessage.list.length === 0 && syncValue.myMessage.total > 0) {
          refreshMyMessage();
        }
      } else {
        syncValue.systemMessage.total -= 1;
        syncValue.systemMessage.list = syncValue.systemMessage.list.filter(
          (m) => m.id !== messageId,
        );
        setSystemMessage({ ...syncValue.systemMessage });

        if (syncValue.systemMessage.list.length === 0 && syncValue.systemMessage.total > 0) {
          refreshSystemMessage();
        }
      }
    });
  }
  TodoMessageAPI.refreshMyMessage = refreshMyMessage;
  TodoMessageAPI.refreshSystemMessage = refreshSystemMessage;
  TodoMessageAPI.readMessage = readMessage;
  TodoMessageAPI.addMessage = addMessage;
  return {
    refreshMyMessage,
    refreshSystemMessage,
    addMessage,
    readMessage,
    myMessage,
    systemMessage,
  };
};
