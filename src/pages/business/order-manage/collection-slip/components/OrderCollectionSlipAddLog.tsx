import {
  fetchCollectionSlipInfo,
  fetchOrderAddCollectionSlip,
} from '@/apis/business/order-manage/collection-slip';
import type {
  BusOrderContractCollectionSlip,
  BusOrderContractCollectionSlipLog,
  BusPaymentAMountCollectionSlipForm,
} from '@/apis/business/order-manage/collection-slip/typing';
import { BusCollectionShilStatusEnmu } from '@/apis/business/order-manage/collection-slip/typing';
import { fetchWatchContract } from '@/apis/business/order-manage/contract';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormGroup } from '@ant-design/pro-form';
import { ProFormDependency } from '@ant-design/pro-form';
import { ProFormText } from '@ant-design/pro-form';
import { ProFormDatePicker } from '@ant-design/pro-form';
import { ProFormList, ProFormMoney } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';
import { Alert, Descriptions, Spin, Table } from 'antd';
import { isEmpty } from 'lodash';
import { useRef, useState } from 'react';
import { computedTotalAmount } from '../../contract/Info/ContractOrderStyleModal';

const OrderCollectionSlipAddLog: React.FC<{
  contractNumber: string;
  title: string;
  type: 'update' | 'watch';
  onFinish?: () => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();
  const [collectionInfo, setCollectionInfo] = useState<BusOrderContractCollectionSlip>();
  const [loading, setLoading] = useState(false);

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (props.type === 'watch') {
        return resolve(true);
      }
      try {
        const value = await formRef.current?.validateFields();
        const result = { ...value, contractNumber: props.contractNumber };
        await fetchOrderAddCollectionSlip(result);
        props?.onFinish?.();
        resolve(true);
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        reject(false);
      }
    });
  }
  /**@name 获取收款单数据 */
  function getCollectionInfo() {
    setLoading(true);
    fetchCollectionSlipInfo(props.contractNumber)
      .then(async (res) => {
        if (res.data) {
          setCollectionInfo(res.data);
        } else {
          // 如果不存在则通过合同单组装一下
          const result = await fetchWatchContract(props.contractNumber);

          setCollectionInfo({
            contractNumber: props.contractNumber,
            contract: result.data,
            totalAmount: result.data.styleDemand.reduce((p, n) => {
              return p + computedTotalAmount(n);
            }, 0),
            collectionAmount: 0,
            status: BusCollectionShilStatusEnmu.UnCollection,
            collectionLog: [],
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }
  const readonly = props.type === 'watch';
  return (
    <ModalForm
      width={800}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
        if (v) {
          getCollectionInfo();
        }
      }}
      trigger={props.children}
      onFinish={onFinish}
      grid={true}
    >
      {loading ? (
        <Spin spinning />
      ) : (
        <Descriptions>
          <Descriptions.Item label="跟进人">
            {collectionInfo?.contract?.process?.operator?.name}
          </Descriptions.Item>
          <Descriptions.Item label="交期时间">
            {collectionInfo?.contract?.deliverDate}
          </Descriptions.Item>
          <Descriptions.Item label="预付比例(%)">
            {collectionInfo?.contract?.prepayPercent}
          </Descriptions.Item>
          <Descriptions.Item label="付款方式">
            {collectionInfo?.contract?.payment}
          </Descriptions.Item>
          <Descriptions.Item label="合同总金额">{collectionInfo?.totalAmount}</Descriptions.Item>
          <Descriptions.Item label="当前已收款金额">
            {collectionInfo?.collectionAmount}
          </Descriptions.Item>
        </Descriptions>
      )}
      {isEmpty(collectionInfo?.collectionLog) ? null : (
        <OrderCollectionSlipLogTable list={collectionInfo?.collectionLog as any} />
      )}
      {readonly ? null : (
        <ProFormList
          initialValue={[]}
          colProps={{ span: 24 }}
          name="paymentList"
          label="收款记录列表"
        >
          <ProFormGroup>
            <ProFormMoney
              rules={[{ required: true }]}
              fieldProps={{ precision: 4 }}
              colProps={{ span: 8 }}
              name="paymentAmount"
              label="付款金额"
            />
            <ProFormText
              rules={[{ required: true }]}
              colProps={{ span: 8 }}
              name="paymentMethod"
              label="付款方式"
            />
            <ProFormDatePicker
              rules={[{ required: true }]}
              colProps={{ span: 8 }}
              name="paymentDate"
              label="付款时间"
            />
          </ProFormGroup>
        </ProFormList>
      )}
      {readonly ? null : (
        <ProFormDependency name={['paymentList']}>
          {(data) => {
            const paymentList = data.paymentList as BusPaymentAMountCollectionSlipForm[];
            const collectionAmount =
              (collectionInfo?.collectionAmount || 0) +
              paymentList?.reduce((p, n) => p + (n.paymentAmount || 0), 0);
            return (
              <Descriptions column={2}>
                <Descriptions.Item label="当前表单提交后最终已收款金额">
                  {collectionAmount}
                </Descriptions.Item>
                <Descriptions.Item label="当前表单提交后最终未收款金额">
                  {(collectionInfo?.totalAmount || 0) - collectionAmount}
                </Descriptions.Item>
              </Descriptions>
            );
          }}
        </ProFormDependency>
      )}
    </ModalForm>
  );
};

export const OrderCollectionSlipLogTable: React.FC<{
  list: BusOrderContractCollectionSlipLog[];
}> = (props) => {
  return (
    <Table
      size="small"
      title={() => '订单收款单记录'}
      style={{ width: '100%' }}
      columns={[
        {
          title: '付款金额',
          dataIndex: 'paymentAmount',
        },
        {
          title: '付款时间',
          dataIndex: 'paymentDate',
        },
        {
          title: '付款方式',
          dataIndex: 'paymentMethod',
        },
        {
          title: '填写人',
          dataIndex: 'operator',
          render(value, record, index) {
            return record.operator?.name;
          },
        },
      ]}
      dataSource={props.list}
      pagination={{ pageSize: 5 }}
    />
  );
};
export default OrderCollectionSlipAddLog;
