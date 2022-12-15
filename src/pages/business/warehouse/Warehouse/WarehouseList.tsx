import { fetchRemoveWarehouse, fetchWarehouseList } from '@/apis/business/warehouse';
import type { BusWarehouseType } from '@/apis/business/warehouse/typing';
import { WarehouseTypeValueEnum } from '@/configs/commValueEnum';
import { STORAGE_WAREHOUSE_LIST } from '@/configs/storage.config';
import storageDataSource from '@/utils/storage';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Descriptions, message, Modal, Space } from 'antd';
import React, { useEffect } from 'react';
import { useContext } from 'react';
import WarehouseTypeTag from '../components/WarehouseTypeTag';
import { WarehouseContext } from '../context';
import WarehouseListModal from './WarehouseListModal';
import { Access, history, useAccess } from 'umi';
import { ApiMethodEnum } from '@/apis/person/typings';

/**@naem 仓库列表 */
const WarehouseList: React.FC = () => {
  const wContext = useContext(WarehouseContext);
  const access = useAccess();
  /**@name 子元素操作栏 */
  const toolBarRender = (action: ActionType | undefined) => {
    return [
      <Access accessible={access.checkShowAuth('/warehouse', ApiMethodEnum.POST)} key="create">
        <WarehouseListModal
          key="WarehouseListModal"
          node={{ type: 'create' }}
          title="新增仓库"
          onFinish={() => {
            action?.reload();
            message.success('新增成功');
          }}
        >
          <Button key="4" type="primary" icon={<PlusOutlined />}>
            新增仓库
          </Button>
        </WarehouseListModal>
      </Access>,
      <Button
        type="primary"
        key="search"
        icon={<SearchOutlined />}
        onClick={() => {
          window.tabsAction.goBackTab('/search-warehouse');
        }}
      >
        搜索仓库货品
      </Button>,
      <Button
        key="3"
        icon={<ReloadOutlined />}
        onClick={() => {
          action?.reload();
        }}
      >
        刷新
      </Button>,
    ];
  };

  return (
    <ProList<BusWarehouseType>
      grid={{ gutter: 12, column: 3 }}
      showActions="hover"
      headerTitle="仓库列表"
      pagination={{
        defaultPageSize: 12,
        showSizeChanger: false,
      }}
      cardProps={{
        headStyle: { padding: 12, margin: 0 },
        bodyStyle: { padding: 12, margin: 0 },
      }}
      metas={{
        title: {
          dataIndex: 'name',
          render: (dom) => {
            return <div style={{ marginLeft: -6 }}>{dom}</div>;
          },
        },
        subTitle: {
          dataIndex: 'type',
          valueEnum: WarehouseTypeValueEnum.WarehouseType,
          render(dom, entity, index, action, schema) {
            return <WarehouseTypeTag type={entity.type} />;
          },
        },
        content: {
          dataIndex: '',
          render(dom, entity, index, action, schema) {
            return (
              <Descriptions column={2} size="small" style={{ marginTop: -18 }}>
                <Descriptions.Item label="编码">{entity.code}</Descriptions.Item>
                <Descriptions.Item label="仓库位置">{entity.position}</Descriptions.Item>
                <Descriptions.Item label="货架最大数量">{entity.maxCapacity}</Descriptions.Item>
                <Descriptions.Item label="描述备注">
                  <span
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {entity.remark}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            );
          },
        },
        actions: {
          cardActionProps: 'extra',
          render(dom, entity, index, action, schema) {
            return <ActionExtra record={entity} action={action} />;
          },
        },
      }}
      actionRef={wContext.warehouseAction}
      toolBarRender={toolBarRender}
      request={async () => {
        return {
          data: await storageDataSource.getValue(STORAGE_WAREHOUSE_LIST, true).then((res) => {
            // // TODO:测试使用
            // wContext.setCurrentWarehouse?.(res.data[0]);
            return res.data;
          }),
        };
      }}
    />
  );
};

/**@name 列表操作栏 */
const ActionExtra = (props: { action: ActionType | undefined; record: BusWarehouseType }) => {
  const wContext = useContext(WarehouseContext);
  const access = useAccess();

  return (
    <Space>
      <Button
        type="link"
        size="small"
        onClick={() => {
          wContext.setCurrentWarehouse?.(props.record);
          return null;
        }}
      >
        进入仓库
      </Button>
      <Access accessible={access.checkShowAuth('/warehouse', ApiMethodEnum.PATCH)} key="update">
        <WarehouseListModal
          key="WarehouseListModalupdate"
          node={{ type: 'update', value: props.record }}
          title="修改仓库"
          onFinish={() => {
            props?.action?.reload();
            message.success('修改成功');
          }}
        >
          <Button type="link" size="small">
            修改仓库
          </Button>
        </WarehouseListModal>
      </Access>
      <Access
        accessible={access.checkShowAuth('/warehouse/remove/:id', ApiMethodEnum.POST)}
        key="update"
      >
        <Button
          type="link"
          danger
          size="small"
          onClick={() => {
            Modal.confirm({
              title: '系统提示',
              content: `删除此仓库后该仓库的货架及货品将全部消失,您确定要删除[${props.record.name}]仓库吗?`,
              onOk: () => {
                return fetchRemoveWarehouse(props.record.id).then(() => {
                  message.success('删除成功');
                  props?.action?.reload();
                });
              },
            });
          }}
        >
          删除仓库
        </Button>
      </Access>
    </Space>
  );
};

export default WarehouseList;
