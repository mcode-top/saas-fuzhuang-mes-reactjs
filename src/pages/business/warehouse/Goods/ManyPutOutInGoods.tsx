import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormTextArea } from '@ant-design/pro-form';
import ProForm, { ModalForm } from '@ant-design/pro-form';

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import type { BusWarehouseGoodsType } from '@/apis/business/warehouse/typing';
import { BusWarehouseTypeEnum, BusWarehouseLogTypeEnum } from '@/apis/business/warehouse/typing';
import type { EditableFormInstance, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { fetchWarehouseManyPutOutInGoods } from '@/apis/business/warehouse';

/**@name 货品出入库记录对话框 */
const ManyPutOutInGoods: React.FC<{
  value: BusWarehouseGoodsType[];
  type: BusWarehouseLogTypeEnum;
  warehouseType: BusWarehouseTypeEnum;
  onFinish?: () => void;
  title: string;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const editableRef = useRef<any>();
  useEffect(() => {
    formRef.current?.resetFields();
  }, [props.value]);
  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await editableRef.current.getValues();
        const formValue = await formRef.current?.validateFields();
        console.log(data, formValue);
        await fetchWarehouseManyPutOutInGoods({
          ...formValue,
          data: data.map((i: any) => {
            return {
              goodsId: i.id,
              operationNumber: Number(i.operationNumber),
            };
          }),
          type: props.type,
        }).then((r) => {
          props?.onFinish?.();
          resolve(true);
        });
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        reject(false);
      }
    });
  }
  return (
    <ModalForm
      onFinish={onFinish}
      width={1000}
      title={props.title}
      formRef={formRef}
      trigger={props.children}
    >
      <PutOutInEditTable
        ref={editableRef}
        value={props.value}
        type={props.type}
        warehouseType={props.warehouseType}
      />
      <ProFormTextArea label="出入库原因" name="remark" />
      <ProFormTextArea label="合同单号" name="contractNumber" />
    </ModalForm>
  );
};

export default ManyPutOutInGoods;
/**@name 编辑出入库单 */
const PutOutInEditTable = forwardRef(
  (
    props: {
      value: any;
      type: BusWarehouseLogTypeEnum;
      warehouseType: BusWarehouseTypeEnum;
    },
    ref: React.Ref<any>,
  ) => {
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
      setEditableRowKeys(ids);
    }, [props.value]);
    useImperativeHandle(ref, () => ({
      getValues: async () => {
        await editableFormRef.current?.validateFields?.();
        return editableFormRef.current?.getRowsData?.();
      },
    }));

    const columns: ProColumns<BusWarehouseGoodsType>[] = [
      {
        title: '货品Id',
        dataIndex: 'id',
        readonly: true,
        width: 80,
      },
      {
        title: '物料信息',
        dataIndex: 'materialCode',
        readonly: true,
        renderFormItem(schema, config, form, action?) {
          const record = (schema as any).entity;
          return `${record.material?.name}(${record.material?.code})`;
        },
      },
      {
        title: '计量单位',
        dataIndex: 'unit',
        width: 80,
        readonly: true,
        renderFormItem(schema, config, form, action?) {
          const record = (schema as any).entity;

          return `${record.material?.unit}`;
        },
      },
      {
        title: '尺码规格',
        dataIndex: 'size',
        width: 150,
        ellipsis: true,
        readonly: true,
        renderFormItem(schema, config, form, action?) {
          const record = (schema as any).entity;

          if (!record.size) {
            return <span style={{ color: '#bfbfbf' }}>无尺码</span>;
          }
          return `${record.size?.name}${
            record.size?.specification ? `(${record.size?.specification})` : ''
          }`;
        },

        hideInTable: props.warehouseType === BusWarehouseTypeEnum.Material,
      },
      {
        title: '库存数量',
        dataIndex: 'quantity',
        width: 100,

        readonly: true,
      },
      {
        title: props.type === BusWarehouseLogTypeEnum.In ? '入库数量' : '出库数量',
        dataIndex: 'operationNumber',
        valueType: 'digit',
        fieldProps: {
          min: 0,
        },
        formItemProps: (form, config) => {
          return {
            rules: [
              {
                validator(rule, value, callback) {
                  const record = (config as any).entity;
                  if (!value) {
                    callback('数量必填');
                  } else if (Number(value) <= 0) {
                    callback('数量不能等于0');
                  } else if (
                    Number(value) > record.quantity &&
                    props.type === BusWarehouseLogTypeEnum.Out
                  ) {
                    callback('数量不能超过库存数量');
                  }
                  callback();
                },
              },
            ],
          };
        },
      },
    ];
    return (
      <ProForm.Item name="data" trigger="onValuesChange">
        <EditableProTable<BusWarehouseGoodsType>
          editableFormRef={editableFormRef}
          rowKey="id"
          columns={columns}
          recordCreatorProps={false}
          value={dataSource}
          editable={{
            type: 'multiple',
            editableKeys,
          }}
          onValuesChange={(list, record) => {
            setDataSource(
              dataSource.map((i) => {
                if (i.id === record.id) {
                  return { ...i, operationNumber: (record as any).operationNumber || 0 };
                } else {
                  return i;
                }
              }),
            );
          }}
        />
      </ProForm.Item>
    );
  },
);
