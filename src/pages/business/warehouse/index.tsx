import { Button, Card, Col, Descriptions, Row } from 'antd';
import React from 'react';
import WarehouseTypeTag from './components/WarehouseTypeTag';
import { useDefaultWarehouse, WarehouseContext } from './context';
import BusWarehouseGoodsTable from './Goods/GoodsTable';
import ShelfSimpleSelectList from './Shelf/ShelfSimpleSelectList';
import WarehouseList from './Warehouse/WarehouseList';
const WarehouseDom: React.FC = () => {
  const wContext = useDefaultWarehouse();

  return (
    <WarehouseContext.Provider value={wContext}>
      {wContext.currentWarehouse ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Card
            title="仓库信息"
            size="small"
            style={{ flexShrink: 0, marginBottom: 12 }}
            extra={
              <Button
                type="primary"
                onClick={() => {
                  wContext.setCurrentWarehouse?.(undefined);
                  wContext.setCurrentShelfNode?.(undefined);
                }}
              >
                返回仓库列表
              </Button>
            }
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="仓库名称">
                {wContext.currentWarehouse.name}
              </Descriptions.Item>
              <Descriptions.Item label="仓库编码">
                {wContext.currentWarehouse.code}
              </Descriptions.Item>
              <Descriptions.Item label="仓库类型">
                <WarehouseTypeTag type={wContext.currentWarehouse.type} />
              </Descriptions.Item>
              <Descriptions.Item label="货架最大数量">
                {wContext.currentWarehouse.maxCapacity}
              </Descriptions.Item>
              <Descriptions.Item label="仓库位置">
                {wContext.currentWarehouse.position}
              </Descriptions.Item>
              <Descriptions.Item label="备注信息">
                <span
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                >
                  {wContext.currentWarehouse.remark}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={[24, 0]} style={{ height: '100%', flexGrow: 1 }}>
            <Col span={6} style={{ height: '100%' }}>
              <ShelfSimpleSelectList />
            </Col>
            <Col span={18}>
              <BusWarehouseGoodsTable />
            </Col>
          </Row>
        </div>
      ) : (
        <WarehouseList />
      )}
    </WarehouseContext.Provider>
  );
};

export default WarehouseDom;
