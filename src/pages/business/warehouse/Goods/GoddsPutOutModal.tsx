import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormDigit } from '@ant-design/pro-form';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';

import React, { useContext, useRef } from 'react';

import type {
  BusWarehouseGoodsType,
  BusWarehousePutInGoodsDto,
  BusWarehousePutOutGoodsDto,
} from '@/apis/business/warehouse/typing';
import { BusWarehouseTypeEnum } from '@/apis/business/warehouse/typing';
import {
  fetchUpdateWarehouseGoodsRemark,
  fetchWarehouseGoodsPutOut,
} from '@/apis/business/warehouse';
import { WarehouseContext } from '../context';
import { Descriptions } from 'antd';

/**@name 货品出库对话框 */
const GoodsPutOutModal: React.FC<{
  value: BusWarehouseGoodsType;
  type: 'put-out' | 'update-remark';
  title: string;
  onFinish?: (value: BusWarehousePutOutGoodsDto) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const wContext = useContext(WarehouseContext);

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();
        if (props.type === 'put-out') {
          await fetchWarehouseGoodsPutOut({ goodsId: props.value.id, ...value });
        } else {
          await fetchUpdateWarehouseGoodsRemark({ goodsId: props.value.id, ...value });
        }
        props?.onFinish?.(value);
        resolve(true);
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        reject(false);
      }
    });
  }

  return (
    <ModalForm<BusWarehousePutInGoodsDto>
      width={500}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
        if (props.type === 'update-remark') {
          formRef.current?.setFieldsValue({
            ...props.value,
          });
        }
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <Descriptions size="small" column={2}>
        <Descriptions.Item label="物料信息">{`${props.value.material?.name}(${props.value.material?.code})`}</Descriptions.Item>
        <Descriptions.Item label="计量单位">{`${props.value.material?.unit}`}</Descriptions.Item>
        {wContext.currentWarehouse?.type === BusWarehouseTypeEnum.Material ? null : (
          <Descriptions.Item label="尺码规格">{`${props.value.size?.name}${
            props.value.size?.specification ? `(${props.value.size?.specification})` : ''
          }`}</Descriptions.Item>
        )}
        <Descriptions.Item label="当前库存数量">{`${props.value.quantity}`}</Descriptions.Item>
      </Descriptions>
      {props.type === 'update-remark' ? null : (
        <ProFormDigit
          rules={[
            { required: true },
            {
              validator(rule, value, callback) {
                if (value <= 0) {
                  callback('出库数量必须大于0');
                } else if (value > props.value.quantity) {
                  callback('出库数量不能大于当前库存数量');
                } else {
                  callback();
                }
              },
            },
          ]}
          label="货品出库数"
          name="deliveryCount"
        />
      )}
      <ProFormTextArea
        label={props.type === 'update-remark' ? '货品原因' : '出库原因'}
        rules={[{ required: props.type === 'update-remark' }]}
        name="remark"
      />
      {/**TODO:待完善绑定合同单 */}
    </ModalForm>
  );
};

export default GoodsPutOutModal;
