import { BusCustomerTypeEnum } from '@/apis/business/customer/typing';
import { fetchContractList, fetchRemoveContract } from '@/apis/business/order-manage/contract';
import type { BusOrderContract } from '@/apis/business/order-manage/contract/typing';
import { fetchManufactureList } from '@/apis/business/order-manage/manufacture';
import type { BusOrderManufacture } from '@/apis/business/order-manage/manufacture/typing';
import { processRecall } from '@/apis/process/process';
import { ActTaskModelTypeEnum } from '@/apis/process/typings';
import { CustomerCompanyValueEnum, dictValueEnum, ProcessValueEnum } from '@/configs/commValueEnum';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import ReviewProcess from '@/pages/account/Task/components/ReviewProcess';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, Modal, Tag } from 'antd';
import React, { useRef } from 'react';
import { useLocation, useModel } from 'umi';
import BusMaterialSelect from '../../techology-manage/Material/components/MaterialSelect';
import type { ManufactureLocationQuery } from './typing';

function gotoManufactureInfo(query: ManufactureLocationQuery) {
  window.tabsAction.goBackTab(
    `/order-manage/info-manufacture?type=${query.type}&id=${query.id}&_systemTabName=${query.infoTitle}`,
    undefined,
    true,
  );
}
/**@name 获取表格款式名称 */
function getTableStyleName(data: BusOrderManufacture) {
  return `${data.materialCode}${data.styleDemand.style ? `(${data.styleDemand.style})` : ''}`;
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
  const columns: ProColumns<BusOrderManufacture>[] = [
    {
      title: '生产单号',
      dataIndex: 'contractNumber',
    },
    {
      title: '款式型号',
      dataIndex: 'materialCode',
      renderFormItem(schema, config, form, action?) {
        return <BusMaterialSelect />;
      },
      render(dom, entity, index, action, schema) {
        return getTableStyleName(entity);
      },
    },
    {
      title: '流程状态',
      dataIndex: 'process.status',
      valueEnum: ProcessValueEnum.ActProcessStatusEnum,
      width: 100,
      fieldProps: { mode: 'multiple' },
      render(dom, entity, index, action, schema) {
        if (entity.processId) {
          return dom;
        } else {
          return '请填写生产单';
        }
      },
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
      width: 180,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        console.log('====================================');
        console.log(entity.deliverDate);
        console.log('====================================');
        if ((entity.deliverDate as any) !== 'Invalid date') {
          return dom;
        } else {
          return '-';
        }
      },
    },
    {
      title: '交期时间',
      dataIndex: 'deliverDate',
      key: 'deliverDate',
      valueType: 'dateRange',
      width: 180,

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
                    key: 'start',
                    label: (
                      <div
                        onClick={() => {
                          gotoManufactureInfo({
                            type: 'create',
                            infoTitle: `编辑生产单-${getTableStyleName(entity)}`,
                            id: entity.id,
                          });
                        }}
                      >
                        编辑生产单
                      </div>
                    ),
                  },
                  {
                    key: 'watch',
                    label: (
                      <div
                        onClick={() => {
                          gotoManufactureInfo({
                            type: 'watch',
                            infoTitle: `查看生产单-${getTableStyleName(entity)}`,
                            id: entity.id,
                          });
                        }}
                      >
                        查看生产单
                      </div>
                    ),
                  },
                  {
                    key: 'modify',
                    label: (
                      <div
                        onClick={() => {
                          gotoManufactureInfo({
                            type: 'update',
                            infoTitle: `修改生产单-${getTableStyleName(entity)}`,
                            id: entity.id,
                          });
                        }}
                      >
                        修改生产单
                      </div>
                    ),
                  },
                  {
                    key: 'approve',
                    label: (
                      <div
                        onClick={() => {
                          gotoManufactureInfo({
                            type: 'approve',
                            infoTitle: `审批生产单-${getTableStyleName(entity)}`,
                            id: entity.id,
                          });
                        }}
                      >
                        审批生产单
                      </div>
                    ),
                  },
                  {
                    key: 'recall',
                    label: <div>撤回生产单</div>,
                    onClick: () => {
                      processRecall(entity.processId).then((res) => {
                        action?.reload();
                      });
                    },
                  },
                  {
                    key: 'remove',
                    label: <div>删除生产单</div>,
                    onClick: () => {
                      fetchRemoveContract(entity.contractNumber).then((res) => {
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
                  } else if (item.key === 'start') {
                    return entity.processId === null;
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
      rowKey="id"
      headerTitle="生产单列表"
      actionRef={actionRef}
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchManufactureList);
      }}
    />
  );
};
export default OrderContract;
