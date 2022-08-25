import {
  fetchCreateWorkProcess,
  fetchUpdateWorkProcess,
} from '@/apis/business/techology-manage/work-process';
import SelectSystemPersonButton from '@/components/Comm/FormlyComponents/SelectSystemPersonButton';
import { STORAGE_STATION_LIST } from '@/configs/storage.config';
import { arrayAttributeChange } from '@/utils';
import storageDataSource from '@/utils/storage';
import { ProFormInstance, ProFormSelect } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import { useRef } from 'react';
import type { BusWorkProcessType } from './typing';

const WorkProcessTableModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: BusWorkProcessType;
  };
  title: string;
  onFinish?: (value: BusWorkProcessType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        value.userList = value?.userList?.userIds;

        if (props.node.type === 'create') {
          await fetchCreateWorkProcess(value);
        } else if (props.node.type === 'update') {
          await fetchUpdateWorkProcess({ ...(props.node?.value || {}), ...value });
        }
        props?.onFinish?.(value);
        resolve(true);
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        reject(false);
      }
    });
  }
  const disabled = props.node.type === 'watch';
  return (
    <ModalForm<BusWorkProcessType>
      width={500}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
        formRef.current?.setFieldsValue(props.node.value);
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <ProFormText label="工序名称" disabled={disabled} rules={[{ required: true }]} name="name" />
      <ProFormSelect
        label="绑定工位"
        disabled={disabled}
        name="stationId"
        request={async () => {
          return arrayAttributeChange(
            (await storageDataSource.getValue(STORAGE_STATION_LIST)).data,
            [
              ['id', 'value'],
              ['name', 'label'],
            ],
          );
        }}
      />
      <ProFormTextArea label="备注信息" disabled={disabled} name="remark" />
    </ModalForm>
  );
};
export default WorkProcessTableModal;
