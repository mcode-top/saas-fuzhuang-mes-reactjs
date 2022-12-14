import {
  fetchApproveContract,
  fetchContractSerialNumber,
  fetchCreateContract,
  fetchCreateOrderAddContract,
  fetchCreateProofingOrder,
  fetchUpdateContract,
  fetchWatchContract,
} from '@/apis/business/order-manage/contract';
import type {
  BusOrderContract,
  BusOrderContractOrderAddDto,
  BusOrderStyleDemand,
} from '@/apis/business/order-manage/contract/typing';
import { BusOrderStyleTypeEnum } from '@/apis/business/order-manage/contract/typing';
import { BusOrderTypeEnum } from '@/apis/business/order-manage/contract/typing';
import { DraftsModal, saveDrafts } from '@/components/Comm/Drafts';
import { disabledLastDate } from '@/components/Comm/helper';
import LoadingButton from '@/components/Comm/LoadingButton';
import { OrderContractTypeValueEnum } from '@/configs/commValueEnum';
import { ReloadOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import ProForm, {
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Alert, Button, Card, Input, message, Modal, Space } from 'antd';
import { isEmpty, omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useModel, useParams } from 'umi';
import useSwitchTabs from 'use-switch-tabs';
import BusSelectCustomerAddress from '../../components/SelectCustomerAddress';
import BusSelectCustomerCompany from '../../components/SelectCustomerCompany';
import BusSelectCustomerContacter from '../../components/SelectCustomerContacter';
import BusSelectUser from '../../components/SelectUser';
import type { ContractLocationQuery } from '../typing';
import ContractOrderStyleModal from './ContractOrderStyleModal';
import { OrderCollectionSlipLogTable } from '../../collection-slip/components/OrderCollectionSlipAddLog';
import { fetchCollectionSlipInfo } from '@/apis/business/order-manage/collection-slip';
import type { BusOrderContractCollectionSlip } from '@/apis/business/order-manage/collection-slip/typing';
import { exportContractExcel } from './exportExcel';

/**@name 合同单详情 */
const OrderContractInfo: React.FC = () => {
  /**@name 收款记录 */
  const [collectionInfo, setCollectionInfo] = useState<BusOrderContractCollectionSlip>();

  const [readonly, setReadonly] = useState(false);
  const { initialState } = useModel('@@initialState');
  const formRef = React.useRef<ProFormInstance>();
  const location = useLocation();
  const query = (location as any).query as ContractLocationQuery;
  useEffect(() => {
    if (query.type === 'create') {
      // refrshContractNumber();
    } else if (query.type === 'watch' || query.type === 'approve') {
      if (query.contractNumber) {
        setReadonly(true);
        setContractValues(query.contractNumber);
        getCollectionInfo(query.contractNumber);
      }
    } else if (query.type === 'update') {
      if (query.contractNumber) {
        setContractValues(query.contractNumber);
      }
    }
  }, []);
  /**@name 设置合同数据 */
  function setContractValues(contractNumber: string) {
    return fetchWatchContract(contractNumber).then((res) => {
      const values = res.data;
      if (query.orderType === BusOrderTypeEnum.Add) {
        // 如果是加单则修改款式中的数量将其归零
        values.styleDemand = values.styleDemand.map((style) => {
          style.sizePriceNumber = [];
          style.totalPrice = 0;
          // 由于已经生成合同单则应该为现货
          style.styleType = BusOrderStyleTypeEnum.SpotGoods;
          return style;
        });
      }
      formRef.current?.setFieldsValue(values);
    });
  }
  /**@name 新增合同单 */
  async function createContract(data: BusOrderContract) {
    await fetchCreateContract(data);
    resultSuccess();
  }
  /**@name 新增合同单-加单 */
  async function createOrderAddContract(data: BusOrderContractOrderAddDto) {
    await fetchCreateOrderAddContract(data);
    resultSuccess();
  }
  /**@name 新建打样单 */
  async function createSampleProofing(data: BusOrderContract) {
    await fetchCreateProofingOrder(data);
    resultSuccess();
  }
  /**@name 获取收款单数据 */
  function getCollectionInfo(contractNumber: string) {
    fetchCollectionSlipInfo(contractNumber).then(async (res) => {
      if (res.data) {
        setCollectionInfo(res.data);
      }
    });
  }
  /**@name 审核合同单 */
  async function approveContract(isAgree: boolean) {
    await formRef.current?.validateFields();

    return new Promise((resolve, reject) => {
      let value = '';
      Modal.confirm({
        title: '请您填写审批意见(可不填)',
        content: <Input.TextArea onChange={(e) => (value = e.target.value)} />,
        onOk: () => {
          fetchApproveContract({
            contractNumber: formRef.current?.getFieldValue('contractNumber'),
            isAgree,
            opinion: value,
            salesCommissions: formRef.current?.getFieldValue('salesCommissions'),
          })
            .then((res) => {
              resultSuccess();
              resolve(true);
            })
            .catch(reject);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
  }
  /**@name 修改合同单 */
  async function updateContract(data: BusOrderContract) {
    await fetchUpdateContract(data);
    resultSuccess();
  }
  function resultSuccess() {
    if (query.orderType === BusOrderTypeEnum.SampleProofing) {
      window.layoutTabsAction.goAndClose('/order-manage/sample', true);
    } else {
      window.layoutTabsAction.goAndClose('/order-manage/contract', true);
    }
    message.success('操作成功');
  }
  return (
    <Card style={{ width: 1000, margin: 'auto' }}>
      <ProForm
        grid={true}
        formRef={formRef}
        layout={readonly ? 'horizontal' : 'vertical'}
        submitter={{
          render: (_, dom) => (
            <FooterToolbar>
              <Space>
                <Button
                  hidden={query.type === 'create'}
                  onClick={() => {
                    const values = formRef.current?.getFieldsValue();
                    let title = '';
                    if (query.orderType === BusOrderTypeEnum.Add) {
                      title = '合同单(加单)';
                    } else if (query.orderType === BusOrderTypeEnum.SampleProofing) {
                      title = '打样单';
                    } else {
                      title = '合同单';
                    }
                    exportContractExcel(title, values);
                  }}
                >
                  导出Excel
                </Button>
                <LoadingButton
                  onLoadingClick={async () => {
                    const values = await formRef.current?.getFieldsValue();
                    await saveDrafts('contract', values);
                  }}
                >
                  另存为草稿箱
                </LoadingButton>
                <DraftsModal
                  businessKey="contract"
                  onFinish={async (values) => {
                    await formRef.current?.setFieldsValue(omit(values, 'contractNumber'));
                  }}
                >
                  <Button hidden={query.type !== 'create' && query.type !== 'update'}>
                    设置草稿箱内容
                  </Button>
                </DraftsModal>
                <LoadingButton
                  onLoadingClick={() => approveContract(true)}
                  hidden={query.type !== 'approve'}
                  type="primary"
                >
                  同意通过
                </LoadingButton>
                <LoadingButton
                  onLoadingClick={() => approveContract(false)}
                  hidden={query.type !== 'approve'}
                  danger
                >
                  拒绝驳回
                </LoadingButton>
                <LoadingButton
                  hidden={query.type !== 'update'}
                  type="primary"
                  onLoadingClick={async () => {
                    const values = await formRef.current?.validateFields();
                    await updateContract(values as any);
                  }}
                >
                  保存修改
                </LoadingButton>
                <LoadingButton
                  hidden={query.type !== 'create'}
                  type="primary"
                  onLoadingClick={async () => {
                    const values = await formRef.current?.validateFields();
                    if (query.orderType !== BusOrderTypeEnum.SampleProofing) {
                      await createContract(values as any);
                    } else {
                      await createSampleProofing(values as any);
                    }
                  }}
                >
                  确定创建
                </LoadingButton>
                <LoadingButton
                  hidden={query.orderType !== BusOrderTypeEnum.Add}
                  type="primary"
                  onLoadingClick={async () => {
                    const values = await formRef.current?.validateFields();
                    await createOrderAddContract(values);
                  }}
                >
                  确定加单
                </LoadingButton>
              </Space>
            </FooterToolbar>
          ),
        }}
      >
        <ProFormText
          label="订单单号"
          disabled={true}
          colProps={{ span: 8 }}
          readonly={readonly}
          name="contractNumber"
          placeholder="创建完订单后自动生成"
        />
        {query.orderType === BusOrderTypeEnum.Add ? (
          <ProFormText
            label="订单单号后缀"
            colProps={{ span: 8 }}
            name="suffixContractNumber"
            initialValue={'-1'}
            rules={[{ required: true }]}
            help={`填写后缀,如果为-1则生成合同号为"${query.contractNumber}-1"`}
          />
        ) : null}
        <BusSelectUser
          label="跟进人"
          colProps={{ span: 8 }}
          initialValue={initialState?.currentUser?.id}
          placeholder="请输入名称"
          name="operatorId"
          width="sm"
          formItemProps={{
            className: 'contract-excel-data-operatorId',
          }}
          readonly={true}
        />
        <ProFormDatePicker
          readonly={readonly}
          colProps={{ span: 8 }}
          rules={[{ required: true }]}
          label="交期时间"
          fieldProps={{ disabledDate: disabledLastDate }}
          name="deliverDate"
        />
        <BusSelectCustomerCompany
          label="客户公司"
          width="lg"
          colProps={{ span: 12 }}
          readonly={readonly}
          formItemProps={{
            className: 'contract-excel-data-companyId',
          }}
          rules={[{ required: true }]}
          name="companyId"
        />
        <ProFormDependency name={['companyId']}>
          {({ companyId }) => {
            return (
              <>
                <BusSelectCustomerContacter
                  label="客户联系人"
                  readonly={readonly}
                  colProps={{ span: 12 }}
                  width="lg"
                  formItemProps={{
                    className: 'contract-excel-data-contactId',
                  }}
                  companyId={companyId}
                  name="contactId"
                />
                <BusSelectCustomerAddress
                  label="客户收货地址"
                  style={{ width: '100%' }}
                  readonly={readonly}
                  formItemProps={{
                    className: 'contract-excel-data-addressId',
                  }}
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
          rules={[{ required: true }]}
          fieldProps={{
            addonAfter: '%',
            precision: 2,
          }}
          min={0}
          readonly={readonly}
          max={100}
          name="prepayPercent"
        />

        <ProFormRadio.Group
          label="发票类型"
          name="invoiceType"
          colProps={{ span: 8 }}
          readonly={readonly}
          initialValue="发票"
          rules={[{ required: true }]}
          options={['发票', '普票', '无票']}
        />
        <ProFormText
          readonly={readonly}
          name="payment"
          label="付款方式"
          colProps={{ span: 8 }}
          rules={[{ required: true }]}
          placeholder="请输入名称"
        />
        {/**@name 需要审批人员设置销售提成 */}
        <ProFormDigit
          name="salesCommissions"
          readonly={query.type !== 'approve'}
          label="销售提成(%)"
          colProps={{ span: 8 }}
          fieldProps={{
            addonAfter: '%',
            precision: 2,
          }}
          min={0}
          rules={[{ required: query.type === 'approve' }]}
          max={100}
        />
        <ProFormText
          readonly={readonly}
          name="logisticsMode"
          label="物流方式"
          colProps={{ span: 8 }}
          placeholder="请输入物流方式"
          rules={[{ required: true }]}
        />
        {/**仅普通的合同单可以填写 */}
        {query.orderType === BusOrderTypeEnum.Normal ? (
          <ProFormText
            label="有无样衣"
            colProps={{ span: 8 }}
            readonly={readonly}
            help={readonly ? undefined : '如果有请填写客户来样或者打样单号'}
            initialValue={'无'}
            name="sampleRemark"
          />
        ) : null}

        {query.orderType === BusOrderTypeEnum.Add ? (
          <Alert
            style={{ width: '100%' }}
            type="warning"
            message="追加定单,会复制整个订单,您仅需要填写要添加的尺码颜色数量价格即可,如果有多余款式无需加单删除即可"
          />
        ) : null}
        <ProForm.Item
          name="styleDemand"
          label="款式需求"
          rules={[
            {
              validator(rule, value: BusOrderStyleDemand[], callback) {
                if (isEmpty(value)) {
                  return callback('款式需求不能为空');
                }
                const some = value.some((item) => {
                  if (isEmpty(item.sizePriceNumber)) {
                    callback(`款式中的${item.materialCode}尺码数量价格表不能为空`);
                    return true;
                  }
                  const find = item.sizePriceNumber.find((i) => {
                    return i.number === 0;
                  });
                  if (find) {
                    callback(`款式中的${item.materialCode}尺码数量价格表中数量必须大于0`);
                    return true;
                  }
                });
                if (some) {
                  return;
                }
                callback();
              },
            },
          ]}
        >
          {/** 如果订单类型是加单则可以随意修改内容 */}
          <OrderStyleDemandTable readonly={readonly && query.orderType !== BusOrderTypeEnum.Add} />
        </ProForm.Item>

        <ProFormTextArea
          colProps={{ span: 24 }}
          readonly={readonly}
          label="包装要求"
          name="packageDemand"
        />
        <ProFormTextArea
          colProps={{ span: 24 }}
          readonly={readonly}
          label="备注说明"
          name="remark"
        />
        {collectionInfo?.collectionLog && query.orderType !== BusOrderTypeEnum.Add ? (
          <OrderCollectionSlipLogTable list={collectionInfo?.collectionLog} />
        ) : null}
      </ProForm>
    </Card>
  );
};
export default OrderContractInfo;

/**@name 订单款式 */
export function OrderStyleDemandTable(props: {
  onChange?: (styleGroup: BusOrderStyleDemand[]) => any;
  value?: BusOrderStyleDemand[];
  readonly?: boolean;
}) {
  const [dataSource, setDataSource] = useState<BusOrderStyleDemand[]>([]);
  const columns: ProColumns[] = [
    { title: '物料编码(型号)', dataIndex: 'materialCode' },
    { title: '产品名称', dataIndex: 'style' },
    { title: '订单类型', dataIndex: 'styleType', valueEnum: OrderContractTypeValueEnum.Style },
    {
      title: '总数量',
      key: 'number',
      render(dom, entity, index, action, schema) {
        let total = 0;
        entity.sizePriceNumber?.forEach((i) => {
          total += i.number;
        });
        return total;
      },
    },
    {
      title: '总金额',
      dataIndex: 'totalPrice',
    },
    {
      title: '操作',
      fixed: 'right',
      key: 'operation',
      render(dom, entity, index, action, schema) {
        return (
          <Space size="small">
            <ContractOrderStyleModal
              key="create"
              node={{ type: 'watch', value: entity }}
              title="查看订单款式"
            >
              <Button type="link" size="small">
                查看
              </Button>
            </ContractOrderStyleModal>

            <ContractOrderStyleModal
              key="update"
              node={{ type: 'update', value: entity }}
              title="修改订单款式"
              onFinish={(value) => {
                change(
                  dataSource.map((item, di) => {
                    if (di === index) {
                      return value;
                    }
                    return item;
                  }),
                );
              }}
            >
              {/**@name 如果是加单则可以修改数量价格 */}
              <Button hidden={props.readonly} type="link" size="small">
                修改
              </Button>
            </ContractOrderStyleModal>
            <Button hidden={props.readonly} type="link" size="small" danger>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    setDataSource(props.value || []);
  }, [props.value]);
  function change(data: BusOrderStyleDemand[]) {
    setDataSource(data);
    props.onChange?.(data);
  }
  return (
    <ProTable
      rowKey="materialCode"
      search={false}
      columns={columns}
      dataSource={dataSource}
      style={{ width: 900 }}
      size={'small'}
      toolBarRender={(action: ActionType | undefined) => {
        return props.readonly
          ? []
          : [
              <ContractOrderStyleModal
                key="create"
                node={{ type: 'create' }}
                title="新增订单款式"
                onFinish={(value) => {
                  change([...dataSource, value]);
                }}
              >
                <Button>新增订单款式</Button>
              </ContractOrderStyleModal>,
            ];
      }}
    />
  );
}
