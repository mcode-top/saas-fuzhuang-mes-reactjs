import { BusWarehouseTypeEnum } from '@/apis/business/warehouse/typing';
import { Tag } from 'antd';
import React from 'react';

const WarehouseTypeTag: React.FC<{ type: BusWarehouseTypeEnum }> = (props) => {
  if (props.type === BusWarehouseTypeEnum.Product) {
    return <Tag color="#5BD8A6">成品</Tag>;
  } else if (props.type === BusWarehouseTypeEnum.Material) {
    return <Tag color="#1890ff">材料</Tag>;
  }
  return <Tag color="#531dab">混合</Tag>;
};
export default WarehouseTypeTag;
