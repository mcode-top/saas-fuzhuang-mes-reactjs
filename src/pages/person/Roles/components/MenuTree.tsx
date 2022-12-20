import { updateRoleInMenus } from '@/apis/person/roles';
import type { MenuTreeType, RoleTreeType } from '@/apis/person/typings';
import { MenuTypeEnum } from '@/apis/person/typings';
import { traverseTree } from '@/utils';
import { ScheduleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Descriptions, Divider, message, Modal, Space, Tag, Tree } from 'antd';
import type { Key } from 'react';
import { useEffect, useState } from 'react';
import { Item, Menu, useContextMenu } from 'react-contexify';
import styles from '../index.less';

/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-08 10:14:31
 * @Description: 文件描述
 */
type TreeSelectKeys = { checked: Key[]; halfChecked: Key[] };

/**
 * 菜单列表
 * @param props
 * @returns
 */
export default function MenuTree(props: {
  authMenu: MenuTreeType[];
  role: RoleTreeType | undefined;
  selectedMenus: number[];
  onChange?: (selectedKeys: number[]) => void;
}) {
  const [checkedKeys, setCheckedKeys] = useState<TreeSelectKeys>();
  const [autoOpenTreeKeys, setAutoOpenTreeKeys] = useState<number[]>([]);
  const [rightMenuNode, setRightNode] = useState<MenuTreeType | undefined>();
  const MenuId = 'selectMenu';

  useEffect(() => {
    setCheckedKeys({
      checked: props.selectedMenus,
      halfChecked: [],
    });
  }, [props.selectedMenus]);
  useEffect(() => {
    const openKeys: number[] = [];
    traverseTree(props.authMenu, (node: MenuTreeType) => {
      openKeys.push(node.id);
    });
    setAutoOpenTreeKeys(openKeys);
  }, [props.authMenu]);
  const { show } = useContextMenu({
    id: MenuId,
  });
  async function handleSubmit() {
    if (props?.role) {
      Modal.confirm({
        title: `您确定要更改当前菜单到[${props.role.name}]角色中吗`,
        onOk: () => {
          const keys = (checkedKeys?.checked as number[]) || [];
          return updateRoleInMenus(props?.role?.id as number, keys).then(() => {
            props?.onChange?.(keys);
            message.success('修改成功');
          });
        },
      });
    }
  }
  return (
    <>
      <Tree<MenuTreeType>
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
                <MenuTag type={nodeData.type} />
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
          let selectKeys = (keys as TreeSelectKeys).checked;
          // 如果选择的是目录则支持一键选择或一键取消
          if (event.node.type === MenuTypeEnum.CATALOG) {
            if (event.checked) {
              event.node.children?.forEach((i) => {
                const findIndex = selectKeys.findIndex((s) => s === i.id);
                if (findIndex === -1) {
                  selectKeys.push(i.id);
                }
              });
            } else {
              selectKeys = selectKeys.filter((s) => {
                const findIndex = event.node.children?.findIndex((i) => s === i.id);
                if (findIndex === -1 || findIndex === undefined) {
                  return true;
                } else {
                  return false;
                }
              });
            }
          } else if (event.node.type === MenuTypeEnum.MENU) {
            // 如果选择的是菜单则自动添加父级目录
            if (selectKeys.findIndex((s) => s === event.node.parentId) === -1) {
              selectKeys.push(event.node.parentId);
            }
          }
          setCheckedKeys({ ...(keys as TreeSelectKeys), checked: selectKeys });
        }}
        checkedKeys={checkedKeys}
        expandedKeys={autoOpenTreeKeys}
        onExpand={(keys) => {
          setAutoOpenTreeKeys(keys as number[]);
        }}
        selectable={false}
        checkStrictly={true}
        checkable={Boolean(props.role)}
        treeData={props.authMenu}
        blockNode={true}
        fieldNames={{ title: 'name', key: 'id' }}
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
                content: <MenuDesciption info={rightMenuNode} />,
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
function MenuDesciption(props: { info: MenuTreeType }) {
  return (
    <Descriptions column={2}>
      <Descriptions.Item label="菜单类型">
        <MenuTag type={props.info.type} />
      </Descriptions.Item>
      <Descriptions.Item label="菜单名称">{props.info.name}</Descriptions.Item>
      <Descriptions.Item label="菜单说明">{props.info.description}</Descriptions.Item>
      <Descriptions.Item label="指向文件地址">{props.info.router}</Descriptions.Item>
      <Descriptions.Item label="视图地址">{props.info.viewPath}</Descriptions.Item>
      <Descriptions.Item label="是否缓存">
        <Checkbox checked={props.info.keepAlive} disabled />
      </Descriptions.Item>
      <Descriptions.Item label="是否显示">
        <Checkbox checked={props.info.isShow} disabled />
      </Descriptions.Item>
    </Descriptions>
  );
}

function MenuTag(props: { type: MenuTypeEnum }) {
  if (props.type === MenuTypeEnum.CATALOG) {
    return <Tag color="purple">目录</Tag>;
  } else if (props.type === MenuTypeEnum.LINK) {
    return <Tag color="blue">链接</Tag>;
  } else if (props.type === MenuTypeEnum.MENU) {
    return <Tag color="green">菜单</Tag>;
  } else {
    return <Tag>未知</Tag>;
  }
}
