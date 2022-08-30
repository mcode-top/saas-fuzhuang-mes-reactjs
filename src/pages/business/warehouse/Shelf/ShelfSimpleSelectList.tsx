import { fetchRemoveWarehouseShelf, fetchWarehouseIdToShelfList } from '@/apis/business/warehouse';
import type { BusWarehouseShelfType } from '@/apis/business/warehouse/typing';
import SimpleColumnList from '@/components/Comm/SimpleColumnList';
import type { RightMenuInstance } from '@/components/typing';
import {
  EyeOutlined,
  InsertRowRightOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, message, Modal, Space } from 'antd';
import React, { useContext, useImperativeHandle } from 'react';
import { useState } from 'react';
import { Item, Menu, useContextMenu } from 'react-contexify';
import { WarehouseContext } from '../context';
import ShelfListModal from './ShelfListModal';

const ShelfSimpleSelectList: React.FC = () => {
  const wContext = useContext(WarehouseContext);
  const [rightNode, setRightNode] = useState<BusWarehouseShelfType>();
  /**@name 右键菜单 */
  const rightMenuRef = React.useRef<RightMenuInstance>(null);

  return (
    <Card
      style={{ height: '100%', flexDirection: 'column', display: 'flex' }}
      bodyStyle={{ padding: 0, flexGrow: 1, overflow: 'auto' }}
      extra={
        <Space>
          <ShelfListModal
            title="新增仓库货架"
            node={{ type: 'create', value: { warehouseId: wContext.currentWarehouse?.id } }}
            onFinish={() => {
              wContext?.shelfAction?.current?.reload();
            }}
          >
            <Button type="link">新增仓库货架</Button>
          </ShelfListModal>
          <Button
            type="link"
            onClick={() => {
              console.log('====================================');
              console.log(wContext);
              console.log('====================================');
              wContext?.shelfAction?.current?.reload();
            }}
          >
            刷新
          </Button>
        </Space>
      }
      title={<Space>货架列表</Space>}
    >
      <RightMenuDom ref={rightMenuRef} record={rightNode as BusWarehouseShelfType} />

      <SimpleColumnList<BusWarehouseShelfType>
        ref={wContext.shelfAction}
        columns={[
          {
            title: '货架名称',
            dataIndex: 'name',
            render: (value, record) => {
              return <div>{value}</div>;
            },
          },
        ]}
        rowKey="id"
        icon={
          <div style={{ paddingLeft: 10 }}>
            <InsertRowRightOutlined style={{ fontSize: 18 }} />
          </div>
        }
        selectKey={wContext.currentShelfNode?.id}
        onChange={(key, record) => {
          console.log(key, record);

          wContext.setCurrentShelfNode?.(record);
        }}
        tableProps={{
          onRow: (record) => {
            return {
              onContextMenu: (event) => {
                rightMenuRef.current?.show(event);
                setTimeout(() => {
                  setRightNode(record);
                }, 0);
              },
            };
          },
        }}
        request={async (param) => {
          if (!wContext.currentWarehouse?.id) {
            return { data: [] };
          }
          const { data } = await fetchWarehouseIdToShelfList(wContext.currentWarehouse?.id);
          if (data.length > 0) {
            const recordIndex = data.findIndex((i) => i.id === wContext.currentShelfNode?.id);
            if (!wContext.currentShelfNode || recordIndex === -1) {
              wContext.setCurrentShelfNode?.(data[0]);
            } else {
              wContext.setCurrentShelfNode?.({ ...data[recordIndex] });
            }
          }
          return {
            data,
          };
        }}
      />
    </Card>
  );
};
/**@name 右键菜单 */
const RightMenuDom = React.forwardRef(
  (
    props: {
      record: BusWarehouseShelfType;
    },
    ref: React.Ref<RightMenuInstance>,
  ) => {
    const wContext = useContext(WarehouseContext);
    /**@name 修改尺码模板对话框*/
    const updateModalRef = React.useRef<HTMLDivElement>(null);
    /**@name 查看尺码模板对话框*/
    const watchModalRef = React.useRef<HTMLDivElement>(null);

    const MenuId = 'sizeTemplate';
    const { show } = useContextMenu({
      id: MenuId,
    });
    useImperativeHandle(ref, () => ({
      show,
    }));
    return (
      <>
        <ShelfListModal
          title="修改仓库货架"
          node={{
            type: 'update',
            value: { ...props.record, warehouseId: wContext.currentWarehouse?.id },
          }}
          onFinish={() => {
            wContext?.shelfAction?.current?.reload();
          }}
        >
          <div ref={updateModalRef} />
        </ShelfListModal>
        <ShelfListModal
          title="查看仓库货架"
          node={{
            type: 'watch',
            value: { ...props.record, warehouseId: wContext.currentWarehouse?.id },
          }}
        >
          <div ref={watchModalRef} />
        </ShelfListModal>
        <Menu id={MenuId}>
          <Item
            key="watch"
            onClick={() => {
              watchModalRef.current?.click();
            }}
          >
            <Space>
              <EyeOutlined />
              查看仓库货架
            </Space>
          </Item>
          <Item
            key="modify"
            onClick={() => {
              updateModalRef.current?.click();
            }}
          >
            <Space>
              <PlusOutlined />
              修改仓库货架
            </Space>
          </Item>
          <Item
            key="delete"
            onClick={() => {
              Modal.confirm({
                title: '系统提示',
                content: `删除货架后货架中的货品将被清除,您确定要删除[${props.record.name}]货架吗?`,
                onOk: () => {
                  return new Promise(async (resolve, reject) => {
                    try {
                      await fetchRemoveWarehouseShelf(props.record.id);
                      wContext?.shelfAction?.current?.reload();
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
              删除仓库货架
            </Space>
          </Item>
        </Menu>
      </>
    );
  },
);

export default ShelfSimpleSelectList;
