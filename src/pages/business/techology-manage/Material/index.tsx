/**
 * 物料编码管理
 */

import {
  fetchCheckMaterialCode,
  fetchManyCreateMaterial,
  fetchManyRemoveMaterial,
  fetchMaterialList,
} from '@/apis/business/techology-manage/material';
import { ApiMethodEnum } from '@/apis/person/typings';
import LoadingButton from '@/components/Comm/LoadingButton';
import { MaterialValueEnum } from '@/configs/commValueEnum';
import { arrayAttributeChange } from '@/utils';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { fileToBinaryString, SelectLocalFile } from '@/utils/upload/upload';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, message, Modal, Space, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { pick, reject } from 'lodash';
import react, { useRef } from 'react';

import React from 'react';
import { Access, useAccess } from 'umi';
import { read, utils, writeFileXLSX } from 'xlsx';
import MaterialTableModal from './TableModal';
import type { BusMaterialType } from './typing';
import { BusMaterialTypeEnum } from './typing';

/**@name 表格选择操作 */
const TableAlertOptionDom: React.FC<{
  selectedRowKeys: (string | number)[];
  action: ActionType | undefined;
}> = (props) => {
  const access = useAccess();

  return (
    <Space size={16}>
      <Access accessible={access.checkShowAuth('/material', ApiMethodEnum.POST)} key="delete">
        <LoadingButton
          onLoadingClick={async () =>
            await fetchManyRemoveMaterial(props.selectedRowKeys as string[]).then(() => {
              props?.action?.clearSelected?.();
              props?.action?.reload();
              message.success('删除成功');
            })
          }
        >
          批量删除
        </LoadingButton>
      </Access>
    </Space>
  );
};

/**@name 表格操作行 */
const TableOperationDom: React.FC<{
  record: BusMaterialType;
  action: ActionType | undefined;
}> = (props) => {
  const access = useAccess();

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
                <MaterialTableModal title="查看物料" node={{ type: 'watch', value: props.record }}>
                  <div>查看物料</div>
                </MaterialTableModal>
              ),
            },
            ...(access.checkShowAuth('/material', ApiMethodEnum.PATCH)
              ? [
                  {
                    key: 'modify',
                    label: (
                      <MaterialTableModal
                        key="修改物料"
                        title="修改物料"
                        onFinish={() => {
                          message.success('修改成功');
                          props?.action?.reload();
                        }}
                        node={{ type: 'update', value: props.record }}
                      >
                        <div>修改物料</div>
                      </MaterialTableModal>
                    ),
                  },
                ]
              : []),
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

const BusStation: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const access = useAccess();

  /**@name 表格栏操作 */
  const TableBarDom = (action: ActionType | undefined) => {
    return [
      <Access accessible={access.checkShowAuth('/material', ApiMethodEnum.POST)} key="create">
        <MaterialTableModal
          key="新增物料"
          title="新增物料"
          node={{ type: 'create' }}
          onFinish={() => {
            message.success('新增成功');
            action?.reload();
          }}
        >
          <Button type="primary" key="create">
            新增物料
          </Button>
        </MaterialTableModal>
      </Access>,
      <Access accessible={access.checkShowAuth('/material', ApiMethodEnum.POST)} key="import">
        <LoadingButton
          type="primary"
          key="import"
          onLoadingClick={async () => {
            const data = await importExcel();
            if (data) {
              await HintModal(data, action);
            }
          }}
        >
          导入Excel
        </LoadingButton>
      </Access>,
      <Button type="primary" key="export" onClick={exportExcel}>
        下载Excel模板
      </Button>,
    ];
  };

  const columns: ProColumns<BusMaterialType>[] = [
    {
      title: '物料编码',
      dataIndex: 'code',
    },
    {
      title: '物料名称',
      dataIndex: 'name',
    },
    {
      title: '物料类型',
      dataIndex: 'type',
      valueEnum: MaterialValueEnum.Type,
    },
    {
      title: '计量单位',
      dataIndex: 'unit',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '备注信息',
      ellipsis: true,
      dataIndex: 'remark',
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
      rowKey="code"
      headerTitle="物料列表"
      actionRef={actionRef}
      tableAlertOptionRender={({ selectedRowKeys }) => {
        return <TableAlertOptionDom selectedRowKeys={selectedRowKeys} action={actionRef.current} />;
      }}
      toolBarRender={TableBarDom}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        defaultSelectedRowKeys: [],
        type: 'checkbox',
      }}
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchMaterialList);
      }}
    />
  );
};

export default BusStation;

