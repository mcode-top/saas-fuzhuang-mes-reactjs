import {
  fetchCreateCustomerAddress,
  fetchCreateCustomerCompany,
  fetchCreateCustomerContacter,
  fetchUpdateCustomerAddress,
  fetchUpdateCustomerContacter,
} from '@/apis/business/customer';
import type { BusCustomerAddressType } from '@/apis/business/customer/typing';

import { CustomerCompanyValueEnum } from '@/configs/commValueEnum';
import {
  ModalForm,
  ProFormGroup,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRef } from 'react';

const BusCustomerAddressModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: Partial<BusCustomerAddressType>;
  };
  title: string;
  onFinish?: (value: BusCustomerAddressType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();

        if (props.node.type === 'create') {
          await fetchCreateCustomerAddress({ ...(props.node.value || {}), ...value });
        } else if (props.node.type === 'update') {
          await fetchUpdateCustomerAddress({ ...(props.node.value || {}), ...value });
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
    <ModalForm<BusCustomerAddressType>
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
      <ProFormGroup>
        <ProFormText
          label="收货人姓名"
          disabled={disabled}
          rules={[{ required: true }]}
          name="name"
        />

        <ProFormText
          label="收货人电话"
          rules={[{ required: true }, { len: 11, message: '手机号必须是11位' }]}
          disabled={disabled}
          name="phone"
        />
      </ProFormGroup>

      <ProFormTextArea
        label="收货地址"
        rules={[{ required: true }]}
        disabled={disabled}
        name="address"
      />
      <ProFormTextArea label="备注描述" disabled={disabled} name="remark" />
    </ModalForm>
  );
};
export default BusCustomerAddressModal;
