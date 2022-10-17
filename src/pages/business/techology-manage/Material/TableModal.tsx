import SelectSystemPersonButton from '@/components/Comm/FormlyComponents/SelectSystemPersonButton';
import { STORAGE_MATERIAL_LIST, STORAGE_WORK_PROCESS_LIST } from '@/configs/storage.config';
import { arrayAttributeChange, arrayToObject } from '@/utils';
import storageDataSource from '@/utils/storage';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormDependency } from '@ant-design/pro-form';
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
import { Button, Space } from 'antd';
import type { ProductMaterialType } from './components/ProductMaterialModal';
import ProductMaterialModal from './components/ProductMaterialModal';
import { fetchMaterialToStyleDemandData } from '@/apis/business/order-manage/contract';

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
  /**@name 成衣内容 */
  const [product, setProduct] = useState<ProductMaterialType | null>(null);
  /**@name 如果是修改模式则需要检查成衣内容是否存在 */
  function getProductData() {
    console.log(
      props.node.type === 'update' && props.node.value,
      props.node.value,
      "props.node.type === 'update' && props.node.value",
    );

    if (props.node.type !== 'create' && props.node.value) {
      fetchMaterialToStyleDemandData(props.node.value.code)
        .then((res) => {
          setProduct(res.data?.styleDemandData || null);
        })
        .catch((err) => {
          console.error(err);
          setProduct(null);
        });
    }
  }
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
      modalProps={{ maskClosable: false }}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
        if (v) {
          getProductData();
          formRef.current?.setFieldsValue({
            ...props.node.value,
            codes: props.node.value?.codes ? props.node.value?.codes : [],
          });
        }
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
      <ProFormDependency name={['type', 'code']}>
        {({ type, code }) => {
          if (type === BusMaterialTypeEnum.Product && code?.length > 2) {
            return (
              <Space>
                {disabled ? null : (
                  <ProductMaterialModal
                    node={{ type: 'add', materialCode: code, value: product || undefined }}
                    title={`编辑成衣${code}内容`}
                  >
                    <Button>编辑成衣内容</Button>
                  </ProductMaterialModal>
                )}
                <ProductMaterialModal
                  node={{ type: 'watch', materialCode: code, value: product || undefined }}
                  title={`查看成衣${code}内容`}
                >
                  <Button>查看成衣内容</Button>
                </ProductMaterialModal>
              </Space>
            );
          } else {
            return null;
          }
        }}
      </ProFormDependency>
      <ProFormTextArea label="备注信息" disabled={disabled} name="remark" />
    </ModalForm>
  );
};

export default MaterialTableModal;
