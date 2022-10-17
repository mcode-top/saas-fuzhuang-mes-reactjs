/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-03 10:37:51
 * @Description: 操作用户 -
 */
import { fetchRoleAuthList } from '@/apis/person/roles';
import type { OperationDeptDTO, OperationUserDTO } from '@/apis/person/typings';
import { createUser, fetchDeptAuthList, updateUser } from '@/apis/person/users';
import { UserSexEnum } from '@/apis/user/typings';
import { UserValueEnum } from '@/configs/commValueEnum';
import type { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { message } from 'antd';
import { useRef } from 'react';

function UserModal(props: {
  type: 'update' | 'create';
  visible: boolean;
  node?: OperationDeptDTO;
  onRefresh?: () => void;
  onVisibleChange: (visible: boolean) => void;
}) {
  const columns: ProFormColumnsType<OperationUserDTO>[] = [
    {
      title: '姓名',
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
      title: '用户名',
      hideInForm: props.type === 'update',
      tooltip: '用户登录系统时使用',
      dataIndex: 'username',
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
      title: '用户密码',
      tooltip: '用户登录系统时使用',
      dataIndex: 'password',
      hideInForm: props.type === 'update',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      fieldProps: {
        type: 'password',
      },
    },
    {
      title: '确认用户密码',
      dataIndex: 'nextPassword',
      hideInForm: props.type === 'update',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
          (formInstance) => {
            const values = formInstance.getFieldsValue();
            return {
              validator(_, value) {
                if (values.password !== values.nextPassword) {
                  return Promise.reject(new Error('两次密码不相同'));
                } else {
                  return Promise.resolve();
                }
              },
            };
          },
        ],
      },
      fieldProps: {
        type: 'password',
      },
    },
    {
      title: '归属部门',
      dataIndex: 'deptId',
      valueType: 'select',
      request: async () => {
        const { data } = await fetchDeptAuthList();
        return data.map((dept) => ({ label: dept.name, value: dept.id }));
      },
    },
    {
      title: '归属角色',
      dataIndex: 'roleIds',
      valueType: 'select',
      request: async () => {
        const { data } = await fetchRoleAuthList();
        return data.map((item) => ({ label: item.name, value: item.id }));
      },
      fieldProps: {
        mode: 'multiple',
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      formItemProps: {
        rules: [
          {
            message: '手机号码长度必须为11位',
            len: 11,
          },
        ],
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      formItemProps: {
        rules: [
          {
            message: '请输入正确的邮箱',
            type: 'email',
          },
        ],
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      initialValue: UserSexEnum.Secret,
      valueEnum: UserValueEnum.Sex,
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      initialValue: 1,
      tooltip: '设置[禁用]后用户将无法登录系统',
      valueEnum: UserValueEnum.Status,
    },
  ];
  const formRef = useRef<ProFormInstance>();
  return (
    <BetaSchemaForm<OperationDeptDTO>
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
      layoutType="DrawerForm"
      drawerProps={{
        maskClosable: false,
      }}
      title={`${props.type === 'create' ? '新增' : '修改'}用户`}
      onFinish={async (values) => {
        if (props.type === 'create') {
          await createUser(values);
        } else if (props.node?.id) {
          await updateUser(props.node.id as number, values);
        }
        props.onRefresh?.();
        message.success('操作成功');
        return true;
      }}
    />
  );
}
export default UserModal;
