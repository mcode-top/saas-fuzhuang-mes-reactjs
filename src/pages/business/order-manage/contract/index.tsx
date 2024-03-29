import { BusCustomerTypeEnum } from '@/apis/business/customer/typing';
import {
  fetchConfirmCollectionContract,
  fetchContractList,
  fetchRemoveContract,
} from '@/apis/business/order-manage/contract';
import type { BusOrderContract } from '@/apis/business/order-manage/contract/typing';
import { BusOrderTypeEnum } from '@/apis/business/order-manage/contract/typing';
import { fetchOrderRecall } from '@/apis/business/order-manage/order-process';
import { ApiMethodEnum } from '@/apis/person/typings';
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
import { Button, DatePicker, Dropdown, Menu, Modal, Tag } from 'antd';
const { RangePicker } = DatePicker;
import React, { useRef } from 'react';
import { Access, useAccess, useLocation, useModel } from 'umi';
import OrderCollectionSlipAddLog from '../collection-slip/components/OrderCollectionSlipAddLog';
import { PartToContractNumber } from '../delivery/components/OrderDeliveryInfo';
import type { ContractLocationQuery } from './typing';

/**@name 跳转合同单或打样单 */
export function gotoContractInfo(query: ContractLocationQuery) {
  const url =
    query.orderType !== BusOrderTypeEnum.SampleProofing
      ? '/order-manage/info-contract'
      : '/order-manage/sample-info-proofing';
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
const OrderContract: React.FC = () => {
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
      title: '合同单号',
      dataIndex: 'contractNumber',
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
      title: '订单类型',
      dataIndex: 'type',
      valueEnum: OrderContractTypeValueEnum.OrderType,
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
                  {
                    key: 'watch',
                    label: (
                      <div
                        onClick={() => {
                          gotoContractInfo({
                            type: 'watch',
                            infoTitle: `查看合同单-${entity.contractNumber}`,
                            contractNumber: entity.contractNumber,
                          });
                        }}
                      >
                        查看合同单
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
                            infoTitle: `修改合同单-${entity.contractNumber}`,
                            contractNumber: entity.contractNumber,
                          });
                        }}
                      >
                        修改合同单
                      </div>
                    ),
                  },
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
                    key: 'approve',
                    label: (
                      <div
                        onClick={() => {
                          gotoContractInfo({
                            type: 'approve',
                            infoTitle: `审批合同单-${entity.contractNumber}`,
                            contractNumber: entity.contractNumber,
                          });
                        }}
                      >
                        审批合同单
                      </div>
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
                      entity.process?.runningTask?.taskModelId !== '2'
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
      headerTitle="合同单列表"
      actionRef={actionRef}
      toolBarRender={(action: ActionType | undefined) => {
        return [
          <Access accessible={access.checkShowAuth('/contract', ApiMethodEnum.POST)} key="create">
            <Button
              type="primary"
              key="create"
              onClick={() => {
                gotoContractInfo({
                  type: 'create',
                  infoTitle: `创建新合同单`,
                });
              }}
            >
              创建合同单
            </Button>
          </Access>,
          <Access accessible={access.checkShowAuth('/contract', ApiMethodEnum.POST)} key="create">
            <Button
              key="add-order"
              onClick={() => {
                let contractNumber = '';
                Modal.confirm({
                  title: '请选择要追加订单的合同号',
                  width: 300,
                  content: (
                    <PartToContractNumber
                      orderType={[BusOrderTypeEnum.Normal, BusOrderTypeEnum.Add]}
                      onChange={(v) => {
                        contractNumber = v;
                      }}
                    />
                  ),
                  onOk: () => {
                    return new Promise((res, rej) => {
                      if (contractNumber) {
                        res(true);
                        gotoContractInfo({
                          type: 'watch',
                          orderType: BusOrderTypeEnum.Add,
                          infoTitle: `合同单${contractNumber}-追加订单`,
                          contractNumber,
                        });
                      } else {
                        rej(false);
                      }
                    });
                  },
                });
              }}
            >
              追加订单
            </Button>
          </Access>,
        ];
      }}
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchContractList);
      }}
    />
  );
};
export default OrderContract;
