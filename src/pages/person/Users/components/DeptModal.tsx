/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-02 16:10:50
 * @Description: 操作部门
 */

import type { OperationDeptDTO } from '@/apis/person/typings';
import { createDept, fetchDeptAuthList, updateDept } from '@/apis/person/users';
import { DraggleBetaSchemaFormModal } from '@/components/Comm/DraggleModal';
import type { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { message } from 'antd';
import { useRef } from 'react';

function DeptModal(props: {
  type: 'update' | 'create';
  visible: boolean;
  node?: OperationDeptDTO;
  onRefresh?: () => void;
  onVisibleChange: (visible: boolean) => void;
}) {
  const columns: ProFormColumnsType<OperationDeptDTO>[] = [
    {
      title: '上级部门',
      dataIndex: 'parentId',
      valueType: 'select',
      request: async () => {
        const { data } = await fetchDeptAuthList();
        return data
          .filter((dept) => {
            // 过滤自己及下级
            if (props.type === 'update') {
              if (props.node?.id === dept.id) {
                return false;
              } else if (dept?.deptKey.indexOf(props.node?.deptKey + '-') !== -1) {
                return false;
              }
            }
            return true;
          })
          .map((dept) => ({ label: dept.name, value: dept.id }));
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '部门名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '排序值',
      initialValue: 0,
      fieldProps: {
        type: 'number',
      },
      dataIndex: 'orderNum',
    },
  ];
  const formRef = useRef<ProFormInstance>();
  return (
    <DraggleBetaSchemaFormModal<OperationDeptDTO>
      columns={columns}
      visible={props.visible}
      formRef={formRef}
      onVisibleChange={(v) => {
        if (v) {
          formRef.current?.resetFields();
          formRef.current?.setFieldsValue(props.node);
        }
        props.onVisibleChange(v);
      }}
      layoutType="ModalForm"
      title={`${props.type === 'create' ? '新增' : '修改'}部门`}
      onFinish={async (values) => {
        if (props.type === 'create') {
          await createDept(values);
        } else if (props.node?.id) {
          await updateDept(props.node.id as number, values);
        }
        props.onRefresh?.();
        message.success('操作成功');
        return true;
      }}
    />
  );
}
export default DeptModal;
