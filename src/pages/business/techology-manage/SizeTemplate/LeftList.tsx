import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import type { BusSizeTemplateParentType } from './typing';
import { Menu, Item, useContextMenu } from 'react-contexify';
import {
  MinusOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Card, message, Modal, Space, Tooltip, Tree } from 'antd';
import LoadingButton from '@/components/Comm/LoadingButton';
import styles from './index.less';
import { fetchRemoveOneParent } from '@/apis/business/techology-manage/size-template';
import SizeTemplateParentListModal from './ListModal';
import storageDataSource from '@/utils/storage';
import { STORAGE_SIZE_TEMPLATE_LIST } from '@/configs/storage.config';
import type { RightMenuInstance } from '@/components/typing';

const BusSizeTemplateLeftList: React.FC<{
  onSelect: (selectId: number | undefined, node: BusSizeTemplateParentType | undefined) => void;
}> = (props) => {
  const [list, setList] = useState<BusSizeTemplateParentType[]>([]);
  const [rightNode, setRightNode] = useState<BusSizeTemplateParentType>();
  const [selectId, setSelectId] = useState<number | undefined>(undefined);
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  /**@name 右键菜单 */
  const rightMenuRef = useRef<RightMenuInstance>(null);
  /**@name 修改尺码模板对话框*/
  const updateModalRef = useRef<HTMLDivElement>(null);
  /**@name 查看尺码模板对话框*/
  const watchModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    props?.onSelect?.(
      selectId,
      list.find((i) => i.id === selectId),
    );
  }, [selectId]);
  useEffect(() => {
    requestList();
  }, []);
  async function requestList() {
    setLoading(true);
    const data = (
      await storageDataSource.getValue(STORAGE_SIZE_TEMPLATE_LIST, true).finally(() => {
        setLoading(false);
      })
    ).data;
    setList(data);
  }
  return (
    <Card
      style={{ minHeight: '100%' }}
      loading={loading}
      title={
        <Space>
          尺码模板列表
          <Tooltip title="如果需要删除或者修改尺码模板可以移动对应的尺码模板列表上右击选择操作">
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      }
      extra={
        <Space>
          <SizeTemplateParentListModal
            node={{ type: 'create' }}
            title="新增尺码模板"
            onFinish={() => {
              requestList();
              message.success('新增成功');
            }}
          >
            <Button type="link">新增尺码模板</Button>
          </SizeTemplateParentListModal>
          <LoadingButton type="link" icon={<ReloadOutlined />} onLoadingClick={requestList}>
            刷新
          </LoadingButton>
        </Space>
      }
    >
      <SizeTemplateParentListModal
        node={{ type: 'update', value: rightNode }}
        title="修改尺码模板"
        onFinish={() => {
          requestList();
          message.success('修改成功');
        }}
      >
        <div ref={updateModalRef} />
      </SizeTemplateParentListModal>
      <RightMenuDom
        refresh={requestList}
        watchRef={watchModalRef}
        updateRef={updateModalRef}
        record={rightNode as any}
        ref={rightMenuRef}
      />
      <Tree
        defaultExpandAll={true}
        treeData={list as any}
        blockNode={true}
        expandedKeys={expandedKeys}
        selectedKeys={[selectId as number]}
        fieldNames={{
          title: 'name',
          key: 'id',
        }}
        onExpand={(keys) => {
          setExpandedKeys(keys as number[]);
        }}
        onRightClick={({ event, node }) => {
          setRightNode(node as any);
          rightMenuRef.current?.show(event);
        }}
        onSelect={(keys) => setSelectId(+keys[0] || undefined)}
        titleRender={(nodeData: any) => {
          return (
            <div key={nodeData.id} className={styles.tree_leaf}>
              {nodeData.name}
            </div>
          );
        }}
      />
    </Card>
  );
};

/**@name 右键菜单 */
const RightMenuDom = forwardRef(
  (
    props: {
      record: BusSizeTemplateParentType;
      updateRef: React.RefObject<HTMLDivElement>;
      watchRef: React.RefObject<HTMLDivElement>;
      refresh: () => Promise<void>;
    },
    ref: React.Ref<RightMenuInstance>,
  ) => {
    const MenuId = 'sizeTemplate';
    const { show } = useContextMenu({
      id: MenuId,
    });
    useImperativeHandle(ref, () => ({
      show,
    }));
    return (
      <Menu id={MenuId}>
        <Item
          key="modify"
          onClick={() => {
            props?.updateRef?.current?.click?.();
          }}
        >
          <Space>
            <PlusOutlined />
            修改尺码模板
          </Space>
        </Item>
        <Item
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: '系统提示',
              content: `您确定要删除[${props.record.name}]尺码模板吗?删除后尺码将不存在`,
              onOk: () => {
                return new Promise(async (resolve, reject) => {
                  try {
                    await fetchRemoveOneParent(props.record.id as any);
                    props.refresh();
                    message.success('删除成功');
                    resolve(true);
                  } catch (error) {
                    reject(error);
                    console.error(error);
                  }
                });
              },
            });
          }}
        >
          <Space>
            <MinusOutlined />
            删除尺码模板
          </Space>
        </Item>
      </Menu>
    );
  },
);

export default BusSizeTemplateLeftList;
