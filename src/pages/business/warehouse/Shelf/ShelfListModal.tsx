import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import React, { useRef } from 'react';

import type { BusWarehouseShelfType } from '@/apis/business/warehouse/typing';
import { fetchCreateWarehouseShelf, fetchUpdateWarehouseShelf } from '@/apis/business/warehouse';

/**@name 货架增改查对话框 */
const ShelfListModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: Partial<BusWarehouseShelfType>;
  };
  title: string;
  onFinish?: (value: BusWarehouseShelfType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        if (props.node.type === 'create') {
          await fetchCreateWarehouseShelf({ ...(props.node?.value || {}), ...value });
        } else if (props.node.type === 'update') {
          await fetchUpdateWarehouseShelf({ ...(props.node?.value || {}), ...value });
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
    <ModalForm<BusWarehouseShelfType>
      width={500}
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
          label="货架名称"
          disabled={disabled}
          rules={[{ required: true }]}
          name="name"
        />
        <ProFormText
          label="货架编码"
          disabled={disabled}
          rules={[{ required: true }]}
          name="code"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          fieldProps={{ type: 'number' }}
          disabled={disabled}
          label="货架容量"
          name="maxCapacity"
        />
        <ProFormText label="货架位置" disabled={disabled} name="position" />
      </ProForm.Group>

      <ProFormTextArea label="备注信息" disabled={disabled} name="remark" />
    </ModalForm>
  );
};

export default ShelfListModal;
