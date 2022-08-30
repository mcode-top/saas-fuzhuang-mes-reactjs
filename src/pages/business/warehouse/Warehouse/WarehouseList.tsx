import { fetchRemoveWarehouse, fetchWarehouseList } from '@/apis/business/warehouse';
import type { BusWarehouseType } from '@/apis/business/warehouse/typing';
import { WarehouseEnumValueEnum } from '@/configs/commValueEnum';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import type { ActionType } from '@ant-design/pro-table';
import { Button, Descriptions, message, Modal, Space } from 'antd';
import React from 'react';
import { useContext } from 'react';
import WarehouseTypeTag from '../components/WarehouseTypeTag';
import { WarehouseContext } from '../context';
import WarehouseListModal from './WarehouseListModal';

/**@naem 仓库列表 */
const WarehouseList: React.FC = () => {
  const wContext = useContext(WarehouseContext);

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
          valueEnum: WarehouseEnumValueEnum.WarehouseType,
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
          data: await fetchWarehouseList().then((res) => {
            // 测试使用
            wContext.setCurrentWarehouse?.(res.data[0]);
            return res.data;
          }),
        };
      }}
    />
  );
};
/**@name 子元素操作栏 */
const toolBarRender = (action: ActionType | undefined) => {
  return [
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
    </WarehouseListModal>,
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

/**@name 列表操作栏 */
const ActionExtra = (props: { action: ActionType | undefined; record: BusWarehouseType }) => {
  const wContext = useContext(WarehouseContext);

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
    </Space>
  );
};

export default WarehouseList;
