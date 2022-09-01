import { fetchShelfIdToGoodsList } from '@/apis/business/warehouse';
import type {
  BusWarehouseGoodsType,
  BusWarehouseShelfType,
} from '@/apis/business/warehouse/typing';
import { BusWarehouseLogTypeEnum } from '@/apis/business/warehouse/typing';
import { BusWarehouseTypeEnum } from '@/apis/business/warehouse/typing';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import { ProFormDigitRange } from '@ant-design/pro-form';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, message, Space, Table } from 'antd';
import { useContext, useEffect, useState } from 'react';
import BusMaterialSelect from '@/pages/business/techology-manage/Material/components/MaterialSelect';
import React from 'react';
import { WarehouseContext } from '../context';
import GoodsPutInModal from './GoodsPutInModal';
import { formatWarehouseEnumToMaterialEnum } from '../helper';
import GoodsPutOutModal from './GoddsPutOutModal';
import GoodsOutInLogModal from '../Log/GoodsOutInLogModal';
import { GoodsExcelPutInTemplate, GoodsImportExcelPutIn } from './GoodsExcelOperation';
import ExcelHintGoodsPutInModal from './CheckExcelGoodsPutInModal';
import ManyPutOutInGoods from './ManyPutOutInGoods';

/**@name 表格栏操作 */
const TableBarDom = (
  action: ActionType | undefined,
  shelfNode: BusWarehouseShelfType | undefined,
) => {
  const [v, setV] = useState<any>();
  const excelRef = React.useRef<any>();
  if (!shelfNode) {
    return [];
  }
  return [
    <GoodsPutInModal
      key="其他货品入库"
      title="其他货品入库"
      node={{ type: 'create', value: { shelfId: shelfNode.id } }}
      onFinish={() => {
        message.success('货品入库成功');
        action?.reload();
      }}
    >
      <Button type="primary" key="create">
        其他货品入库
      </Button>
    </GoodsPutInModal>,
    <ExcelHintGoodsPutInModal
      onFinish={() => {
        action?.reload?.();
      }}
      key="excel-modal"
      shelfId={shelfNode.id}
      data={v}
      actionRef={action as any}
    >
      <div key="excel-modal" ref={excelRef} />
    </ExcelHintGoodsPutInModal>,
    <Button
      type="primary"
      key="excel-export"
      onClick={async () => {
        const data = await GoodsImportExcelPutIn();
        setV(data);
        excelRef?.current?.click?.();
      }}
    >
      Excel批量导入库
    </Button>,

    <Button key="excel-template-download" type="primary" onClick={GoodsExcelPutInTemplate}>
      Excel入库模板下载
    </Button>,
  ];
};
/**@name 表格选择操作 */
const TableAlertOptionDom: React.FC<{
  selectedRowKeys: (string | number)[];
  selectedRows: any[];
  action: ActionType | undefined;
}> = (props) => {
  const wContext = useContext(WarehouseContext);

  return (
    <Space size={16}>
      <ManyPutOutInGoods
        warehouseType={wContext.currentWarehouse?.type as any}
        type={BusWarehouseLogTypeEnum.In}
        title="批量入库"
        value={props.selectedRows}
        onFinish={() => {
          message.success('操作成功');
          wContext.goodsAction?.current?.clearSelected?.();
          wContext.goodsAction?.current?.reload();
        }}
      >
        <Button type="primary">批量入库</Button>
      </ManyPutOutInGoods>
      <ManyPutOutInGoods
        warehouseType={wContext.currentWarehouse?.type as any}
        type={BusWarehouseLogTypeEnum.Out}
        title="批量出库"
        value={props.selectedRows}
        onFinish={() => {
          message.success('操作成功');
          wContext.goodsAction?.current?.clearSelected?.();
          wContext.goodsAction?.current?.reload();
        }}
      >
        <Button type="primary">批量出库</Button>
      </ManyPutOutInGoods>
    </Space>
  );
};

