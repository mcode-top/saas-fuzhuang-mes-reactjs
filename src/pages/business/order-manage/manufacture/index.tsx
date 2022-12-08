import {
  fetchCheckManufactureIsRecall,
  fetchConfirmManufactureOrderComplete,
  fetchManufactureList,
  fetchRemoveManufacture,
} from '@/apis/business/order-manage/manufacture';
import type { BusOrderManufacture } from '@/apis/business/order-manage/manufacture/typing';
import { fetchOrderRecall } from '@/apis/business/order-manage/order-process';
import { processRecall } from '@/apis/process/process';
import { ActProcessStatusEnum, ActTaskModelTypeEnum } from '@/apis/process/typings';
import { OrderContractTypeValueEnum, ProcessValueEnum } from '@/configs/commValueEnum';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import ReviewProcess from '@/pages/account/Task/components/ReviewProcess';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, message, Modal } from 'antd';
import { isEmpty } from 'lodash';
import React, { useRef } from 'react';
import { useLocation, useModel } from 'umi';
import BusMaterialSelect from '../../techology-manage/Material/components/MaterialSelect';
import { getTableStyleName } from './helper';
import ManufacturePutInStockModal from './Info/ManufacturePutInStockModal';
import type { ManufactureLocationQuery } from './typing';
/**@name 不需要审核的流程KEY */
const MANUFACTURE_NOT_APPROVE_KEY = 'manufacture-1';
function gotoManufactureInfo(query: ManufactureLocationQuery) {
  window.tabsAction.goBackTab(
    `/order-manage/info-manufacture?type=${query.type}&id=${query.id}&_systemTabName=${query.infoTitle}`,
    undefined,
    true,
  );
}

const OrderContract: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  const putInStockModalRef = useRef<{ show: (contractNumber: string) => any }>();
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
      title: '订单单号',
      dataIndex: 'contractNumber',
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      renderText: (t, record) => record.contract?.type,
      valueEnum: OrderContractTypeValueEnum.OrderType,
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
      dataIndex: 'approveUserList',
      renderText: (t, record) => {
        return (record as any)?.approveUserList?.map((i) => i.name).join(',');
      },
    },
    {
      title: '生产交期时间',
      dataIndex: 'deliverDate',
      key: 'deliverDate-table',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
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
                      fetchCheckManufactureIsRecall(entity.id).then((is) => {
                        if (is) {
                          fetchOrderRecall(entity.contractNumber, entity.processId).then((res) => {
                            action?.reload();
                          });
                        } else {
                          message.warning('当前生产单已经开始计件无法撤回');
                        }
                      });
                    },
                  },
                  {
                    key: 'remove',
                    label: <div>删除生产单</div>,
                    onClick: () => {
                      Modal.confirm({
                        title: '删除生产单',
                        content: `您确定要删除[${entity.contractNumber}-${getTableStyleName(
                          entity,
                        )}]生产单吗?`,
                        onOk: () => {
                          return fetchRemoveManufacture(entity.id).then((res) => {
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
                  {
                    key: 'put-in-stock',
                    label: <div>货品入库</div>,
                    onClick: () => {
                      putInStockModalRef.current?.show(entity.contractNumber);
                    },
                  },
                  {
                    key: 'confirm-complete',
                    label: <div>确认完成</div>,
                    onClick: () => {
                      Modal.confirm({
                        title: '系统提示',
                        content: (
                          <p>您确定当前生产单生产完成吗?确认完毕后将无法继续添加计件单与生产入库</p>
                        ),
                        onOk: () =>
                          fetchConfirmManufactureOrderComplete(entity.id).then((r) =>
                            actionRef.current?.reload(),
                          ),
                      });
                    },
                  },
                ].filter((item) => {
                  const isOperator =
                    initialState?.currentUser?.id === entity.process?.operatorId ||
                    initialState?.currentUser?.isAdmin;
                  /**@name 是否为审批人 */
                  const isApprover =
                    (entity as any)?.approveUserList?.find(
                      (i) => i?.user.id === initialState?.currentUser?.id,
                    ) !== undefined;

                  if (item.key === 'recall') {
                    return (
                      isOperator &&
                      (entity.process?.runningTask?.type === ActTaskModelTypeEnum.Approve ||
                        entity.process?.businessKey === MANUFACTURE_NOT_APPROVE_KEY)
                    );
                  } else if (item.key === 'modify') {
                    return (
                      entity.process?.runningTask?.type === ActTaskModelTypeEnum.Start && isOperator
                    );
                  } else if (item.key === 'remove') {
                    return (
                      isEmpty(entity.process) ||
                      (entity.process?.runningTask?.type === ActTaskModelTypeEnum.Start &&
                        isOperator)
                    );
                  } else if (item.key === 'approve') {
                    return isApprover && entity.process?.runningTask?.name === '人员审批';
                  } else if (item.key === 'start') {
                    return entity.processId === null;
                  } else if (item.key === 'review') {
                    return entity.process !== null;
                  } else if (item.key === 'put-in-stock') {
                    return entity.process?.runningTask?.name === '开始生产';
                  } else if (item.key === 'confirm-complete') {
                    console.log('====================================');
                    console.log(entity.process?.runningTask?.name === '开始生产' && isApprover);
                    console.log('====================================');
                    return entity.process?.runningTask?.name === '开始生产' && isApprover;
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
    <>
      <ProTable
        columns={columns}
        rowKey="id"
        headerTitle="生产单列表"
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          return nestPaginationTable(params, sort, filter, fetchManufactureList);
        }}
      />
      <ManufacturePutInStockModal ref={putInStockModalRef} />
    </>
  );
};
export default OrderContract;
