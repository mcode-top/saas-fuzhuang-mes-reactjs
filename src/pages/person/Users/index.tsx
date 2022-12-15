import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Card, Space, Row, Col, Tree, Tag, Button, Modal, Tooltip } from 'antd';
import { deleteDept, deleteUser, fetchDeptTree, fetchUserList } from '@/apis/person/users';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import _ from 'lodash';
import { fetchRoleAuthList } from '@/apis/person/roles';
import styles from './index.less';
import { traverseTree } from '@/utils';
import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import { MinusOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import DeptModal from './components/DeptModal';
import UserModal from './components/UserModal';
import { ProFormInstance } from '@ant-design/pro-form';
import { UserValueEnum } from '@/configs/commValueEnum';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import type { DeptTreeType, UserListItem } from '@/apis/person/typings';
import { ApiMethodEnum } from '@/apis/person/typings';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import { Access, useAccess } from 'umi';

const Users: React.FC = () => {
  const [selectDeptId, setSelectDeptId] = useState<number | undefined>(undefined);

  return (
    <Row gutter={[24, 0]} style={{ height: '100%', overflow: 'auto' }}>
      <Col span={6}>
        <TreeDept onSelect={setSelectDeptId} />
      </Col>
      <Col span={18}>
        <TableUser selectDeptId={selectDeptId} />
      </Col>
    </Row>
  );
};

export default Users;

function TableUser(props: { selectDeptId: number | undefined }) {
  const [userOperationModal, setUserOperationModal] = useState({
    type: 'create',
    visible: false,
    node: {},
  });
  const tableRef = useRef<ActionType>();
  const access = useAccess();
  const columns: ProColumns<UserListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '所属部门',
      render: (dom, item) => item.dept?.name || <Tag color="red">用户部门被删除</Tag>,
      search: false,
    },
    {
      title: '角色标签',
      render: (dom, item) => (
        <Space>
          {item.roleList?.map((role) => (
            <Tag color="#3b5999" key={role.id}>
              {role.name}
            </Tag>
          ))}
        </Space>
      ),
      hideInSearch: true,
    },
    {
      title: '筛选角色',
      valueType: 'select',
      dataIndex: 'roleList.id',
      hideInTable: true,
      request: async () => {
        const { data } = await fetchRoleAuthList();
        return data.map((item) => ({ label: item.name, value: item.id }));
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: UserValueEnum.Sex,
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      valueEnum: UserValueEnum.Status,
    },
    ...COM_PRO_TABLE_TIME.createdAt,
    {
      title: '操作',
      render: (dom, data) => {
        return (
          <Space>
            <Access
              accessible={access.checkShowAuth('/user/:id', ApiMethodEnum.PATCH)}
              key="update"
            >
              <Button
                onClick={() => {
                  setUserOperationModal({
                    node: { ...data, roleIds: data.roleList?.map((role) => role.id) },
                    visible: true,
                    type: 'update',
                  });
                }}
              >
                修改
              </Button>
            </Access>
            <Access
              accessible={access.checkShowAuth('/user/:id', ApiMethodEnum.DELETE)}
              key="DELTETE"
            >
              <Button
                type="primary"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `删除[${data.name}]用户`,
                    content: '删除用户可能会导致与该用户绑定数据失效,这里建议将用户状态修改为禁用',
                    okText: '删除',
                    onOk: async () => {
                      await deleteUser(data.id);
                      await tableRef.current?.reload();
                    },
                  });
                }}
              >
                删除
              </Button>
            </Access>
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <UserModal
        visible={userOperationModal.visible}
        type={userOperationModal.type as any}
        node={userOperationModal.node}
        onRefresh={() => {
          tableRef?.current?.reload();
        }}
        onVisibleChange={(v) => {
          setUserOperationModal({ ...userOperationModal, visible: v });
        }}
      />
      <ProTable
        columns={columns}
        params={{ deptId: props.selectDeptId }}
        actionRef={tableRef}
        rowKey="id"
        headerTitle="用户列表"
        toolBarRender={() => {
          return [
            <Access accessible={access.checkShowAuth('/user', ApiMethodEnum.POST)} key="create">
              <Button
                type="primary"
                onClick={() => {
                  setUserOperationModal({ node: {}, type: 'create', visible: true });
                }}
              >
                新增用户
              </Button>
              ,
            </Access>,
          ];
        }}
        request={async (params, sort, filter) => {
          return nestPaginationTable(params, sort, filter, fetchUserList);
        }}
      />
    </>
  );
}

