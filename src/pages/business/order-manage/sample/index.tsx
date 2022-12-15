import { BusCustomerTypeEnum } from '@/apis/business/customer/typing';
import {
  fetchApproveContract,
  fetchConfirmCollectionContract,
  fetchContractList,
  fetchRemoveContract,
  fetchSamplePageList,
} from '@/apis/business/order-manage/contract';
import type { BusOrderContract } from '@/apis/business/order-manage/contract/typing';
import { BusOrderTypeEnum } from '@/apis/business/order-manage/contract/typing';
import { fetchOrderRecall } from '@/apis/business/order-manage/order-process';
import { ApiMethodEnum } from '@/apis/person/typings';
import { processRecall } from '@/apis/process/process';
import { ActTaskModelTypeEnum } from '@/apis/process/typings';
import {
  CustomerCompanyValueEnum,
  dictValueEnum,
  OrderContractTypeValueEnum,
  ProcessValueEnum,
} from '@/configs/commValueEnum';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import ReviewProcess from '@/pages/account/Task/components/ReviewProcess';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, Modal, Tag } from 'antd';
import React, { useRef } from 'react';
import { Access, useAccess, useLocation, useModel } from 'umi';
import OrderCollectionSlipAddLog from '../collection-slip/components/OrderCollectionSlipAddLog';
import { gotoContractInfo } from '../contract';
import type { SampleSendLocationQuery } from './typing';
/**@name 跳转寄样单 */
export function gotoSampleSendInfo(query: SampleSendLocationQuery) {
  const url = '/order-manage/sample-info-send';
  window.tabsAction.goBackTab(
    `${url}?type=${query.type}${
      query.contractNumber ? `&contractNumber=${query.contractNumber}` : ''
    }${query.infoTitle ? `&_systemTabName=${query.infoTitle}` : ''}${
      query.orderType ? `&orderType=${query.orderType}` : ''
    }`,
    undefined,
    true,
  );
}
const OrderSample: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  const { initialState } = useModel('@@initialState');
  const access = useAccess();

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
  const columns: ProColumns<BusOrderContract>[] = [
    {
      title: '订单单号',
      dataIndex: 'contractNumber',
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      valueEnum: OrderContractTypeValueEnum.OrderType,
    },
    {
      title: '客户类型',
      hideInSearch: true,
      dataIndex: 'company-type',
      width: 80,
      render(dom, entity, index, action, schema) {
        return (
          <Tag color={entity.company?.type === BusCustomerTypeEnum.VIP ? '#ffc53d' : '#1890ff'}>
            {dictValueEnum(CustomerCompanyValueEnum.Type, entity.company?.type)}
          </Tag>
        );
      },
    },
    {
      title: '客户公司',
      dataIndex: 'company-name',
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return entity.company?.name;
      },
    },
    {
      title: '流程状态',
      dataIndex: 'process.status',
      valueEnum: ProcessValueEnum.ActProcessStatusEnum,
      width: 100,
      fieldProps: { mode: 'multiple' },
      renderText: (t, record) => record.process?.status,
    },
    {
      title: '当前任务进度',
      dataIndex: 'process.runningTask.name',
      width: 100,
      hideInSearch: true,
      renderText: (t, record) => record.process?.runningTask?.name,
    },
    {
      title: '跟进人',
      hideInSearch: true,
      dataIndex: 'process.operator.name',
      renderText: (t, record) => record.process?.operator?.name,
    },
    {
      title: '当前执行人',
      hideInSearch: true,
      dataIndex: 'approveUser',
      renderText: (t, record) => {
        return (record as any)?.approveUser?.name;
      },
    },
    {
      title: '交期时间',
      dataIndex: 'deliverDate',
      key: 'deliverDate-table',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '交期时间',
      dataIndex: 'deliverDate',
      key: 'deliverDate',
      valueType: 'dateRange',
      hideInTable: true,
    },
    ...COM_PRO_TABLE_TIME.createdAt,
    {
      title: '备注信息',
      ellipsis: true,
      dataIndex: 'remark',
    },
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
                  ...orderTypeToMenuItem(entity, entity.type),
                  {
                    key: 'cashier',
                    label: (
                      <OrderCollectionSlipAddLog
                        title="添加收款记录"
                        type="update"
                        onFinish={async () => {
                          await fetchConfirmCollectionContract(entity.contractNumber);
                          actionRef.current?.reload();
                        }}
                        contractNumber={entity.contractNumber}
                      >
                        <div>确认收款记录</div>
                      </OrderCollectionSlipAddLog>
                    ),
                  },

                  {
                    key: 'recall',
                    label: <div>撤回合同单</div>,
                    onClick: () => {
                      fetchOrderRecall(entity.contractNumber, entity.processId).then((res) => {
                        action?.reload();
                      });
                    },
                  },
                  {
                    key: 'remove',
                    label: <div>删除合同单</div>,
                    onClick: () => {
                      Modal.confirm({
                        title: '删除合同单',
                        content: `您确定要删除[${entity.contractNumber}]合同单吗?`,
                        onOk: () => {
                          return fetchRemoveContract(entity.contractNumber).then((res) => {
                            action?.reload();
                          });
                        },
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
                  if (item.key === 'recall') {
                    return (
                      isOperator &&
                      entity.process?.runningTask?.type === ActTaskModelTypeEnum.Approve
                    );
                  } else if (item.key === 'modify') {
                    return (
                      entity.process?.runningTask?.type === ActTaskModelTypeEnum.Start && isOperator
                    );
                  } else if (item.key === 'remove') {
                    return (
                      entity.process?.runningTask?.type === ActTaskModelTypeEnum.Start && isOperator
                    );
                  } else if (item.key === 'approve') {
                    return (
                      (entity as any)?.approveUser?.id === initialState?.currentUser?.id &&
                      entity.process?.runningTask?.type === ActTaskModelTypeEnum.Approve &&
                      // 出纳确认与正常审核流程不相同,所以要单独分开
                      entity.process?.runningTask?.name !== '出纳确认收支'
                    );
                  } else if (item.key === 'cashier') {
                    // 出纳确认与正常审核流程不相同,暂定出纳的taskModelId为 2
                    return (
                      (entity as any)?.approveUser?.id === initialState?.currentUser?.id &&
                      entity.process?.runningTask?.name === '出纳确认收支'
                    );
                  } else if (item.key === 'watch') {
                    return isOperator || entity.process?.runningTask?.taskModelId !== '2';
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
      columns={columns}
      rowKey="contractNumber"
      headerTitle="样品单列表"
      actionRef={actionRef}
      toolBarRender={(action: ActionType | undefined) => {
        return [
          <Access accessible={access.checkShowAuth('/contract', ApiMethodEnum.POST)} key="create">
            <Button
              type="primary"
              key="create-sample-proofing"
              onClick={() => {
                gotoContractInfo({
                  type: 'create',
                  infoTitle: `创建打样单`,
                  orderType: BusOrderTypeEnum.SampleProofing,
                });
              }}
            >
              创建打样单
            </Button>
          </Access>,
          <Access accessible={access.checkShowAuth('/contract', ApiMethodEnum.POST)} key="create1">
            <Button
              type="primary"
              key="create-sample-send"
              onClick={() => {
                gotoSampleSendInfo({
                  type: 'create',
                  infoTitle: `创建寄样单-送样`,
                  orderType: BusOrderTypeEnum.SampleSend,
                });
              }}
            >
              创建寄样单-送样
            </Button>
          </Access>,
          <Access accessible={access.checkShowAuth('/contract', ApiMethodEnum.POST)} key="create2">
            <Button
              type="primary"
              key="create-sample-charge"
              onClick={() => {
                gotoSampleSendInfo({
                  type: 'create',
                  infoTitle: `创建寄样单-收费`,
                  orderType: BusOrderTypeEnum.SampleCharge,
                });
              }}
            >
              创建寄样单-收费
            </Button>
          </Access>,
        ];
      }}
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchSamplePageList);
      }}
    />
  );
};
export default OrderSample;

