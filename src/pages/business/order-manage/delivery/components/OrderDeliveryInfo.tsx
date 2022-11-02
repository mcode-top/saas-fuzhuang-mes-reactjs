import {
  fetchContractNumberToDoneList,
  fetchWatchContract,
} from '@/apis/business/order-manage/contract';
import type { BusOrderContract } from '@/apis/business/order-manage/contract/typing';
import {
  fetchOrderApproveDelivery,
  fetchOrderCreateDelivery,
  fetchOrderUpdateDelivery,
  fetchOrderWatchDelivery,
} from '@/apis/business/order-manage/delivery';
import type { BusOrderDeliveryGoodsAndNumberEntity } from '@/apis/business/order-manage/delivery/typing';
import type { BusWarehouseGoodsType } from '@/apis/business/warehouse/typing';
import LoadingButton from '@/components/Comm/LoadingButton';
import type { LabelValue } from '@/components/typing';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormTextArea } from '@ant-design/pro-form';
import { ProFormDependency } from '@ant-design/pro-form';
import { ProFormDigit } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import { ProFormGroup } from '@ant-design/pro-form';
import { ProFormText } from '@ant-design/pro-form';
import { ProFormList } from '@ant-design/pro-form';
import FooterToolbar from '@ant-design/pro-layout/lib/components/FooterToolbar';
import { Card, Descriptions, message, Spin, Table } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'umi';
import type { DeliveryLocationQuery } from '..';
import { PutInStockFormList } from '../../manufacture/Info/ManufacturePutInStockModal';

