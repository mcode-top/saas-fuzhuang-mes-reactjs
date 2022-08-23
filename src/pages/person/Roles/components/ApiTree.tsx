/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-08 10:14:31
 * @Description: 接口描述
 */

import { updateRoleInApis, updateRoleInMenus } from '@/apis/person/roles';
import type { ApiTreeType, RoleTreeType } from '@/apis/person/typings';
import { ApiDataAccessEnum, ApiMethodEnum, ApiTypeEnum } from '@/apis/person/typings';
import { traverseTree } from '@/utils';
import { ScheduleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Descriptions, Divider, message, Modal, Space, Tag, Tree } from 'antd';
import type { Key } from 'react';
import { useEffect, useState } from 'react';
import { Item, Menu, useContextMenu } from 'react-contexify';
import styles from '../index.less';

type TreeSelectKeys = { checked: Key[]; halfChecked: Key[] };

/**
 * 接口列表
 * @param props
 * @returns
 */
export default function ApiTree(props: {
  authApiTree: ApiTreeType[];
  role: RoleTreeType | undefined;
  selectedMenus: number[];
  onChange?: (selectedKeys: number[]) => void;
}) {
  const [checkedKeys, setCheckedKeys] = useState<TreeSelectKeys>();
  const [autoOpenTreeKeys, setAutoOpenTreeKeys] = useState<number[]>([]);
  const [rightMenuNode, setRightNode] = useState<ApiTreeType | undefined>();
  const MenuId = 'selectMenu';

  useEffect(() => {
    setCheckedKeys({
      checked: props.selectedMenus,
      halfChecked: [],
    });
  }, [props.selectedMenus]);
  useEffect(() => {
    const openKeys: number[] = [];
    traverseTree(props.authApiTree, (node: ApiTreeType) => {
      openKeys.push(node.id);
    });
    setAutoOpenTreeKeys(openKeys);
  }, [props.authApiTree]);
  const { show } = useContextMenu({
    id: MenuId,
  });
  async function handleSubmit() {
    if (props?.role) {
      Modal.confirm({
        title: `您确定要更改当前接口到[${props.role.name}]角色中吗`,
        onOk: () => {
          const keys = (checkedKeys?.checked as number[]) || [];
          return updateRoleInApis(props?.role?.id as number, keys).then(() => {
            props?.onChange?.(keys);
            message.success('修改成功');
          });
        },
      });
    }
  }
  return (
    <>
      <Tree<ApiTreeType>
        fieldNames={{ title: 'name', key: 'id' }}
        titleRender={(nodeData) => {
          return (
            <div
              style={{ display: 'flex' }}
              className={styles['tree-item']}
              onContextMenu={(event) => {
                show(event);
                setRightNode(nodeData);
              }}
            >
              <div>
                <ApiTag type={nodeData.type} />
              </div>
              <Descriptions size="small">
                <Descriptions.Item label="名称">{nodeData.name}</Descriptions.Item>
                <Descriptions.Item label="说明" span={2}>
                  {nodeData.description}
                </Descriptions.Item>
              </Descriptions>
            </div>
          );
        }}
        onCheck={(keys, event) => {
          setCheckedKeys(keys as TreeSelectKeys);
        }}
        checkedKeys={checkedKeys}
        expandedKeys={autoOpenTreeKeys}
        onExpand={(keys) => {
          setAutoOpenTreeKeys(keys as number[]);
        }}
        selectable={false}
        checkStrictly={true}
        checkable={Boolean(props.role)}
        treeData={props.authApiTree}
        blockNode={true}
      />
      {Boolean(props.role)
        ? [
            <Divider key="1" />,
            <div key="2" style={{ display: 'flex', justifyContent: 'center' }}>
              <Space>
                <Button
                  onClick={() => {
                    setCheckedKeys({
                      checked: props.selectedMenus,
                      halfChecked: [],
                    });
                  }}
                >
                  重置
                </Button>
                <Button type="primary" onClick={handleSubmit}>
                  提交
                </Button>
              </Space>
            </div>,
          ]
        : null}
      <Menu id={MenuId}>
        <Item
          onClick={() => {
            if (rightMenuNode) {
              Modal.info({
                title: '查看菜单详情',
                width: 800,
                content: <ApiDesciption info={rightMenuNode} />,
              });
            }
          }}
        >
          <Space>
            <ScheduleOutlined />
            查看菜单详情
          </Space>
        </Item>
      </Menu>
    </>
  );
}
function ApiTag(props: { type: ApiTypeEnum }) {
  if (props.type === ApiTypeEnum.CATALOG) {
    return <Tag color="purple">目录</Tag>;
  } else if (props.type === ApiTypeEnum.LINK) {
    return <Tag color="blue">接口</Tag>;
  } else {
    return <Tag>未知</Tag>;
  }
}

function ApiDesciption(props: { info: ApiTreeType }) {
  return (
    <Descriptions column={2}>
      <Descriptions.Item label="接口类型">
        <ApiTag type={props.info.type} />
      </Descriptions.Item>
      <Descriptions.Item label="接口名称">{props.info.name}</Descriptions.Item>
      <Descriptions.Item label="接口说明">{props.info.description}</Descriptions.Item>
      <Descriptions.Item label="接口地址">{props.info.uri}</Descriptions.Item>
      <Descriptions.Item label="请求方式">{ApiMethodEnum[props.info.method]}</Descriptions.Item>
      {props.info.auth ? (
        <Descriptions.Item label="数据权限">
          {ApiDataAccessEnum[props.info.dataAccess]}
        </Descriptions.Item>
      ) : null}
    </Descriptions>
  );
}
