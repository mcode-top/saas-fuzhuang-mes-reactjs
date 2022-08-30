import { fetchCreateCustomerCompany } from '@/apis/business/customer';
import type { BusCustomerCompanyType } from '@/apis/business/customer/typing';

import { CustomerCompanyValueEnum } from '@/configs/commValueEnum';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRef } from 'react';

const BusCustomerCompanyModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: BusCustomerCompanyType;
  };
  title: string;
  onFinish?: (value: BusCustomerCompanyType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();

        if (props.node.type === 'create') {
          await fetchCreateCustomerCompany(value);
        } else if (props.node.type === 'update') {
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
    <ModalForm<BusCustomerCompanyType>
      width={700}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
        formRef.current?.setFieldsValue(props.node.value);
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <ProFormGroup>
        <ProFormText
          label="公司名称"
          disabled={disabled}
          rules={[{ required: true }]}
          name="name"
        />

        <ProFormText label="公司电话" disabled={disabled} name="phone" />
        <ProFormSelect
          label="公司类型"
          disabled={disabled}
          rules={[{ required: true }]}
          valueEnum={CustomerCompanyValueEnum.Type}
          name="type"
        />
      </ProFormGroup>
      <ProFormTextArea label="公司地址" disabled={disabled} name="address" />
      <ProFormTextArea label="备注描述" disabled={disabled} name="remark" />
    </ModalForm>
  );
};
export default BusCustomerCompanyModal;
