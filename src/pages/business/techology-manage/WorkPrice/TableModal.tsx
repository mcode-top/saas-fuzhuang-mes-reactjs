import SelectSystemPersonButton from '@/components/Comm/FormlyComponents/SelectSystemPersonButton';
import { STORAGE_WORK_PROCESS_LIST } from '@/configs/storage.config';
import { arrayAttributeChange, arrayToObject } from '@/utils';
import storageDataSource from '@/utils/storage';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import ProForm, { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { EditableFormInstance, ProColumns } from '@ant-design/pro-table';
import { ActionType, EditableProTable } from '@ant-design/pro-table';
import { Button, Form, InputNumber, List, Modal, Select, Table } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import type { BusWorkPriceItem, BusWorkPriceType } from './typing';
import { read, utils, writeFileXLSX } from 'xlsx';
import { pick } from 'lodash';
import { fileToBinaryString, SelectLocalFile } from '@/utils/upload/upload';
import {
  fetchCreateWorkPrice,
  fetchUpdateWorkPrice,
} from '@/apis/business/techology-manage/work-price';
/**@name Excel宽度 */
const cellWidth = [{ wch: 36 }, { wch: 15 }];

const WorkPriceTableModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: BusWorkPriceType;
  };
  title: string;
  onFinish?: (value: BusWorkPriceType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  const editRef = useRef<any>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        const editData = await editRef.current.getValues();
        if (props.node.type === 'create') {
          await fetchCreateWorkPrice({ ...value, data: editData });
        } else if (props.node.type === 'update') {
          await fetchUpdateWorkPrice({ ...(props.node?.value || {}), ...value, data: editData });
        }
        props?.onFinish?.(value);
        resolve(true);
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        reject(false);
      }
    });
  }

  const disabled = props.node.type === 'watch';
  return (
    <ModalForm<BusWorkPriceType>
      width={900}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();

        formRef.current?.setFieldsValue(props.node.value);
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <ProFormText label="工价名称" disabled={disabled} rules={[{ required: true }]} name="name" />
      <WorkPriceEditTable value={props.node.value?.data} disabled={disabled} ref={editRef} />
      <ProFormTextArea label="备注信息" disabled={disabled} name="remark" />
    </ModalForm>
  );
};
export default WorkPriceTableModal;

