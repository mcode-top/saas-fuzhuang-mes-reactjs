import { processApproveTask } from '@/apis/process/process';
import type { ActTask } from '@/apis/process/typings';
import ProForm, {
  ModalForm,
  ProFormSwitch,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import { Button, Form, Input, Modal } from 'antd';
import React from 'react';

type ApproveModalParam = { opinion?: string; isAgree: boolean };
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-18 10:52:28
 * @Description: 审批任务
 */
export default function ApproveModal(props: {
  task: ActTask;
  onFinish?: (values: ApproveModalParam) => void;
}) {
  return (
    <ModalForm<ApproveModalParam>
      width={500}
      title={`审批[${props.task?.process?.name}]`}
      trigger={
        <Button type="link" onClick={() => {}}>
          审批
        </Button>
      }
      onFinish={(values): Promise<boolean> => {
        return new Promise((resolve, reject) => {
          processApproveTask(props.task.id, values)
            .then(() => {
              props?.onFinish?.(values);
              resolve(true);
            })
            .catch(reject);
        });
      }}
    >
      <ProFormTextArea label="审批意见" name="opinion" />
      <ProFormSwitch label="是否同意" rules={[{ required: true }]} name="isAgree" />
    </ModalForm>
  );
}
