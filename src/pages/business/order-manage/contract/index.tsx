import { BusCustomerTypeEnum } from '@/apis/business/customer/typing';
import { fetchContractList, fetchRemoveContract } from '@/apis/business/order-manage/contract';
import type { BusOrderContract } from '@/apis/business/order-manage/contract/typing';
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
import { useLocation, useModel } from 'umi';
import type { ContractLocationQuery } from './typing';

function gotoContractInfo(query: ContractLocationQuery) {
  window.tabsAction.goBackTab(
    `/order-manage/info-contract?type=${query.type}${
      query.contractNumber ? `&contractNumber=${query.contractNumber}` : ''
    }${query.infoTitle ? `&_systemTabName=${query.infoTitle}` : ''}`,
    undefined,
    true,
  );
}
const OrderContract: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  const { initialState, setInitialState } = useModel('@@initialState');
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
      title: '订单类型',
      width: 80,
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
      width: 150,
      hideInSearch: true,
    },
    {
      title: '交期时间',
      dataIndex: 'deliverDate',
      key: 'deliverDate',
      valueType: 'dateRange',
      width: 150,
      hideInTable: true,
    },
    ...COM_PRO_TABLE_TIME.updatedAt,
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
                      processRecall(entity.processId).then((res) => {
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
                  const isOperator = initialState?.currentUser?.id === entity.process?.operatorId;
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
                      entity.process?.runningTask?.type === ActTaskModelTypeEnum.Approve
                    );
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
          </Button>,
        ];
      }}
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchContractList);
      }}
    />
  );
};
export default OrderContract;