/**@name 表格操作行 */
const TableOperationDom: React.FC<{
  record: BusWarehouseGoodsType;
  action: ActionType | undefined;
}> = (props) => {
  const wContext = useContext(WarehouseContext);

  return (
    <Dropdown
      key="Dropdown"
      trigger={['click']}
      overlay={
        <Menu
          key="menu"
          items={[
            {
              key: 'put-out-in',
              label: (
                <GoodsOutInLogModal
                  warehouseName={wContext.currentWarehouse?.name as string}
                  value={props.record}
                >
                  <div>查看出入库记录</div>
                </GoodsOutInLogModal>
              ),
            },
            {
              key: 'put-out',
              label: (
                <GoodsPutOutModal
                  type="put-out"
                  title="货品出库"
                  value={props.record}
                  onFinish={() => {
                    message.success('出库成功');
                    props.action?.reload();
                  }}
                >
                  <div>货品出库</div>
                </GoodsPutOutModal>
              ),
            },
            {
              key: 'update-remark',
              label: (
                <GoodsPutOutModal
                  type="update-remark"
                  title="修改货品备注"
                  value={props.record}
                  onFinish={() => {
                    message.success('修改货品备注成功');
                    props.action?.reload();
                  }}
                >
                  <div>修改备注</div>
                </GoodsPutOutModal>
              ),
            },
          ]}
        />
      }
    >
      <Button icon={<SettingOutlined />} type="link">
        更多操作
      </Button>
    </Dropdown>
  );
};

const BusWarehouseGoodsTable: React.FC = () => {
  const wContext = useContext(WarehouseContext);
  useEffect(() => {
    wContext.goodsAction?.current?.reload();
  }, [wContext.currentShelfNode]);
  const columns: ProColumns<BusWarehouseGoodsType>[] = [
    {
      title: '物料信息',
      dataIndex: 'materialCode',
      renderFormItem: () => {
        return (
          <BusMaterialSelect
            multiple={false}
            materialType={formatWarehouseEnumToMaterialEnum(wContext.currentWarehouse?.type)}
          />
        );
      },
      renderText(text, record, index, action) {
        return `${record.material?.name}(${record.material?.code})`;
      },
    },
    {
      title: '计量单位',
      dataIndex: '计量单位',
      width: 80,
      renderText(text, record, index, action) {
        return `${record.material?.unit}`;
      },
      hideInSearch: true,
    },
    {
      title: '尺码规格',
      dataIndex: '尺码规格',
      width: 150,
      ellipsis: true,
      hideInSearch: true,
      renderText(text, record, index, action) {
        if (!record.size) {
          return <span style={{ color: '#bfbfbf' }}>无尺码</span>;
        }
        return `${record.size?.name}${
          record.size?.specification ? `(${record.size?.specification})` : ''
        }`;
      },
      hideInTable: wContext.currentWarehouse?.type === BusWarehouseTypeEnum.Material,
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
      sorter: true,
      width: 100,
      renderFormItem: () => {
        return <ProFormDigitRange placeholder="查询库存范围" />;
      },
    },

    {
      title: '备注信息',
      ellipsis: true,
      dataIndex: 'remark',
      width: 150,
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
      width: 150,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 150,
      hideInSearch: true,
      key: 'operation',
      render: (dom, record, index, action) => {
        return <TableOperationDom record={record} action={action} />;
      },
    },
  ];
  return (
    <ProTable
      columns={columns}
      rowKey="id"
      headerTitle="货品列表"
      size="small"
      actionRef={wContext.goodsAction}
      toolBarRender={(action) => TableBarDom(action, wContext.currentShelfNode)}
      search={{
        filterType: 'light',
      }}
      pagination={{
        pageSize: 10,
        size: 'small',
      }}
      tableAlertOptionRender={({ selectedRowKeys, selectedRows }) => {
        return (
          <TableAlertOptionDom
            selectedRows={selectedRows}
            selectedRowKeys={selectedRowKeys}
            action={wContext.goodsAction?.current as ActionType}
          />
        );
      }}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        defaultSelectedRowKeys: [],
        type: 'checkbox',
      }}
      request={async (params, sort, filter) => {
        if (!wContext.currentShelfNode?.id) {
          return {
            data: [],
          };
        }
        return nestPaginationTable(params, sort, filter, (data) =>
          fetchShelfIdToGoodsList(wContext.currentShelfNode?.id as number, data),
        );
      }}
    />
  );
};

export default BusWarehouseGoodsTable;