/**@name 货品选择表单类型 */
type GoodsOptional = LabelValue & { goods: BusWarehouseGoodsType };
/**@name 创建发货单 */
const OrderDeliveryInfo: React.FC = () => {
  const formRef = useRef<ProFormInstance>();
  const [contractInfo, setContractInfo] = useState<BusOrderContract>();
  const [loading, setLoading] = useState(false);
  const [goodsOptional, setGoodsOptional] = useState<GoodsOptional[]>([]);
  const [goodsAndNumber, setGoodsAndNumber] = useState<BusOrderDeliveryGoodsAndNumberEntity[]>([]);
  const listFormRef = useRef<{ loadData: (contractNumber: string) => any }>();
  const location = useLocation();
  const query: DeliveryLocationQuery = (location as any).query;
  /**@name 创建发货单 */
  async function createDelivery() {
    const value = await formRef.current?.validateFields();
    await fetchOrderCreateDelivery(value);
    resultSuccess();
  }
  /**@name 审核发货单 */
  async function approveDelivery(isAgree: boolean) {
    if (query.deliveryId) {
      await fetchOrderApproveDelivery({
        isAgree,
        deliveryId: Number(query.deliveryId),
      });
      resultSuccess();
    } else {
      message.warning('发货单不存在,您重新到发货单管理中打开');
    }
  }
  /**@name 修改发货单 */
  async function updateDelivery() {
    const value = await formRef.current?.validateFields();
    if (query.deliveryId) {
      await fetchOrderUpdateDelivery(query.deliveryId, value);
      resultSuccess();
    } else {
      message.warning('发货单不存在,您重新到发货单管理中打开');
    }
  }
  useEffect(() => {
    if (query.contractNumber && query.deliveryId) {
      getContractInfo(query.contractNumber).then((_res) => {
        if (query.deliveryId) {
          fetchDelivery(query.deliveryId);
        }
      });
    }
  }, []);
  /** */
  function fetchDelivery(deliveryId: number) {
    return fetchOrderWatchDelivery(deliveryId).then((res) => {
      if (res?.data?.goodsAndNumber) {
        setGoodsAndNumber(res.data.goodsAndNumber);
      }
      formRef.current?.setFieldsValue(res.data);
    });
  }

  /**@name 操作成功后返回 */
  function resultSuccess() {
    window.layoutTabsAction.goAndClose('/order-manage/delivery', true);
    message.success('操作成功');
  }
  /**@name 将货品转换为LabelValueSelect */
  function transformGoodsToLabelValue(dataSource: BusWarehouseGoodsType[]) {
    if (isEmpty(dataSource)) {
      return [];
    }
    return dataSource.reduce<(LabelValue & { goods: BusWarehouseGoodsType })[]>((p, n) => {
      if (n) {
        p.push({
          label: `${n.shelf?.warehouse?.name}-${n.shelf?.name}-${n.material?.name}(${n.material?.code})-${n.color}-${n.size?.name}(${n.size?.specification})-${n.quantity}`,
          value: n.id,
          goods: n,
        });
      }
      return p;
    }, []);
  }
  /**@name 获取合同单数据 */
  function getContractInfo(contractNumber: string) {
    listFormRef.current?.loadData(contractNumber);
    setLoading(true);
    return fetchWatchContract(contractNumber)
      .then(async (res) => {
        if (res.data) {
          formRef.current?.setFieldsValue({
            address: res.data.address?.address,
            contact: res.data.address?.name,
            phone: res.data.address?.phone,
          });
          setContractInfo(res.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const readonly = query.type === 'watch' || query.type === 'approve';
  return (
    <Card style={{ width: 1000, margin: 'auto' }}>
      <ProForm
        style={{ paddingTop: 12 }}
        layout={readonly ? 'horizontal' : 'vertical'}
        formRef={formRef}
        grid={true}
        readonly={readonly}
        submitter={{
          render: (_, _dom) => (
            <FooterToolbar>
              <LoadingButton
                hidden={query?.type !== 'create'}
                type="primary"
                onLoadingClick={createDelivery}
              >
                确定创建
              </LoadingButton>
              <LoadingButton
                hidden={query?.type !== 'approve'}
                type="primary"
                onLoadingClick={() => approveDelivery(true)}
              >
                同意通过
              </LoadingButton>
              <LoadingButton
                hidden={query?.type !== 'update'}
                type="primary"
                onLoadingClick={updateDelivery}
              >
                确定修改
              </LoadingButton>
              <LoadingButton
                hidden={query?.type !== 'approve'}
                onLoadingClick={() => approveDelivery(false)}
                danger
              >
                反对驳回
              </LoadingButton>
            </FooterToolbar>
          ),
        }}
      >
        {query.type === 'create' ? (
          <PartToContractNumber
            onChange={(v) => {
              getContractInfo(v);
            }}
          />
        ) : null}
        {loading ? (
          <Spin spinning />
        ) : (
          <Descriptions>
            <Descriptions.Item label="公司名称">{contractInfo?.company?.name}</Descriptions.Item>
            <Descriptions.Item label="跟进人">
              {contractInfo?.process?.operator?.name}
            </Descriptions.Item>
            <Descriptions.Item label="交期时间">{contractInfo?.deliverDate}</Descriptions.Item>
          </Descriptions>
        )}
        <ProFormText
          label="收货地址"
          rules={[{ required: true }]}
          name="address"
          colProps={{ span: 24 }}
        />
        <ProFormText
          label="收货联系人"
          rules={[{ required: true }]}
          name="contact"
          colProps={{ span: 12 }}
        />
        <ProFormText label="联系人号码" name="phone" colProps={{ span: 12 }} />
        <ProFormText
          label="物流公司"
          rules={[{ required: true }]}
          name="logisticsCompany"
          colProps={{ span: 12 }}
        />
        <ProFormText label="快递单号" name="expressNumber" colProps={{ span: 12 }} />
        <PutInStockFormList
          ref={listFormRef}
          readonly={true}
          label="合同单需求"
          rowProps={{ align: 'middle' }}
          onDataSourceChange={(d) => {
            setGoodsOptional(transformGoodsToLabelValue(d));
          }}
          name="putInStockFormList"
        />
        <DeliveryPutOutFormList
          goodsOptional={goodsOptional}
          readonly={readonly}
          dataSource={goodsAndNumber}
        />
        <ProFormTextArea name="remark" label="备注信息" />
      </ProForm>
    </Card>
  );
};

/**@name 补全合同号 */
function PartToContractNumber(props: { onChange?: (v: any) => void }) {
  return (
    <ProFormSelect
      colProps={{ span: 24 }}
      name="contractNumber"
      label="选择已完成的合同单"
      fieldProps={{
        placeholder: '请输入搜索已完成的合同单',
        showSearch: true,
        onChange: (v) => {
          props?.onChange?.(v);
        },
      }}
      request={async (params: { keyWords: string | undefined }, _props1) => {
        if (params.keyWords && params.keyWords.length > 2) {
          const { data } = await fetchContractNumberToDoneList(params.keyWords);
          return data.map((item) => {
            return {
              label: item.contractNumber,
              value: item.contractNumber,
            };
          });
        } else {
          return [];
        }
      }}
    />
  );
}

function DeliveryPutOutFormList(props: {
  readonly?: boolean;
  goodsOptional: GoodsOptional[];
  dataSource?: any[];
}) {
  if (props.readonly) {
    return (
      <Table<BusOrderDeliveryGoodsAndNumberEntity>
        dataSource={props.dataSource}
        size="small"
        style={{ width: '100%' }}
        title={() => '出库品类与数量'}
        pagination={false}
        rowKey="id"
        columns={[
          {
            title: '物料信息',
            dataIndex: 'materialInfo',
            render(_value, record, _index) {
              return `${record?.goods?.material?.name}(${record?.goods?.material?.code})`;
            },
          },
          {
            title: '尺码信息',
            dataIndex: 'sizeInfo',
            render(_value, record) {
              return `${record?.goods?.size?.name}(${record?.goods?.size?.specification})`;
            },
          },

          {
            title: '颜色',
            dataIndex: 'color',
            render(_value, record, _index) {
              return `${record?.goods?.color}`;
            },
          },
          {
            title: '货架位置',
            dataIndex: 'shelf',
            render(_value, record, _index) {
              return `${record?.goods?.shelf?.name}`;
            },
          },
          {
            title: '货品库存',
            dataIndex: 'shelf',
            render(_value, record, _index) {
              return `${record?.goods?.quantity}`;
            },
          },
          { title: '需要出库数量', dataIndex: 'quantity' },
        ]}
      />
    );
  }
  return (
    <ProFormList
      initialValue={[]}
      colProps={{ span: 24 }}
      name="goodsAndNumber"
      label="出库品类与数量"
      rules={[
        {
          validator(_rule, value: { goodsId: number; quantity: number }[], callback) {
            const find = value.find((item) => {
              const goodsFilter = value.filter((i) => i.goodsId === item.goodsId);
              return goodsFilter.length >= 2;
            });
            if (find) {
              return callback('出库品类出现相同货品');
            }
            callback();
          },
        },
      ]}
    >
      <ProFormGroup>
        <ProFormSelect
          colProps={{ span: 18 }}
          name="goodsId"
          rules={[{ required: true }]}
          label="需要出库货品"
          options={props.goodsOptional}
        />
        <ProFormDependency name={['goodsId']}>
          {({ goodsId }) => {
            const find = props.goodsOptional.find((i) => i.value === goodsId);
            return (
              <ProFormDigit
                rules={[{ required: true }]}
                colProps={{ span: 6 }}
                min={0}
                max={find?.goods.quantity}
                name="quantity"
                label="需要出库数量"
              />
            );
          }}
        </ProFormDependency>
      </ProFormGroup>
    </ProFormList>
  );
}
export default OrderDeliveryInfo;
