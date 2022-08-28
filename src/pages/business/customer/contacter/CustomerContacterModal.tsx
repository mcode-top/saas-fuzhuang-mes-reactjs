import {
  fetchCreateCustomerCompany,
  fetchCreateCustomerContacter,
  fetchUpdateCustomerContacter,
} from '@/apis/business/customer';
import type { BusCustomerContacterType } from '@/apis/business/customer/typing';

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

const BusCustomerContacterModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: Partial<BusCustomerContacterType>;
  };
  title: string;
  onFinish?: (value: BusCustomerContacterType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();

        if (props.node.type === 'create') {
          await fetchCreateCustomerContacter({ ...(props.node.value || {}), ...value });
        } else if (props.node.type === 'update') {
          await fetchUpdateCustomerContacter({ ...(props.node.value || {}), ...value });
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
    <ModalForm<BusCustomerContacterType>
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
          label="联系人姓名"
          disabled={disabled}
          rules={[{ required: true }]}
          name="name"
        />

        <ProFormText
          label="联系人电话"
          rules={[{ required: true }, { len: 11, message: '手机号必须是11位' }]}
          disabled={disabled}
          name="phone"
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText label="联系人部门" disabled={disabled} name="dept" />
        <ProFormText label="联系人职称" disabled={disabled} name="role" />
      </ProFormGroup>
      <ProFormTextArea label="备注描述" disabled={disabled} name="remark" />
    </ModalForm>
  );
};
export default BusCustomerContacterModal;
