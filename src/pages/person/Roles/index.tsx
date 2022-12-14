/* eslint-disable react/jsx-key */
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-03 13:43:36
 * @Description: 角色管理
 */

import { Button, Card, Col, Descriptions, Modal, Row, Space, Tag, Tooltip, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import {
  deleteRole,
  fetchApiAuthTree,
  fetchIdToRoleInfo,
  fetchMenuAuthTree,
  fetchRoleTree,
} from '@/apis/person/roles';
import { traverseTree } from '@/utils';
import styles from './index.less';
import type { EventDataNode } from 'antd/lib/tree';
import {
  MinusOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { Item, Menu, useContextMenu } from 'react-contexify';
import * as _ from 'lodash';
import RoleModal from './components/RoleModal';
import MenuTree from './components/MenuTree';
import ApiTree from './components/ApiTree';
import type { ApiTreeType, MenuTreeType, RoleTreeType } from '@/apis/person/typings';

const Roles: React.FC = () => {
  const [menuTree, setMenuTree] = useState<MenuTreeType[]>([]);
  const [roleInMenuIds, setRoleInMenuIds] = useState<number[]>([]);

  const [apiTree, setApiTree] = useState<ApiTreeType[]>([]);
  const [roleInApiIds, setRoleInApiIds] = useState<number[]>([]);

  const [selectRole, setSelectRole] = useState<RoleTreeType | undefined>(undefined);
  const [fetchRoleInfoFormViewLoading, setFetchRoleInfoFormViewLoading] = useState(false);
  const [tabActiveKey, setTabActiveKey] = useState('menu');

  useEffect(() => {
    if (selectRole !== undefined) {
      setFetchRoleInfoFormViewLoading(true);
      fetchIdToRoleInfo(selectRole?.id)
        .then(({ data }) => {
          setRoleInMenuIds(data?.menuList?.map((menu) => menu.id) || []);
          setRoleInApiIds(data?.apiList?.map((api) => api.id) || []);
        })
        .finally(() => setFetchRoleInfoFormViewLoading(false));
    }
  }, [selectRole]);

  async function fetchMenuTreeFormView() {
    const { data } = await fetchMenuAuthTree();
    setMenuTree(data);
  }
  async function fetchApiTreeFormView() {
    const { data } = await fetchApiAuthTree();
    setApiTree(data);
  }
  useEffect(() => {
    fetchMenuTreeFormView();
    fetchApiTreeFormView();
  }, []);
  return (
    <Row gutter={[24, 0]} style={{ height: '100%', overflow: 'auto' }}>
      <Col span={6}>
        <RoleTree onSelect={setSelectRole} />
      </Col>
      <Col span={18}>
        <ProCard
          loading={fetchRoleInfoFormViewLoading}
          tabs={{
            type: 'line',
            activeKey: tabActiveKey,
            onChange: setTabActiveKey,
          }}
          title="权限配置"
          headerBordered
          split="vertical"
        >
          <ProCard.TabPane key="menu" tab="菜单配置">
            <MenuTree
              authMenu={menuTree}
              role={selectRole}
              selectedMenus={roleInMenuIds}
              onChange={(selectRoleInMenuIds) => {
                setRoleInMenuIds(selectRoleInMenuIds);
              }}
            />
          </ProCard.TabPane>
          {/* TODO:功能未开发暂时不支持 */}
          {/* <ProCard.TabPane key="api" tab="接口配置">
            <ApiTree
              authApiTree={apiTree}
              role={selectRole}
              selectedMenus={roleInApiIds}
              onChange={(selectRoleInApiIds) => {
                setRoleInMenuIds(selectRoleInApiIds);
              }}
            />
          </ProCard.TabPane> */}
        </ProCard>
      </Col>
    </Row>
  );
};

function RoleTree(props: { onSelect?: (select: RoleTreeType | undefined) => void }) {
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
  const [selectRole, setSelectRole] = useState<RoleTreeType | undefined>(undefined);
  const [rightSelectRole, setRightSelectRole] = useState<RoleTreeType | undefined>(undefined);
  const [roleTree, setRoleTree] = useState<RoleTreeType[]>([]);
  const [roleOperationModal, setRoleOperationModal] = useState({
    type: 'create',
    visible: false,
    node: {},
  });
  const MenuId = 'roleMenu';
  const { show } = useContextMenu({ id: MenuId });
  useEffect(() => {
    fetchRoleTreeFormView();
  }, []);
  useEffect(() => {
    props?.onSelect?.(selectRole);
  }, [selectRole]);
  async function fetchRoleTreeFormView() {
    const { data } = await fetchRoleTree();
    const et: any[] = [];
    traverseTree(data, (leaf) => {
      et.push(leaf.id);
    });
    setExpandedKeys(et);
    setRoleTree(data);
  }
  return (
    <Card
      title={
        <Space>
          角色列表
          <Tooltip title="如果需要删除或者修改角色可以移动对应的角色列表上右击选择操作">
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      }
      style={{ minHeight: '100%' }}
      extra={
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setRoleOperationModal({ node: {}, type: 'create', visible: true });
            }}
          >
            新增角色
          </Button>
        </Space>
      }
    >
      <RoleModal
        type={roleOperationModal.type as any}
        visible={roleOperationModal.visible}
        node={roleOperationModal.node}
        onRefresh={fetchRoleTreeFormView}
        onVisibleChange={(v) => {
          setRoleOperationModal({ ...roleOperationModal, visible: v });
        }}
      />
      <Menu id={MenuId}>
        <Item
          onClick={() => {
            if (rightSelectRole) {
              setRoleOperationModal({
                node: rightSelectRole as RoleTreeType,
                type: 'update',
                visible: true,
              });
            }
          }}
        >
          <Space>
            <PlusOutlined />
            修改角色
          </Space>
        </Item>
        <Item
          onClick={() => {
            if (rightSelectRole) {
              Modal.confirm({
                title: `此次操作可能会影响到与该角色有关的用户使用,确定要将角色[${rightSelectRole.name}]删除吗?`,
                onOk: async () => {
                  await deleteRole(rightSelectRole.id);
                  return await fetchRoleTreeFormView();
                },
              });
            }
          }}
        >
          <Space>
            <MinusOutlined />
            删除角色
          </Space>
        </Item>
      </Menu>
      <Tree<RoleTreeType>
        defaultExpandAll={true}
        treeData={roleTree}
        blockNode={true}
        expandedKeys={expandedKeys}
        selectedKeys={selectRole?.id ? [selectRole?.id as number] : undefined}
        onExpand={(keys) => {
          setExpandedKeys(keys as number[]);
        }}
        onRightClick={({ event, node }) => {
          setRightSelectRole(node as any);
          show(event);
        }}
        onSelect={(keys, { node }) => {
          if (selectRole) {
            if ((node as any).id === selectRole.id) {
              return setSelectRole(undefined);
            }
          }
          setSelectRole((node as any) || undefined);
        }}
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

export default Roles;
