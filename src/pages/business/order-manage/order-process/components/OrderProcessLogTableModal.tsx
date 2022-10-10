import { fetchOrderContractProcessAdd } from '@/apis/business/order-manage/order-process';
import type { ContractProcessLog } from '@/apis/business/order-manage/order-process/typing';
import { ContractProcessEnum } from '@/apis/business/order-manage/order-process/typing';
import { OrderContractTypeValueEnum as BusOrderContractTypeValueEnum } from '@/configs/commValueEnum';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import { Table } from 'antd';
import { useRef } from 'react';

const OrderProcessLogTableModal: React.FC<{
  processLog: ContractProcessLog[];
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  return (
    <ModalForm width={700} title={'查看流程记录'} formRef={formRef} trigger={props.children}>
      <Table
        rowKey={'createdAt'}
        dataSource={props.processLog}
        size="small"
        pagination={{ size: 'small' }}
        columns={[
          {
            title: '记录内容',
            dataIndex: 'message',
          },
          {
            title: '流程状态',
            dataIndex: 'status',
            render(value, record, index) {
              return BusOrderContractTypeValueEnum.Process.get(value)?.text;
            },
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            defaultSortOrder: 'descend',
            sorter: (a, b) => {
              console.log(new Date(a.createdAt).getTime());
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            },
          },
        ]}
      />
    </ModalForm>
  );
};
export default OrderProcessLogTableModal;