/**@name 通过订单类型获取相应的菜单 */
function orderTypeToMenuItem(entity: BusOrderContract, orderType: BusOrderTypeEnum) {
  if (orderType === BusOrderTypeEnum.SampleProofing) {
    return [
      {
        key: 'watch',
        label: (
          <div
            onClick={() => {
              gotoContractInfo({
                type: 'watch',
                infoTitle: `查看样品单-${entity.contractNumber}`,
                contractNumber: entity.contractNumber,
                orderType: BusOrderTypeEnum.SampleProofing,
              });
            }}
          >
            查看打样单
          </div>
        ),
      },
      {
        key: 'modify',
        label: (
          <div
            onClick={() => {
              gotoContractInfo({
                type: 'update',
                infoTitle: `修改样品单-${entity.contractNumber}`,
                contractNumber: entity.contractNumber,
                orderType: BusOrderTypeEnum.SampleProofing,
              });
            }}
          >
            修改打样单
          </div>
        ),
      },
      {
        key: 'approve',
        label: (
          <div
            onClick={() => {
              gotoContractInfo({
                type: 'approve',
                infoTitle: `审批样品单-${entity.contractNumber}`,
                contractNumber: entity.contractNumber,
                orderType: BusOrderTypeEnum.SampleProofing,
              });
            }}
          >
            审批打样单
          </div>
        ),
      },
    ];
  } else if (
    orderType === BusOrderTypeEnum.SampleCharge ||
    orderType === BusOrderTypeEnum.SampleSend
  ) {
    return [
      {
        key: 'watch',
        label: (
          <div
            onClick={() => {
              gotoSampleSendInfo({
                type: 'watch',
                infoTitle: `查看寄样单-${entity.contractNumber}`,
                contractNumber: entity.contractNumber,
                orderType: orderType,
              });
            }}
          >
            查看寄样单
          </div>
        ),
      },
      {
        key: 'modify',
        label: (
          <div
            onClick={() => {
              gotoSampleSendInfo({
                type: 'update',
                infoTitle: `修改寄样单-${entity.contractNumber}`,
                contractNumber: entity.contractNumber,
                orderType: orderType,
              });
            }}
          >
            修改寄样单
          </div>
        ),
      },
      {
        key: 'approve',
        label: (
          <div
            onClick={() => {
              gotoSampleSendInfo({
                type: 'approve',
                infoTitle: `审批寄样单-${entity.contractNumber}`,
                contractNumber: entity.contractNumber,
                orderType: orderType,
              });
            }}
          >
            审批寄样单
          </div>
        ),
      },
    ];
  } else {
    return [];
  }
}
