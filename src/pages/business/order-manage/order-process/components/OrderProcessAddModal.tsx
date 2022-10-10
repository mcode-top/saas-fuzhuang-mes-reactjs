import { fetchOrderContractProcessAdd } from '@/apis/business/order-manage/order-process';
import { ContractProcessEnum } from '@/apis/business/order-manage/order-process/typing';
import { OrderContractTypeValueEnum as BusOrderContractTypeValueEnum } from '@/configs/commValueEnum';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import { useRef } from 'react';

const OrderProcessAddModal: React.FC<{
  contractNumber: string;
  onFinish?: () => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        await fetchOrderContractProcessAdd({ ...value, contractNumber: props.contractNumber });
        props?.onFinish?.();
        resolve(true);
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        reject(false);
      }
    });
  }
  return (
    <ModalForm
      width={500}
      title={'填写流程记录'}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <ProFormTextArea label="记录内容" name="message" />
      <ProFormSelect
        label="记录状态"
        rules={[{ required: true }]}
        name="status"
        initialValue={ContractProcessEnum.Running}
        valueEnum={BusOrderContractTypeValueEnum.Process}
      />
    </ModalForm>
  );
};
export default OrderProcessAddModal;
