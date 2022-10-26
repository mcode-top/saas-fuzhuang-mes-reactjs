import { fetchOrderCollectionSlipList } from '@/apis/business/order-manage/collection-slip';
import type { BusOrderContractCollectionSlip } from '@/apis/business/order-manage/collection-slip/typing';
import { fetchOrderContractProcessList } from '@/apis/business/order-manage/order-process';
import type { OrderContractProcessType } from '@/apis/business/order-manage/order-process/typing';
import { OrderContractTypeValueEnum } from '@/configs/commValueEnum';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import { ProFormDigitRange } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu } from 'antd';
import { useRef } from 'react';
import { useLocation } from 'umi';
import OrderCollectionSlipAddLog from './components/OrderCollectionSlipAddLog';

const OrderCollectionSlip: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  const columns: ProColumns<BusOrderContractCollectionSlip>[] = [
    {
      title: '合同单号',
      dataIndex: 'contractNumber',
    },
    {
      title: '公司名称',
      dataIndex: 'company',
      hideInSearch: true,
      renderText(text, record, index, action) {
        return record.contract?.company?.name;
      },
    },
    {
      title: '收款状态',
      dataIndex: 'status',
      valueEnum: OrderContractTypeValueEnum.CollectionSlip,
    },
    {
      title: '合同总金额',
      dataIndex: 'totalAmount',
      renderFormItem: () => {
        return <ProFormDigitRange placeholder="查询合同总金额范围" />;
      },
    },
    {
      title: '已收款金额',
      dataIndex: 'collectionAmount',
      renderFormItem: () => {
        return <ProFormDigitRange placeholder="查询合同总金额范围" />;
      },
    },
    {
      title: '未付款金额',
      dataIndex: 'unCollection',
      renderText(text, record, index, action) {
        return record.totalAmount - record.collectionAmount;
      },
      hideInSearch: true,
    },
    {
      title: '跟进人',
      dataIndex: 'operater',
      hideInSearch: true,
      renderText(text, record, index, action) {
        return record.contract?.process?.operator?.name;
      },
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
                    key: 'add',
                    label: (
                      <OrderCollectionSlipAddLog
                        title="添加收款记录"
                        type="update"
                        onFinish={() => {
                          console.log();

                          actionRef.current?.reload();
                        }}
                        contractNumber={entity.contractNumber}
                      >
                        <div>添加收款记录</div>
                      </OrderCollectionSlipAddLog>
                    ),
                  },
                  {
                    key: 'watch',
                    label: (
                      <OrderCollectionSlipAddLog
                        title="查看收款记录"
                        type="watch"
                        contractNumber={entity.contractNumber}
                      >
                        <div onClick={() => {}}>查看收款记录</div>
                      </OrderCollectionSlipAddLog>
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
      actionRef={actionRef}
      columns={columns}
      rowKey="contractNumber"
      headerTitle="收款单列表"
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchOrderCollectionSlipList);
      }}
    />
  );
};
export default OrderCollectionSlip;
