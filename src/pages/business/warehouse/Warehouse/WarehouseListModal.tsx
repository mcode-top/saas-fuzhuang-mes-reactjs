import SelectSystemPersonButton from '@/components/Comm/FormlyComponents/SelectSystemPersonButton';
import { STORAGE_MATERIAL_LIST, STORAGE_WORK_PROCESS_LIST } from '@/configs/storage.config';
import { arrayAttributeChange, arrayToObject } from '@/utils';
import storageDataSource from '@/utils/storage';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormMoney } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import ProForm, { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { WarehouseEnumValueEnum } from '@/configs/commValueEnum';

import { debounce, throttle } from 'lodash';
import type { BusWarehouseType } from '@/apis/business/warehouse/typing';
import { fetchCreateWarehouse, fetchUpdateWarehouse } from '@/apis/business/warehouse';

const WarehouseListModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: BusWarehouseType;
  };
  title: string;
  onFinish?: (value: BusWarehouseType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        if (props.node.type === 'create') {
          await fetchCreateWarehouse({ ...value });
        } else if (props.node.type === 'update') {
          await fetchUpdateWarehouse({ ...(props.node?.value || {}), ...value });
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
    <ModalForm<BusWarehouseType>
      width={800}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();

        formRef.current?.setFieldsValue({
          ...props.node.value,
        });
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <ProForm.Group>
        <ProFormText
          label="仓库名称"
          disabled={disabled}
          rules={[{ required: true }]}
          name="name"
        />
        <ProFormText
          label="仓库编码"
          disabled={disabled}
          rules={[{ required: true }]}
          name="code"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          valueEnum={WarehouseEnumValueEnum.WarehouseType}
          label="仓库类型"
          help="如果仓库为成品仓库则进支持存放类型为成品的物料,材料同理,混合表示通用"
          disabled={disabled}
          rules={[{ required: true }]}
          name="type"
        />
        <ProFormText
          fieldProps={{ type: 'number' }}
          disabled={disabled}
          label="货架最大数量"
          name="maxCapacity"
        />
      </ProForm.Group>
      <ProFormText label="仓库位置" disabled={disabled} name="position" />

      <ProFormTextArea label="备注信息" disabled={disabled} name="remark" />
    </ModalForm>
  );
};

export default WarehouseListModal;
