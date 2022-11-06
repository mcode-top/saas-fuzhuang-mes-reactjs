import { fetchOrderDeliveryList } from '@/apis/business/order-manage/delivery';
import type { BusOrderDeliveryEntity } from '@/apis/business/order-manage/delivery/typing';
import { processRecall } from '@/apis/process/process';
import { ActProcessStatusEnum, ActTaskModelTypeEnum } from '@/apis/process/typings';
import { ProcessValueEnum } from '@/configs/commValueEnum';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import ReviewProcess from '@/pages/account/Task/components/ReviewProcess';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, Modal } from 'antd';
import { useRef } from 'react';
import { useLocation, useModel } from 'umi';
import OrderDeliveryInfo from './components/OrderDeliveryInfo';
export type DeliveryLocationQuery = {
  type: 'create' | 'watch' | 'approve' | 'update';
  contractNumber?: string;
  deliveryId?: number;
  infoTitle: string;
};
function gotoDeliveryInfo(query: DeliveryLocationQuery) {
  let url = `/order-manage/info-delivery?type=${query.type}&_systemTabName=${query.infoTitle}`;
  if (query.deliveryId) {
    url += `&deliveryId=${query.deliveryId}`;
  }
  if (query.contractNumber) {
    url += `&contractNumber=${query.contractNumber}`;
  }
  window.tabsAction.goBackTab(url, undefined, true);
}
/**@name 发货单表格 */
const OrderDelivery: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  const { initialState } = useModel('@@initialState');
  /**
   * 预览流程状态
   */
  function handleReviewProcess(processId: number) {
    Modal.info({
      width: 800,
      title: '预览流程状态',
      maskClosable: true,
      content: <ReviewProcess style={{ height: 600 }} processId={processId} />,
    });
  }
  const columns: ProColumns<BusOrderDeliveryEntity>[] = [
    {
      title: '订单单号',
      dataIndex: 'contractNumber',
    },
    {
      title: '客户公司',
      dataIndex: 'deliver.contract.company',
      hideInSearch: true,
      renderText(text, record, index, action) {
        return record.contract?.company?.name;
      },
    },
    {
      title: '物流公司',
      dataIndex: 'logisticsCompany',
    },
    {
      title: '快递单号',
      dataIndex: 'expressNumber',
    },
    {
      title: '收货地址',
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: '收货联系人',
      dataIndex: 'contact',
    },
    {
      title: '发货数量',
      dataIndex: 'deliverNumber',
      hideInSearch: true,
      renderText(text, record, index, action) {
        return record.goodsAndNumber?.reduce((p, n) => p + n.quantity, 0);
      },
    },
    {
      title: '流程状态',
      dataIndex: 'process.status',
      valueEnum: ProcessValueEnum.ActProcessStatusEnum,
      width: 100,
      fieldProps: { mode: 'multiple' },
      renderText: (t, record) => record.process?.status || ActProcessStatusEnum.Complete,
    },
    {
      title: '当前任务进度',
      dataIndex: 'process.runningTask.name',
      width: 100,
      hideInSearch: true,
      renderText: (t, record) => {
        console.log(t, record);

        return record.process?.runningTask?.name || '无需审批';
      },
    },
    {
      title: '当前执行人',
      hideInSearch: true,
      dataIndex: 'approveUser',
      renderText: (t, record) => {
        return (record as any)?.approveUser?.name || '无需审批';
      },
    },
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
                      <div
                        onClick={() => {
                          gotoDeliveryInfo({
                            type: 'watch',
                            infoTitle: '查看发货单-' + entity.contractNumber + '-' + entity.id,
                            contractNumber: entity.contractNumber,
                            deliveryId: entity.id,
                          });
                        }}
                      >
                        查看发货单
                      </div>
                    ),
                  },
                  {
                    key: 'approve',
                    label: (
                      <div
                        onClick={() => {
                          gotoDeliveryInfo({
                            type: 'approve',
                            infoTitle: '审核发货单-' + entity.contractNumber + '-' + entity.id,
                            contractNumber: entity.contractNumber,
                            deliveryId: entity.id,
                          });
                        }}
                      >
                        审核发货单
                      </div>
                    ),
                  },
                  {
                    key: 'modify',
                    label: (
                      <div
                        onClick={() => {
                          gotoDeliveryInfo({
                            type: 'update',
                            infoTitle: '修改发货单-' + entity.contractNumber + '-' + entity.id,
                            contractNumber: entity.contractNumber,
                            deliveryId: entity.id,
                          });
                        }}
                      >
                        修改发货单
                      </div>
                    ),
                  },
                  {
                    key: 'recall',
                    label: <div>撤回发货单</div>,
                    onClick: () => {
                      processRecall(entity.processId).then((res) => {
                        action?.reload();
                      });
                    },
                  },
                  {
                    key: 'review',
                    label: <div>预览流程图</div>,
                    onClick: () => {
                      handleReviewProcess(entity.processId as number);
                    },
                  },
                ].filter((item) => {
                  const isOperator =
                    initialState?.currentUser?.id === entity.process?.operatorId ||
                    initialState?.currentUser?.isAdmin;

                  if (item.key === 'approve') {
                    return (
                      (entity as any)?.approveUser?.id === initialState?.currentUser?.id &&
                      entity.process?.runningTask?.type === ActTaskModelTypeEnum.Approve
                    );
                  } else if (item.key === 'recall') {
                    return (
                      isOperator &&
                      entity.process?.runningTask?.type === ActTaskModelTypeEnum.Approve
                    );
                  } else if (item.key === 'modify') {
                    return (
                      (entity.process?.runningTask?.type === ActTaskModelTypeEnum.Start &&
                        isOperator) ||
                      !entity.processId
                    );
                  } else if (item.key === 'review') {
                    console.log(entity.processId, 'entity.processId');

                    return entity.processId;
                  }
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
      rowKey="id"
      toolBarRender={(action: ActionType | undefined) => {
        return [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              gotoDeliveryInfo({ type: 'create', infoTitle: '创建发货单' });
            }}
          >
            创建发货单
          </Button>,
        ];
      }}
      headerTitle="发货单列表"
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchOrderDeliveryList);
      }}
    />
  );
};
export default OrderDelivery;
