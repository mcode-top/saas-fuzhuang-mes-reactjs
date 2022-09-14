import SelectSystemPersonButton from '@/components/Comm/FormlyComponents/SelectSystemPersonButton';
import { STORAGE_MATERIAL_LIST, STORAGE_WORK_PROCESS_LIST } from '@/configs/storage.config';
import { arrayAttributeChange, arrayToObject } from '@/utils';
import storageDataSource from '@/utils/storage';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormMoney } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import ProForm, { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import type { BusMaterialType } from './typing';
import { BusMaterialTypeEnum } from './typing';
import { MaterialValueEnum } from '@/configs/commValueEnum';
import {
  fetchCreateMaterial,
  fetchNameListMaterial,
  fetchUpdateMaterial,
} from '@/apis/business/techology-manage/material';
import { debounce, throttle } from 'lodash';
import BusMaterialSelect from './components/MaterialSelect';

const MaterialTableModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: BusMaterialType;
  };
  title: string;
  onFinish?: (value: BusMaterialType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        if (props.node.type === 'create') {
          await fetchCreateMaterial({ ...value });
        } else if (props.node.type === 'update') {
          await fetchUpdateMaterial({ ...(props.node?.value || {}), ...value });
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
    <ModalForm<BusMaterialType>
      width={800}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();

        formRef.current?.setFieldsValue({
          ...props.node.value,
          codes: props.node.value?.codes ? props.node.value?.codes : [],
        });
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <ProForm.Group>
        <ProFormText
          label="物料编码"
          disabled={disabled || props.node.type === 'update'}
          rules={[
            { required: true },
            {
              message: '物料编码字符大于4个',
              validator: (rule, value, callback) => {
                if (value.length < 4) {
                  callback('物料编码字符必须大于4个');
                } else {
                  callback();
                }
              },
            },
          ]}
          name="code"
        />
        <ProFormText
          label="物料名称"
          disabled={disabled}
          rules={[{ required: true }]}
          name="name"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          valueEnum={MaterialValueEnum.Type}
          label="物料类型"
          disabled={disabled}
          rules={[{ required: true }]}
          name="type"
        />
        <ProFormText
          label="计量单位"
          disabled={disabled}
          rules={[{ required: true }]}
          name="unit"
        />
        <ProFormMoney
          label="单价"
          fieldProps={{ precision: 4 }}
          disabled={disabled}
          name="price"
          min={0}
        />
      </ProForm.Group>

      <BusMaterialSelect
        multiple={true}
        label="物料编码组合列表"
        help="仅支持添加物料类型为材料的物料编码"
        disabled={disabled}
        materialType={BusMaterialTypeEnum.Material}
        name="codes"
      />
      <ProFormTextArea label="备注信息" disabled={disabled} name="remark" />
    </ModalForm>
  );
};

export default MaterialTableModal;
