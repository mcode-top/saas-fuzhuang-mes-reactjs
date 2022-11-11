import {
  fetchCreateStation,
  fetchStationList,
  fetchUpdateStation,
  fetchWatchStation,
} from '@/apis/business/techology-manage/station';
import SelectSystemPersonButton from '@/components/Comm/FormlyComponents/SelectSystemPersonButton';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import { useRef, useState } from 'react';
import type { BusStationType } from './typing';

const StationTableModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: {
      stationId: number;
    };
  };
  title: string;
  onFinish?: (value: BusStationType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  function getStationValue(stationId: number) {
    return fetchWatchStation(stationId).then((res) => {
      const data = res.data;

      if (data?.userList && Array.isArray(data.userList)) {
        data.userList = { userIds: data?.userList?.map((u: any) => u.id) || [] } as any;
      }
      formRef.current?.setFieldsValue(data);
      return data;
    });
  }
  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        value.userList = value?.userList?.userIds;

        if (props.node.type === 'create') {
          await fetchCreateStation(value);
        } else if (props.node.type === 'update') {
          await fetchUpdateStation({ ...(props.node?.value || {}), ...value });
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
    <ModalForm<BusStationType>
      width={500}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
        if (v && props.node.value?.stationId) {
          getStationValue(props.node.value?.stationId);
        }
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <ProFormText label="工位名称" disabled={disabled} rules={[{ required: true }]} name="name" />
      <ProFormText label="工位设备" disabled={disabled} name="device" />

      <Form.Item label="绑定员工" name="userList">
        <SelectSystemPersonButton readOnly={disabled} showUser multiple />
      </Form.Item>
      <ProFormTextArea label="备注信息" disabled={disabled} name="remark" />
    </ModalForm>
  );
};
export default StationTableModal;
