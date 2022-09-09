/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-18 21:57:45
 * @Description: 设置发送人员
 */

import { messageSendSystemMessage } from '@/apis/message';
import { MessageLevelEnum } from '@/apis/message/typing';
import SelectSystemPersonButton from '@/components/Comm/FormlyComponents/SelectSystemPersonButton';
import IdToPerson from '@/components/Comm/IdToPerson';
import SelectSystemPerson from '@/components/SelectSystemPerson';
import { MessageValueEnum } from '@/configs/commValueEnum';
import type { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { Button } from 'antd';
import React, { useRef } from 'react';

const MessageSendPerson: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType[] = [
    {
      title: '通知名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },

    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '级别',
      dataIndex: 'level',
      initialValue: MessageLevelEnum.Normal,
      valueEnum: MessageValueEnum.MessageLevelEnum,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '通知人员',
      dataIndex: 'person',
      renderFormItem: (schema, config, form) => {
        return (
          <SelectSystemPersonButton
            showDept
            showRole
            showUser
            multiple
            value={form.getFieldValue('person')}
          />
        );
      },
    },
    {
      title: '过期时间',
      dataIndex: 'expiration',
      valueType: 'dateTime',
    },
  ];
  return (
    <BetaSchemaForm
      title="发送系统通知"
      layoutType="ModalForm"
      columns={columns}
      formRef={formRef}
      onFinish={(values) => {
        return messageSendSystemMessage({ ...values, ...values.person }).then((res) => {
          formRef.current?.resetFields();
          return res;
        });
      }}
      trigger={<Button type="primary">发送系统通知</Button>}
    />
  );
};

export default MessageSendPerson;
