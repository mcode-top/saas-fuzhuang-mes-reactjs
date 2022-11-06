import type { BusOrderSizePriceNumber } from '@/apis/business/order-manage/contract/typing';
import { checkMaterialCodeToGoodsQuantity } from '@/apis/business/warehouse';
import type { BusWarehouseGoodsType } from '@/apis/business/warehouse/typing';
import { Table, Popover, List } from 'antd';
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';
import SelectTreeSizeTemplate from '../../techology-manage/SizeTemplate/components/SelectTreeSizeTemplate';
/**@name 物料编码尺码仓库数量 */
export type MaterialToWarehouseGoodsTableDataSource = BusOrderSizePriceNumber & {
  total: number;
  mateGoods?: BusWarehouseGoodsType[];
};

/**@name 通过物料编码尺码查询仓库表 */
const MaterialToWarehouseGoodsTable: React.FC<{
  title?: string;
  materialCode: string;
  data?: BusOrderSizePriceNumber[];
  onChangeDataSource?: (dataSource: MaterialToWarehouseGoodsTableDataSource[]) => void;
}> = (props) => {
  const [dataSource, setDateSource] = useState<MaterialToWarehouseGoodsTableDataSource[]>();
  const [loading, setLoading] = useState(false);
  async function getGoodsQuantity() {
    setLoading(true);
    const result = await checkMaterialCodeToGoodsQuantity(props.materialCode).finally(() =>
      setLoading(false),
    );
    if (isEmpty(props.data)) {
      return setDateSource(
        result?.data?.goods?.map((i) => {
          return {
            ...i,
            mateGoods: [i],
            total: i.quantity,
          } as any;
        }) || [],
      );
    }
    const data = props?.data?.map((i) => {
      let total = 0;

      const mateGoods = result?.data?.goods?.filter(
        (goods) => goods.sizeId === i.sizeId && goods.color === i.color,
      );
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
    setDateSource(data || []);
  }
  useEffect(() => {
    if (!isEmpty(dataSource)) {
      props?.onChangeDataSource?.(dataSource as any);
    }
  }, [dataSource]);
  useEffect(() => {
    getGoodsQuantity();
  }, [props.data, props.materialCode]);
  return (
    <Table
      size="small"
      rowKey={(entity) => `${entity.color} + ${entity.sizeId} + ${entity.number} + ${entity.total}`}
      loading={loading}
      style={{ width: '100%' }}
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
        { dataIndex: 'color', title: '颜色' },
        ...(isEmpty(props.data)
          ? [
              {
                dataIndex: 'warehouseName',
                title: '仓库位置',
                render: (v, record, index) => record?.shelf?.warehouse.name,
              },
              {
                dataIndex: 'shelfName',
                title: '货架位置',
                render: (v, record, index) => record?.shelf?.name,
              },
              { dataIndex: 'quantity', title: '库存数量' },
            ]
          : [
              { dataIndex: 'number', title: '数量' },
              {
                dataIndex: 'total',
                title: '现有库存数量',
                render(value, record: MaterialToWarehouseGoodsTableDataSource, index) {
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
                                  title={`位置:${data?.shelf?.warehouse?.name}/${data.shelf?.name}`}
                                />
                                <div>{`库存数量:${data?.quantity}`}</div>
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
            ]),
      ]}
      dataSource={dataSource}
      title={() => props.title || '尺码数量价格表'}
    />
  );
};
export default MaterialToWarehouseGoodsTable;