/**@name 下载Excel模板 */
export function exportExcel() {
  const ws = utils.json_to_sheet([
    {
      物料编码: '必填,填写物料编码',
      物料名称: '必填,填写物料名称',
      类型: '必填,填写材料或成衣',
      单位: '必填,填写单位',
      单价: '必填,单价',
      备注: '填写备注',
    },
  ]);
  const wb = utils.book_new();
  ws['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 40 }];
  utils.book_append_sheet(wb, ws, '物料清单');
  writeFileXLSX(wb, '物料清单模板.xlsx');
}

/**@name 导入Excel */
export function importExcel() {
  return SelectLocalFile({ accept: '.xlsx' }).then(async (file) => {
    if (file instanceof File) {
      const wb = read(await fileToBinaryString(file), { type: 'binary' });
      const sheetNames = wb.SheetNames; // 工作表名称集合
      const worksheet = wb.Sheets[sheetNames[0]]; // 只读取第一张sheet
      const data: any = utils.sheet_to_json(worksheet);
      return arrayAttributeChange<any>(
        data.map((i) => {
          const v = pick(i, '物料编码', '物料名称', '类型', '单位', '单价', '备注');
          return {
            ...v,
            单价: typeof v['单价'] === 'number' ? v['单价'] : 0,
            类型: v['类型'] === '材料' ? BusMaterialTypeEnum.Material : BusMaterialTypeEnum.Product,
          };
        }),
        [
          ['物料编码', 'code'],
          ['物料名称', 'name'],
          ['类型', 'type'],
          ['单位', 'unit'],
          ['单价', 'price'],
          ['备注', 'remark'],
        ],
      ) as BusMaterialType[];
    }
  });
}

function HintModal(data: BusMaterialType[], action: ActionType | undefined) {
  const columns: ColumnsType<any> = [
    {
      title: '物料编码',
      dataIndex: 'code',
    },
    {
      title: '物料名称',
      dataIndex: 'name',
    },
    {
      title: '物料类型',
      dataIndex: 'type',
      render: (value) => {
        if (value === BusMaterialTypeEnum.Material) {
          return '材料';
        } else {
          return '成衣';
        }
      },
    },
    {
      title: '计量单位',
      dataIndex: 'unit',
    },
    {
      title: '备注信息',
      ellipsis: true,
      dataIndex: 'remark',
    },
  ];
  const errorDataSource: any[] = [];
  const successDataSource: any[] = [];
  data.map((item) => {
    if (!(item.code && item.code.length >= 4)) {
      errorDataSource.push({ ...item, errorText: '物料编码必填切需要大于4个以上' });
    } else if (!(item.name && item.code.length >= 1)) {
      errorDataSource.push({ ...item, errorText: '物料名称必填' });
    } else if (!(item.type && item.type.length >= 1)) {
      errorDataSource.push({ ...item, errorText: '物料类型必填' });
    } else if (!(item.price && item.price >= 0)) {
      errorDataSource.push({ ...item, errorText: '价格必须大于0' });
    } else if (!(item.unit && item.unit.length >= 0)) {
      errorDataSource.push({ ...item, errorText: '单位必填' });
    } else {
      successDataSource.push(item);
    }
  });
  return new Promise<any>(async (resolve) => {
    const checkData = await fetchCheckMaterialCode(successDataSource.map((i) => i.code)).then(
      (r) => r.data,
    );
    checkData.existCodes.forEach((code) => {
      const findIndex = successDataSource.findIndex((d) => d.code === code);
      errorDataSource.push({
        ...successDataSource.splice(findIndex, 1)[0],
        errorText: '物料编码已存在',
      });
    });
    Modal.confirm({
      title: '导入物料清单Excel,点击确定导入已成功的数据',
      width: 800,

      content: (
        <Tabs defaultActiveKey="error">
          <Tabs.TabPane tab="错误列表" key="error">
            <Table
              size="small"
              rowKey="code"
              columns={[
                columns[0],
                columns[1],
                {
                  title: '错误原因',
                  dataIndex: 'errorText',
                },
              ]}
              dataSource={errorDataSource}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="可成功导入的物料列表" key="success">
            <Table rowKey="code" size="small" columns={columns} dataSource={successDataSource} />
          </Tabs.TabPane>
        </Tabs>
      ),
      onOk: () => {
        return new Promise((res1, rej1) => {
          if (successDataSource.length > 0) {
            Modal.confirm({
              title: '您确定要新增可成功导入的物料列表',
              onOk: () => {
                fetchManyCreateMaterial(successDataSource).then(() => {
                  message.success('导入成功');
                  action?.reload();
                  resolve(null);
                  res1(null);
                });
              },
            });
          } else {
            message.error('没有可导入的数据');
            rej1();
          }
        });
      },
      okText: '确定导入',
      onCancel: () => resolve(null),
    });
  });
}