/**@name 编辑工价单 */
const WorkPriceEditTable = forwardRef(
  (props: { value: any; disabled: boolean }, ref: React.Ref<any>) => {
    const editableFormRef = useRef<EditableFormInstance>(null);
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
      // 初始化表格数据
      const ids: number[] = [];
      if (Array.isArray(props.value)) {
        setDataSource(
          props.value.map((v, i) => {
            editableFormRef.current?.setRowData?.(i, v);

            ids.push(i);
            return { ...v, id: i };
          }),
        );
      } else {
        setDataSource([]);
      }
      if (props?.disabled) {
        setEditableRowKeys([]);
      } else {
        setEditableRowKeys(ids);
      }
    }, [props.value, props.disabled]);
    useImperativeHandle(ref, () => ({
      getValues: async () => {
        await editableFormRef.current?.validateFields?.();
        return editableFormRef.current?.getRowsData?.();
      },
    }));

    const columns: ProColumns<BusWorkPriceItem>[] = [
      {
        title: '选择工序',
        dataIndex: 'workProcessId',
        width: 300,
        valueType: 'select',
        formItemProps: () => {
          return {
            rules: [{ required: true, message: '此项为必填项' }],
          };
        },
        fieldProps: (_, { rowIndex }) => {
          return {
            onChange: (value, data) => {
              if (value !== undefined) {
                editableFormRef.current?.setRowData?.(rowIndex, { name: data.label });
              } else {
                editableFormRef.current?.setRowData?.(rowIndex, { name: undefined });
              }
            },
          };
        },
        request: async () => {
          return arrayAttributeChange(
            (await storageDataSource.getValue(STORAGE_WORK_PROCESS_LIST)).data,
            [
              ['id', 'value'],
              ['name', 'label'],
            ],
          );
        },
      },
      {
        title: '工序名称',
        dataIndex: 'name',
        valueType: 'text',
        readonly: true,
        formItemProps: () => {
          return {
            rules: [{ required: true, message: '此项为必填项' }],
          };
        },
      },
      {
        title: '工价',
        width: 150,
        dataIndex: 'price',
        valueType: 'money',
        fieldProps: {
          min: 0,
          precision: 4,
          style: {
            width: 130,
          },
        },
        formItemProps: () => {
          return {
            numberFormatOptions: new Intl.NumberFormat('zh-CN', { maximumSignificantDigits: 3 }),

            rules: [{ required: true, message: '此项为必填项' }],
          };
        },
      },
      {
        title: '操作',
        valueType: 'option',
      },
    ];
    return (
      <ProForm.Item name="data" trigger="onValuesChange">
        <EditableProTable<BusWorkPriceItem>
          editableFormRef={editableFormRef}
          rowKey="id"
          headerTitle="工价单"
          columns={columns}
          toolBarRender={() => {
            return props?.disabled
              ? []
              : WorkPriceEditTableToolBar(editableFormRef, setDataSource, setEditableRowKeys);
          }}
          recordCreatorProps={{
            position: 'bottom',
            newRecordType: props?.disabled ? 'cache' : 'dataSource',
            record: () =>
              ({
                id: Date.now(),
                workProcessId: undefined,
                name: undefined,
                price: undefined,
              } as any),
            creatorButtonText: '新增一行',
          }}
          value={dataSource}
          editable={{
            type: 'multiple',
            editableKeys,
            formProps: {
              disabled: props?.disabled,
            },
            onChange: setEditableRowKeys,
            onValuesChange: (record, recordList) => {
              setDataSource(recordList as any);
            },
            actionRender: (row, _, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    );
  },
);

/**@name 工价单表格操作条 */
const WorkPriceEditTableToolBar = (
  editableFormRef: React.MutableRefObject<EditableFormInstance<any> | undefined | null>,
  setDataSource,
  setEditableRowKeys,
) => {
  return [
    <Button
      key="export"
      type="primary"
      onClick={() => {
        const data = editableFormRef?.current?.getRowsData?.();
        busWorkPriceExportExcel(data);
      }}
    >
      导出Excel模板
    </Button>,
    <Button
      key="import"
      type="primary"
      onClick={async () => {
        let rows = await busWorkPriceImportExcel();
        if (rows) {
          /**@name 获取工序列表 将工序列表 {id:string,name:string}[] 改为 {name:id} */
          const workProcessSearch = arrayToObject(
            (await storageDataSource.getValue(STORAGE_WORK_PROCESS_LIST)).data,
            'name',
            'id',
          );
          /**@name 错误列表 */
          const errorRows: { name: string; price: number }[] = [];
          rows = rows.filter((item) => {
            // 如果工序再系统中则正常导入表中
            if (item.name && workProcessSearch[item.name]) {
              item.workProcessId = workProcessSearch[item.name];
              return true;
            } else {
              // 否则提示人员添加新工序
              errorRows.push(item);
              return false;
            }
          });
          const keys: string[] = [];
          setDataSource(
            rows.map((item) => {
              const id = (Math.random() + Date.now()).toString();
              keys.push(id);
              return { ...item, id };
            }) as any,
          );
          setEditableRowKeys(keys);
          if (errorRows.length > 0) {
            Modal.error({
              title: '检测到未知工序(请在工序管理中新增)',
              width: 600,
              content: (
                <Table
                  dataSource={errorRows}
                  size="small"
                  title={() => '未知工序列表'}
                  rowKey="name"
                  columns={[
                    { title: '工序名称', dataIndex: 'name' },
                    { title: '工价', dataIndex: 'price' },
                  ]}
                />
              ),
              okText: '确定',
            });
          }
        }
      }}
    >
      导入Excel
    </Button>,
  ];
};

/**@name 导出Excel */
export function busWorkPriceExportExcel(data: BusWorkPriceItem[] | undefined) {
  let ws;
  if (data && Array.isArray(data) && data.length > 0) {
    ws = utils.json_to_sheet(
      arrayAttributeChange(
        data.map((i) => pick(i, 'name', 'price')),
        [
          ['name', '工序名称'],
          ['price', '工价'],
        ],
      ),
    );
  } else {
    ws = utils.json_to_sheet([
      {
        工序名称: '必填,填写工序名称',
        工价: '必填,填写工价',
      },
    ]);
  }
  const wb = utils.book_new();
  ws['!cols'] = cellWidth;
  utils.book_append_sheet(wb, ws, '工价单');
  writeFileXLSX(wb, '工价单模板.xlsx');
}

/**@name 导入Excel */
export function busWorkPriceImportExcel() {
  return SelectLocalFile({ accept: '.xlsx' }).then(async (file) => {
    if (file instanceof File) {
      const wb = read(await fileToBinaryString(file), { type: 'binary' });
      const sheetNames = wb.SheetNames; // 工作表名称集合
      const worksheet = wb.Sheets[sheetNames[0]]; // 只读取第一张sheet
      const data: any = utils.sheet_to_json(worksheet);
      return arrayAttributeChange<any>(
        data.map((i) => pick(i, '工序名称', '工价')),
        [
          ['工序名称', 'name'],
          ['工价', 'price'],
        ],
      ) as { name: string; price: number; workProcessId?: number }[];
    }
  });
}