function TreeDept(props: { onSelect: (selectId: number | undefined) => void }) {
  const [deptTree, setDeptTree] = useState<DeptTreeType[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
  const [rightDeptNode, setRightDeptNode] = useState<DeptTreeType>();
  const [selectDeptId, setSelectDeptId] = useState<number | undefined>(undefined);
  const access = useAccess();
  useEffect(() => {
    props?.onSelect?.(selectDeptId);
  }, [selectDeptId]);
  const [deptOperationModal, setDeptOperationModal] = useState({
    type: 'create',
    visible: false,
    node: {},
  });
  const MenuId = 'dept';
  const { show } = useContextMenu({
    id: MenuId,
  });
  useEffect(() => {
    fetchDeptTreeFormView();
  }, []);
  async function fetchDeptTreeFormView() {
    const { data } = await fetchDeptTree();
    const et: any[] = [];
    traverseTree(data, (leaf) => {
      et.push(leaf.id);
    });
    setExpandedKeys(et);
    setDeptTree(data);
  }
  return (
    <Card
      style={{ minHeight: '100%' }}
      title={
        <Space>
          部门列表
          <Tooltip title="如果需要删除或者修改部门可以移动对应的部门列表上右击选择操作">
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      }
      extra={
        <Space>
          <Access accessible={access.checkShowAuth('/dept', ApiMethodEnum.POST)} key="create">
            <Button
              type="link"
              onClick={() => {
                setDeptOperationModal({ node: {}, type: 'create', visible: true });
              }}
            >
              新增部门
            </Button>
          </Access>
        </Space>
      }
    >
      <DeptModal
        type={deptOperationModal.type as any}
        visible={deptOperationModal.visible}
        node={deptOperationModal.node}
        onRefresh={fetchDeptTreeFormView}
        onVisibleChange={(v) => {
          setDeptOperationModal({ ...deptOperationModal, visible: v });
        }}
      />
      <Menu id={MenuId}>
        <Access accessible={access.checkShowAuth('/dept', ApiMethodEnum.PATCH)} key="create">
          <Item
            onClick={() => {
              setDeptOperationModal({
                node: rightDeptNode as DeptTreeType,
                type: 'update',
                visible: true,
              });
            }}
          >
            <Space>
              <PlusOutlined />
              修改部门
            </Space>
          </Item>
        </Access>
        <Access accessible={access.checkShowAuth('/dept', ApiMethodEnum.DELETE)} key="delete">
          <Item
            onClick={() => {
              if (rightDeptNode) {
                Modal.confirm({
                  title: `删除[${rightDeptNode.name}]部门`,
                  type: 'error',
                  content: `删除当前部门前请确认已做好对部门及其子部门用户的转移,否则删除部门后对应用户账号将无法正常使用`,
                  onOk: async () => {
                    await deleteDept(rightDeptNode.id);
                    await fetchDeptTreeFormView();
                  },
                });
              }
            }}
          >
            <Space>
              <MinusOutlined />
              删除部门
            </Space>
          </Item>
        </Access>
      </Menu>
      <Tree
        defaultExpandAll={true}
        treeData={deptTree}
        blockNode={true}
        expandedKeys={expandedKeys}
        selectedKeys={[selectDeptId as number]}
        onExpand={(keys) => {
          setExpandedKeys(keys as number[]);
        }}
        onRightClick={({ event, node }) => {
          setRightDeptNode(node as any);
          show(event);
        }}
        onSelect={(keys) => setSelectDeptId(+keys[0] || undefined)}
        fieldNames={{ title: 'name', key: 'id' }}
        titleRender={(nodeData) => {
          return (
            <div key={nodeData.id} className={styles.tree_leaf}>
              {nodeData.name}
            </div>
          );
        }}
      />
    </Card>
  );
}
