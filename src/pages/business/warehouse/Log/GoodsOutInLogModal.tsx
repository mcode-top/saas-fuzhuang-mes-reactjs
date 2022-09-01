import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';

import React, { useContext, useRef } from 'react';

import type {
  BusWarehouseGoodsType,
  BusWarehouseLogType,
  BusWarehousePutInGoodsDto,
} from '@/apis/business/warehouse/typing';
import { BusWarehouseTypeEnum } from '@/apis/business/warehouse/typing';
import { Descriptions } from 'antd';
import BusGoodsOutInLogTable from './GoodsOutInLogTable';
import { WarehouseContext } from '../context';

/**@name 货品出入库记录对话框 */
const GoodsOutInLogModal: React.FC<{
  value: BusWarehouseGoodsType;
  warehouseName: string;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const goods = props.value;
  const wContext = useContext(WarehouseContext);

  const goodsName = `${goods?.material?.name}(${goods?.material?.code})`;
  return (
    <ModalForm<BusWarehousePutInGoodsDto>
      width={1000}
      title={`${goodsName}的出入库信息`}
      formRef={formRef}
      trigger={props.children}
      onFinish={async () => {}}
    >
      {goods ? (
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="仓库名称">{props.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="货架名称">{goods?.shelf?.name}</Descriptions.Item>
          <Descriptions.Item label="物料信息">{goodsName}</Descriptions.Item>
          <Descriptions.Item label="计量单位">{`${goods.material?.unit}`}</Descriptions.Item>
          {wContext.currentWarehouse?.type === BusWarehouseTypeEnum.Material ? null : (
            <Descriptions.Item label="尺码规格" span={2}>{`${goods.size?.name}${
              goods.size?.specification ? `(${goods.size?.specification})` : ''
            }`}</Descriptions.Item>
          )}
          <Descriptions.Item label="当前库存数量">{`${goods.quantity}`}</Descriptions.Item>
          <Descriptions.Item
            label="备注信息"
            span={2}
          >{`${goods.material?.unit}`}</Descriptions.Item>
        </Descriptions>
      ) : null}
      <BusGoodsOutInLogTable goodsId={goods.id} />
    </ModalForm>
  );
};

export default GoodsOutInLogModal;
