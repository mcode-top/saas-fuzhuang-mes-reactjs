import { fetchOrderContractProcessList } from '@/apis/business/order-manage/order-process';
import type { OrderContractProcessType } from '@/apis/business/order-manage/order-process/typing';
import { OrderContractTypeValueEnum } from '@/configs/commValueEnum';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu } from 'antd';
import { useRef } from 'react';
import { useLocation } from 'umi';
import OrderProcessAddModal from './components/OrderProcessAddModal';
import OrderProcessLogTableModal from './components/OrderProcessLogTableModal';

const OrderContractProcess: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  const columns: ProColumns<OrderContractProcessType>[] = [
    {
      title: '合同单号',
      dataIndex: 'contractNumber',
    },
    {
      title: '流程状态',
      dataIndex: 'status',
      valueEnum: OrderContractTypeValueEnum.Process,
    },
    ...COM_PRO_TABLE_TIME.updatedAt,
    ...COM_PRO_TABLE_TIME.createdAt,

    {
      title: '操作',
      width: 140,
      hideInSearch: true,
      key: 'operation',
      render(dom, entity, index, action, schema) {
        return (
          <Dropdown
            key="Dropdown"
            trigger={['click']}
            overlay={
              <Menu
                key="menu"
                items={[
                  {
                    key: 'watch',
                    label: (
                      <OrderProcessLogTableModal processLog={entity.processLog}>
                        <div onClick={() => {}}>查看流程记录</div>
                      </OrderProcessLogTableModal>
                    ),
                  },
                  {
                    key: 'modfiy',
                    label: (
                      <OrderProcessAddModal
                        onFinish={() => actionRef.current?.reload()}
                        contractNumber={entity.contractNumber}
                      >
                        <div onClick={() => {}}>填写流程记录</div>
                      </OrderProcessAddModal>
                    ),
                  },
                ].filter((item) => {
                  return true;
                })}
              />
            }
          >
            <Button icon={<SettingOutlined />} type="link">
              更多操作
            </Button>
          </Dropdown>
        );
      },
    },
  ];
  return (
    <ProTable
      columns={columns}
      rowKey="contractNumber"
      headerTitle="流程记录"
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchOrderContractProcessList);
      }}
    />
  );
};
export default OrderContractProcess;