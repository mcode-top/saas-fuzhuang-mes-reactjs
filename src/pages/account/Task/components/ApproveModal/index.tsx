import { processApproveTask } from '@/apis/process/process';
import type { ActTask, ApproveTaskDto } from '@/apis/process/typings';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormRadio, ProFormTextArea } from '@ant-design/pro-form';
import { Button } from 'antd';
import { useRef } from 'react';

/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-18 10:52:28
 * @Description: 审批任务
 */
export default function ApproveModal(props: {
  task: ActTask;
  onFinish?: (values: ApproveTaskDto) => void;
}) {
  const formRef = useRef<ProFormInstance<ApproveTaskDto> | undefined>();
  return (
    <ModalForm<ApproveTaskDto>
      width={500}
      title={`审批[${props.task?.process?.name}]`}
      onVisibleChange={(visible) => {
        formRef.current?.resetFields();
        if (visible) {
          formRef.current?.setFieldValue('isAgree', true);
        }
      }}
      trigger={
        <Button type="link" onClick={() => {}}>
          审批
        </Button>
      }
      formRef={formRef}
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
      <ProFormRadio.Group
        label="审批结果"
        options={[
          {
            label: '同意',
            value: true,
          },
          {
            label: '驳回',
            value: false,
          },
        ]}
        rules={[{ required: true }]}
        fieldProps={{ defaultValue: false }}
        name="isAgree"
      />
    </ModalForm>
  );
}
