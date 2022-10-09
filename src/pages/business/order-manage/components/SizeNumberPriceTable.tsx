import type { BusOrderSizePriceNumber } from '@/apis/business/order-manage/contract/typing';
import { checkMaterialCodeToGoodsQuantity } from '@/apis/business/warehouse';
import type { BusWarehouseGoodsType } from '@/apis/business/warehouse/typing';
import { Table, Popover, List } from 'antd';
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';
import SelectTreeSizeTemplate from '../../techology-manage/SizeTemplate/components/SelectTreeSizeTemplate';

/**@name 尺码数量价格表 */
const SizeNumberPriceTable: React.FC<{ materialCode: string; data?: BusOrderSizePriceNumber[] }> = (
  props,
) => {
  const [dataSource, setDateSource] = useState<
    BusOrderSizePriceNumber & { total: number; mateGoods?: BusWarehouseGoodsType[] }[]
  >();
  const [loading, setLoading] = useState(false);
  async function getGoodsQuantity() {
    setLoading(true);
    const result = await checkMaterialCodeToGoodsQuantity(props.materialCode).finally(() =>
      setLoading(false),
    );
    const data = props?.data?.map((i) => {
      let total = 0;
      const mateGoods = result?.data?.goods?.filter((goods) => goods.sizeId === i.sizeId);
      if (!isEmpty(mateGoods)) {
        total =
          mateGoods?.reduce((prev, next) => {
            return prev + next.quantity;
          }, 0) || 0;
      }
      return {
        mateGoods,
        total,
        ...i,
      };
    });
    setDateSource((data as any) || []);
  }
  useEffect(() => {
    getGoodsQuantity();
  }, [props.data]);
  return (
    <Table
      size="small"
      rowKey="sizeId"
      loading={loading}
      columns={[
        {
          dataIndex: 'sizeId',
          title: '尺码规格',
          render(value, record, index) {
            return (
              <SelectTreeSizeTemplate
                fieldProps={{ value }}
                formItemProps={{ style: { height: 22, margin: 0 } }}
                readonly={true}
              />
            );
          },
        },
        { dataIndex: 'number', title: '数量' },
        {
          dataIndex: 'total',
          title: '现有库存数量',
          render(value, record, index) {
            const mateGoods = record.mateGoods;
            if (isEmpty(mateGoods)) {
              return '-';
            }
            return (
              <Popover
                content={
                  <List
                    style={{ width: 400 }}
                    dataSource={mateGoods}
                    renderItem={(data) => {
                      return (
                        <List.Item>
                          <List.Item.Meta
                            title={`位置:${data.shelf?.warehouse?.name}/${data.shelf?.name}`}
                          />
                          <div>{`库存数量:${data.quantity}`}</div>
                        </List.Item>
                      );
                    }}
                  />
                }
              >
                <a>{value}</a>
              </Popover>
            );
          },
        },
      ]}
      dataSource={dataSource}
      title={() => '尺码数量价格表'}
    />
  );
};
export default SizeNumberPriceTable;
