import { BusCustomerTypeEnum } from '@/apis/business/customer/typing';
import { fetchRemoveContract, fetchContractList } from '@/apis/business/order-manage/contract';
import type { BusOrderContract } from '@/apis/business/order-manage/contract/typing';
import type { BusOrderManufacture } from '@/apis/business/order-manage/manufacture/typing';
import { fetchManufactureUseModfiyRecordPieceList } from '@/apis/business/order-manage/record-piece';
import { processRecall } from '@/apis/process/process';
import { ActTaskModelTypeEnum } from '@/apis/process/typings';
import {
  OrderContractTypeValueEnum,
  dictValueEnum,
  CustomerCompanyValueEnum,
  ProcessValueEnum,
} from '@/configs/commValueEnum';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import ReviewProcess from '@/pages/account/Task/components/ReviewProcess';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Modal, Tag, Dropdown, Menu, Button } from 'antd';
import { useRef } from 'react';
import { useLocation, useModel } from 'umi';
import type { ActionType } from 'use-switch-tabs';
import BusMaterialSelect from '../../techology-manage/Material/components/MaterialSelect';
import { getTableStyleName } from '../manufacture/helper';
import RecordPieceAddModal from './components/RecordPieceAddModal';

const OrderContract: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const location = useLocation();
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
      title: '合同单号',
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
                      <RecordPieceAddModal
                        type="watch"
                        title="查看计件单"
                        value={{ manufactureId: entity.id }}
                      >
                        <div onClick={() => {}}>查看计件单</div>
                      </RecordPieceAddModal>
                    ),
                  },
                  {
                    key: 'modfiy',
                    label: (
                      <RecordPieceAddModal
                        type="add"
                        title="填写计件单"
                        value={{ manufactureId: entity.id }}
                      >
                        <div onClick={() => {}}>填写计件单</div>
                      </RecordPieceAddModal>
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
      rowKey="manufactureId"
      headerTitle="计件单"
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchManufactureUseModfiyRecordPieceList);
      }}
    />
  );
};
export default OrderContract;
