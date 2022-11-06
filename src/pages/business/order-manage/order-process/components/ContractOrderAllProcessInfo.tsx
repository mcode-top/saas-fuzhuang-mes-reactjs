import type { BusOrderContract } from '@/apis/business/order-manage/contract/typing';
import { BusOrderTypeEnum } from '@/apis/business/order-manage/contract/typing';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import { Card } from 'antd';
import React, { useState } from 'react';
import { useLocation, useModel } from 'umi';
import { OrderCollectionSlipLogTable } from '../../collection-slip/components/OrderCollectionSlipAddLog';
import BusSelectCustomerAddress from '../../components/SelectCustomerAddress';
import BusSelectCustomerCompany from '../../components/SelectCustomerCompany';
import BusSelectCustomerContacter from '../../components/SelectCustomerContacter';
import BusSelectUser from '../../components/SelectUser';
import type { BusOrderContractCollectionSlip } from '@/apis/business/order-manage/collection-slip/typing';
import { OrderStyleDemandTable } from '../../contract/Info';

/**@name 查看订单全部信息 */
const ContractOrderAllProcessInfo: React.FC = (props) => {
  const { initialState } = useModel('@@initialState');
  const formRef = React.useRef<ProFormInstance>();
  const location = useLocation();
  const [collectionInfo, setCollectionInfo] = useState<BusOrderContractCollectionSlip>();
  /**@name 一个合同有多个生产单 */
  const [manufactureList, setManufactureList] = useState<[]>([]);
  const [contractInfo, setContractInfo] = useState<BusOrderContract>();
  const query = (location as any).query as { contractNumber: string };
  return (
    <Card style={{ width: 1000, margin: 'auto' }}>
      <ProForm grid={true} formRef={formRef} layout={'horizontal'}>
        <ProFormText
          label="订单单号"
          disabled={true}
          colProps={{ span: 8 }}
          name="contractNumber"
          placeholder="创建完订单后自动生成"
        />
        <BusSelectUser
          label="跟进人"
          colProps={{ span: 8 }}
          initialValue={initialState?.currentUser?.id}
          placeholder="请输入名称"
          name="operatorId"
          width="sm"
        />
        <ProFormDatePicker
          colProps={{ span: 8 }}
          rules={[{ required: true }]}
          label="交期时间"
          name="deliverDate"
        />
        <BusSelectCustomerCompany
          label="客户公司"
          width="lg"
          colProps={{ span: 12 }}
          rules={[{ required: true }]}
          name="companyId"
        />

        <ProFormDependency name={['companyId']}>
          {({ companyId }) => {
            return (
              <>
                <BusSelectCustomerContacter
                  label="客户联系人"
                  colProps={{ span: 12 }}
                  width="lg"
                  companyId={companyId}
                  name="contactId"
                />
                <BusSelectCustomerAddress
                  label="客户收货地址"
                  style={{ width: '100%' }}
                  colProps={{ span: 24 }}
                  width="lg"
                  companyId={companyId}
                  name="addressId"
                />
              </>
            );
          }}
        </ProFormDependency>
        <ProFormDigit
          label="预付比例(%)"
          colProps={{ span: 8 }}
          fieldProps={{
            addonAfter: '%',
            precision: 2,
          }}
          name="prepayPercent"
        />
        <ProFormRadio.Group
          label="发票类型"
          name="invoiceType"
          colProps={{ span: 8 }}
          initialValue="发票"
          options={['发票', '普票', '无票']}
        />
        <ProFormText
          name="payment"
          label="付款方式"
          colProps={{ span: 8 }}
          placeholder="请输入名称"
        />
        {/**@name 需要审批人员设置销售提成 */}
        <ProFormDigit
          name="salesCommissions"
          label="销售提成(%)"
          colProps={{ span: 8 }}
          fieldProps={{
            addonAfter: '%',
            precision: 2,
          }}
          min={0}
          max={100}
        />
        <ProFormText
          name="logisticsMode"
          label="物流方式"
          colProps={{ span: 8 }}
          placeholder="请输入物流方式"
        />
        {/**仅普通的合同单可以填写 */}
        {contractInfo?.type === BusOrderTypeEnum.Normal ? (
          <ProFormText
            label="有无样衣"
            colProps={{ span: 8 }}
            initialValue={'无'}
            name="sampleRemark"
          />
        ) : null}
        <ProForm.Item name="styleDemand" label="款式需求">
          <OrderStyleDemandTable readonly={true} />
        </ProForm.Item>
        <ProFormTextArea colProps={{ span: 24 }} label="包装要求" name="packageDemand" />
        <ProFormTextArea colProps={{ span: 24 }} label="备注说明" name="remark" />
        {collectionInfo?.collectionLog ? (
          <OrderCollectionSlipLogTable list={collectionInfo?.collectionLog} />
        ) : null}
        <ProFormDatePicker
          rules={[{ required: true }]}
          label="生产交期时间"
          width="sm"
          name="manufactureDeliverDate"
        />
      </ProForm>
    </Card>
  );
};
export default ContractOrderAllProcessInfo;
