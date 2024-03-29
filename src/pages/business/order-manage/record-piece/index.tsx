import type { BusOrderManufacture } from '@/apis/business/order-manage/manufacture/typing';
import { fetchManufactureUseModfiyRecordPieceList } from '@/apis/business/order-manage/record-piece';
import { BusRecordPieceStatusEnum } from '@/apis/business/order-manage/record-piece/typing';
import { ApiMethodEnum } from '@/apis/person/typings';
import { OrderContractTypeValueEnum } from '@/configs/commValueEnum';
import { COM_PRO_TABLE_TIME, REQUEST_PREFIX, WEB_REQUEST_URL } from '@/configs/index.config';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { downloadAction } from '@/utils/upload/upload';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Dropdown, Menu, Button, DatePicker, Modal } from 'antd';
import { useRef } from 'react';
import { useAccess, useLocation } from 'umi';
import BusMaterialSelect from '../../techology-manage/Material/components/MaterialSelect';
import { getTableStyleName } from '../manufacture/helper';
import RecordPieceAddModal from './components/RecordPieceAddModal';
import RecordPieceLogModal from './components/RecordPieceLogModal';
const { RangePicker } = DatePicker;

const OrderRecordPiece: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const location = useLocation();
  const access = useAccess();

  const columns: ProColumns<BusOrderManufacture>[] = [
    {
      title: '订单单号',
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
      title: '计件单状态',
      dataIndex: 'recordPiece',
      hideInSearch: true,
      hideInForm: true,
      valueEnum: OrderContractTypeValueEnum.RecordPieceStatus,
      renderText(text, record, index, action) {
        if (text) {
          return text.status;
        } else {
          return BusRecordPieceStatusEnum.NotFilledIn;
        }
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
                      <RecordPieceAddModal
                        type="watch"
                        title="查看计件单"
                        value={{ manufactureId: entity.id }}
                      >
                        <div onClick={() => {}}>查看计件单</div>
                      </RecordPieceAddModal>
                    ),
                  },
                  entity.recordPiece?.id
                    ? {
                        key: 'watch-log',
                        label: (
                          <RecordPieceLogModal
                            type="findOne"
                            data={{ recordPieceId: entity.recordPiece?.id }}
                          >
                            <div onClick={() => {}}>查看计件单记录</div>
                          </RecordPieceLogModal>
                        ),
                      }
                    : null,
                  ...(access.checkShowAuth('/record-piece/add', ApiMethodEnum.POST)
                    ? [
                        {
                          key: 'modfiy',
                          label: (
                            <RecordPieceAddModal
                              type="add"
                              title="填写计件单"
                              value={{ manufactureId: entity.id }}
                              onFinish={() => {
                                actionRef.current?.reload();
                              }}
                            >
                              <div onClick={() => {}}>填写计件单</div>
                            </RecordPieceAddModal>
                          ),
                        },
                      ]
                    : []),
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
      actionRef={actionRef}
      toolBarRender={() => {
        return [
          <Button
            key="all"
            type="primary"
            onClick={() => {
              window.tabsAction.goBackTab('/order-manage/statisitics/date-record-piece');
            }}
          >
            统计整体计件数与工资
          </Button>,
          <Button
            key="single"
            type="primary"
            onClick={() => {
              window.tabsAction.goBackTab('/order-manage/statisitics/worker-date-record-piece');
            }}
          >
            统计单个员工计件数与工资
          </Button>,
        ];
      }}
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchManufactureUseModfiyRecordPieceList);
      }}
    />
  );
};
export default OrderRecordPiece;
