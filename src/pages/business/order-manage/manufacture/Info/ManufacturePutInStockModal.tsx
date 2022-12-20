import { fetchFindContractNumberToGoodsList } from '@/apis/business/order-manage/contract';
import { fetchManufactureGoodsPutInStock } from '@/apis/business/order-manage/manufacture';
import { checkMaterialCodeToGoodsQuantity } from '@/apis/business/warehouse';
import type {
  BusWarehouseGoodQuantityType,
  BusWarehouseGoodsType,
} from '@/apis/business/warehouse/typing';
import { BusWarehouseTypeEnum } from '@/apis/business/warehouse/typing';
import BusSelectWarehouseShelf from '@/pages/business/warehouse/Shelf/ShelfSelect';
import BusSelectWarehouse from '@/pages/business/warehouse/Warehouse/WarehouseSelect';
import type { FormListActionType, ProFormInstance, ProFormListProps } from '@ant-design/pro-form';
import { ProFormItem } from '@ant-design/pro-form';
import { ProFormDependency } from '@ant-design/pro-form';
import { ProFormDigit } from '@ant-design/pro-form';
import { ProFormGroup, ProFormList } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { List, Popover, Spin, Table } from 'antd';
import { isEmpty, omit } from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';

export default forwardRef(
  (
    props: {
      onFinish?: (value: any) => void;
    },
    ref,
  ) => {
    const [nContractNumber, setContractNumber] = useState('');
    const [visible, setVisible] = useState(false);
    const formRef = useRef<ProFormInstance>();
    const listFormRef = useRef<{ loadData: (contractNumber: string) => any }>();
    useImperativeHandle(ref, () => {
      return {
        show: init,
      };
    });
    /**@name 初始话获取数据 */
    function init(contractNumber: string) {
      setContractNumber(contractNumber);
      setVisible(true);
    }
    function onFinish(): Promise<boolean> {
      return new Promise(async (resolve, reject) => {
        try {
          const value = await formRef.current?.validateFields();
          await fetchManufactureGoodsPutInStock({
            contractNumber: nContractNumber,
            contractGoodsList: value.goodsList.map((i) => ({
              contractGoodsId: i.contractGoodsId,
              quantity: i.quantity,
              shelfId: value.shelfId,
            })),
          });
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
      <ModalForm
        width={1200}
        title={'生产单货品入库'}
        formRef={formRef}
        visible={visible}
        onVisibleChange={(v) => {
          setVisible(v);
          if (v) {
            listFormRef.current?.loadData(nContractNumber);
          } else {
            formRef.current?.resetFields();
          }
        }}
        onFinish={onFinish}
        grid={true}
      >
        <ProFormGroup colProps={{ span: 4 }}>
          <ProFormItem label="订单单号">
            <div>{nContractNumber}</div>
          </ProFormItem>
        </ProFormGroup>
        <BusSelectWarehouse
          label="选择要入库仓库"
          type={BusWarehouseTypeEnum.Product}
          colProps={{ span: 10 }}
          name="warehouseId"
          rules={[{ required: true }]}
        />
        <ProFormDependency name={['warehouseId']}>
          {({ warehouseId }) => {
            return (
              <BusSelectWarehouseShelf
                colProps={{ span: 10 }}
                label="选择要入库货架"
                name="shelfId"
                warehouseId={warehouseId}
                rules={[{ required: true }]}
              />
            );
          }}
        </ProFormDependency>

        <PutInStockFormList label="填写货品入库" name="goodsList" ref={listFormRef} />
      </ModalForm>
    );
  },
);

/**@name 充足库存内容 */
export function ExistingStock(props: { value?: BusWarehouseGoodsType[] }) {
  if (isEmpty(props.value)) {
    return <div>0</div>;
  }
  return (
    <Popover
      content={
        <List
          style={{ width: 400 }}
          dataSource={props.value}
          renderItem={(data) => {
            return (
              <List.Item>
                <List.Item.Meta title={`位置:${data.shelf?.warehouse?.name}/${data.shelf?.name}`} />
                <div>{`库存数量:${data.quantity}`}</div>
              </List.Item>
            );
          }}
        />
      }
    >
      <a>{props?.value?.reduce((p, n) => p + n.quantity, 0)}</a>
    </Popover>
  );
}
/**@name 批量入库表 */
export const PutInStockFormTable: React.FC<{
  dataSource: any[];
  title: string | React.ReactNode;
}> = (props) => {
  return (
    <Table
      rowKey={'contractGoodsId'}
      size="small"
      pagination={false}
      style={{ width: '100%' }}
      title={() => props.title}
      dataSource={props.dataSource}
      columns={[
        { title: '物料信息', dataIndex: 'materialInfo' },
        { title: '尺码信息', dataIndex: 'sizeInfo' },
        { title: '颜色', dataIndex: 'color' },
        { title: '需要操作数量', dataIndex: 'needQuantity' },
        { title: '已操作数量', dataIndex: 'beenInQuantity' },
        { title: '已发货数量', dataIndex: 'beenOutQuantity' },
        {
          title: '现有库存',
          dataIndex: 'goods',
          render(value, record, index) {
            return <ExistingStock value={value} />;
          },
        },
      ]}
    />
  );
};
/**@name 批量入库列表 */
export const PutInStockFormList = React.forwardRef(
  (
    props: ProFormListProps<any> & {
      readonly?: boolean;
      onDataSourceChange?: (dataSource: BusWarehouseGoodsType[]) => any;
    },
    ref,
  ) => {
    const [list, setList] = useState<any[]>([{}]);
    const [loading, setLoading] = useState(false);
    const listRef = useRef<FormListActionType>();
    useImperativeHandle(ref, () => {
      return {
        /**@name 读取数据 */
        loadData: (contractNumber: string) => {
          setLoading(true);
          return fetchFindContractNumberToGoodsList(contractNumber)
            .then(async (res) => {
              const materialContractGoodsList: Record<string, any> = {};
              console.log(res);

              const resultList = res.data.map((item) => {
                const result = {
                  contractGoodsId: item.id,
                  color: item.color,
                  materialCode: item.materialCode,
                  sizeId: item.sizeId,
                  materialInfo: `${item.material?.name}(${item.material?.code})`,
                  sizeInfo: `${item.size?.name}(${item.size?.specification})`,
                  needQuantity: item.needQuantity,
                  beenInQuantity: item.beenInQuantity,
                  beenOutQuantity: item.beenOutQuantity,
                  quantity: 0,
                  goods: [],
                };
                if (materialContractGoodsList[item.materialCode]) {
                  materialContractGoodsList[item.materialCode].push(result);
                } else {
                  materialContractGoodsList[item.materialCode] = [result];
                }
                return result;
              });
              await Promise.all(
                Object.keys(materialContractGoodsList).map(async (key) => {
                  const contractGoodsList = materialContractGoodsList[key];
                  const materialGoodsQuantityList = await materialGoodsQuantity(
                    key,
                    contractGoodsList,
                  );
                  resultList.forEach((item) => {
                    const data = materialGoodsQuantityList.filter((g) => {
                      return (
                        g.color === item.color &&
                        g.materialCode === item.materialCode &&
                        g.sizeId === item.sizeId
                      );
                    });
                    (item.goods as any[]).push(...data);
                  });
                }),
              );
              props?.onDataSourceChange?.(
                resultList.reduce<any>((p, n) => {
                  p.push(...n.goods);
                  return p;
                }, []),
              );
              setDataList(resultList);
            })
            .finally(() => {
              setLoading(false);
            });
        },
      };
    });
    /**@name 通过物料编码获取仓库库存 */
    async function materialGoodsQuantity(
      materialCode: string,
      sizeColorList: { color: string; sizeId: number }[],
    ) {
      const result = await checkMaterialCodeToGoodsQuantity(materialCode).then((res) => res.data);
      if (result) {
        return sizeColorList.reduce<BusWarehouseGoodsType[]>((p, n) => {
          const goodsList = result?.goods?.filter(
            (goods) =>
              goods.sizeId === n.sizeId &&
              goods.color === n.color &&
              materialCode === goods.materialCode,
          );
          p.push(...(goodsList || []));
          return p;
        }, []);
      }
      return [];
    }
    function setDataList(clist: any[]) {
      setList(clist);
      const cacheList = listRef.current?.getList();
      if (cacheList) {
        listRef.current?.remove(cacheList.map((item, index) => index));
      }
      clist.forEach((item) => {
        listRef.current?.add(item);
      });
    }
    return (
      <>
        {loading ? <Spin spinning /> : null}
        {props.readonly ? (
          <PutInStockFormTable title={props.label} dataSource={list} />
        ) : (
          <ProFormList
            {...omit(props, 'ref', 'readonly', 'onDataSourceChange')}
            initialValue={list}
            actionRef={listRef}
            colProps={{ span: 24 }}
            copyIconProps={false}
            creatorButtonProps={false}
          >
            <ProFormGroup>
              <ProFormText
                colProps={{ span: 1 }}
                name="contractGoodsId"
                label="id"
                readonly={true}
              />
              <ProFormText
                colProps={{ span: 5 }}
                name="materialInfo"
                readonly={true}
                label="物料信息"
              />
              <ProFormText
                colProps={{ span: 3 }}
                name="sizeInfo"
                readonly={true}
                label="尺码信息"
              />
              <ProFormText colProps={{ span: 2 }} name="color" readonly={true} label="颜色" />
              <ProFormDigit
                colProps={{ span: 3 }}
                name="needQuantity"
                readonly={true}
                label="合同单需要操作数量"
              />
              <ProFormDigit
                colProps={{ span: 2 }}
                name="beenInQuantity"
                readonly={true}
                label="已操作数量"
              />
              <ProFormDigit
                colProps={{ span: 2 }}
                name="beenOutQuantity"
                readonly={true}
                label="已发货数量"
              />
              <ProFormGroup colProps={{ span: 2 }}>
                <ProFormItem name="goods" label="现有库存">
                  <ExistingStock />
                </ProFormItem>
              </ProFormGroup>
              <ProFormDigit
                colProps={{ span: 3 }}
                name="quantity"
                fieldProps={{ defaultValue: 0 }}
                rules={[{ required: true }]}
                label="填写操作数量"
                min={0}
              />
            </ProFormGroup>
          </ProFormList>
        )}
      </>
    );
  },
);
