/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-02 16:10:50
 * @Description: 操作角色
 */

import { createRole, fetchRoleAuthList, updateRole } from '@/apis/person/roles';
import type { OperationDeptDTO, OperationRoleDTO } from '@/apis/person/typings';
import { DraggleBetaSchemaFormModal } from '@/components/Comm/DraggleModal';
import type { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { message } from 'antd';
import { useRef } from 'react';

function RoleModal(props: {
  type: 'update' | 'create';
  visible: boolean;
  node?: OperationRoleDTO;
  onRefresh?: () => void;
  onVisibleChange: (visible: boolean) => void;
}) {
  const columns: ProFormColumnsType<OperationRoleDTO>[] = [
    {
      title: '上级角色',
      dataIndex: 'parentId',
      valueType: 'select',
      request: async () => {
        const { data } = await fetchRoleAuthList();
        return data
          .filter((role) => {
            // 过滤自己及下级
            if (props.type === 'update') {
              if (props.node?.id === role.id) {
                return false;
              } else if (role?.roleKey.indexOf(props.node?.roleKey + '-') !== -1) {
                return false;
              }
            }
            return true;
          })
          .map((role) => ({ label: role.name, value: role.id }));
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
      title: '角色名称',
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
      title: '角色标签',
      dataIndex: 'label',
    },
    {
      title: '角色备注',
      dataIndex: 'remark',
      valueType: 'textarea',
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
      title={`${props.type === 'create' ? '新增' : '修改'}角色`}
      onFinish={async (values) => {
        if (props.type === 'create') {
          await createRole(values);
        } else if (props.node?.id) {
          await updateRole(props.node.id as number, values);
        }
        props.onRefresh?.();
        message.success('操作成功');
        return true;
      }}
    />
  );
}
export default RoleModal;
