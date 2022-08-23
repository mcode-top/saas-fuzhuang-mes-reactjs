/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-18 10:52:28
 * @Description: 审批窗口
 */

import { processApproveTask, processStartTask } from '@/apis/process/process';
import type { ActTask } from '@/apis/process/typings';
import ProForm, { ModalForm, ProFormSwitch, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form, Input, Modal } from 'antd';
import React from 'react';

type StartTaskModalParam = { opinion?: string; parameter?: any };

export default function StartTaskModal(props: {
  task: ActTask;
  onFinish?: (values: StartTaskModalParam) => void;
}) {
  return (
    <ModalForm<StartTaskModalParam>
      width={500}
      title={`开始任务[${props.task?.process?.name}]`}
      trigger={
        <Button type="link" onClick={() => {}}>
          开始任务
        </Button>
      }
      onFinish={(values) => {
        return new Promise((resolve, reject) => {
          processStartTask(props.task.id, values)
            .then(() => {
              props?.onFinish?.(values);
              resolve(true);
            })
            .catch(reject);
        });
      }}
    >
      <ProFormTextArea label="意见" name="opinion" />
    </ModalForm>
  );
}
