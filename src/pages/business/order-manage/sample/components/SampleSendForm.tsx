import {
  fetchApproveContract,
  fetchApproveSampleSennd,
  fetchContractSerialNumber,
  fetchCreateContract,
  fetchCreateProofingOrder,
  fetchCreateSampleSend,
  fetchUpdateContract,
  fetchUpdateSampleSend,
  fetchWatchContract,
} from '@/apis/business/order-manage/contract';
import type {
  BusOrderContract,
  BusOrderStyleDemand,
  CreateSampleSendDto,
  OrderSampleStyleDemand,
  UpdateSampleSendDto,
} from '@/apis/business/order-manage/contract/typing';
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
import { Button, Card, Input, message, Modal, Space } from 'antd';
import { isEmpty, omit } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useModel, useParams } from 'umi';
import useSwitchTabs from 'use-switch-tabs';
import BusSelectCustomerAddress from '../../components/SelectCustomerAddress';
import BusSelectCustomerCompany from '../../components/SelectCustomerCompany';
import BusSelectCustomerContacter from '../../components/SelectCustomerContacter';
import BusSelectUser from '../../components/SelectUser';
import { OrderCollectionSlipLogTable } from '../../collection-slip/components/OrderCollectionSlipAddLog';
import { fetchCollectionSlipInfo } from '@/apis/business/order-manage/collection-slip';
import type { BusOrderContractCollectionSlip } from '@/apis/business/order-manage/collection-slip/typing';
import type { SampleSendLocationQuery } from '../typing';
import type { SampleSendStyleDemandModalRef } from './SampleSendStyleDemandModal';
import SampleSendStyleDemandModal from './SampleSendStyleDemandModal';

/**@name 寄样单详情 */
const OrderContractInfo: React.FC = (props) => {
  /**@name 收款记录 */
  const [collectionInfo, setCollectionInfo] = useState<BusOrderContractCollectionSlip>();

  const [readonly, setReadonly] = useState(false);
  const { initialState } = useModel('@@initialState');
  const formRef = React.useRef<ProFormInstance>();
  const location = useLocation();
  const query = (location as any).query as SampleSendLocationQuery;
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
  /**@name 设置订单数据 */
  function setContractValues(contractNumber: string) {
    return fetchWatchContract(contractNumber).then((res) => {
      console.log('====================================');
      console.log(res.data);
      console.log('====================================');
      formRef.current?.setFieldsValue({
        ...res.data,
        orderSampleStyleDemand: res.data.styleDemand,
      });
    });
  }
  /**@name 新建寄样单 */
  async function createSampleSend(data: CreateSampleSendDto) {
    await fetchCreateSampleSend(data);
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
  /**@name 审核寄样单 */
  async function approveSampleSend(isAgree: boolean) {
    await formRef.current?.validateFields();

    return new Promise((resolve, reject) => {
      let value = '';
      Modal.confirm({
        title: '请您填写审批意见(可不填)',
        content: <Input.TextArea onChange={(e) => (value = e.target.value)} />,
        onOk: async () => {
          fetchApproveSampleSennd({
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
  /**@name 修改寄样单 */
  async function updateSampleSend(contractNumber: string, data: UpdateSampleSendDto) {
    await fetchUpdateSampleSend(contractNumber, data);
    resultSuccess();
  }
  function resultSuccess() {
    window.layoutTabsAction.goAndClose('/order-manage/sample', true);
    message.success('操作成功');
  }
  /**@name 是否收费 */
  const isCharge = query.orderType === BusOrderTypeEnum.SampleCharge;
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
                <LoadingButton
                  onLoadingClick={async () => {
                    const values = await formRef.current?.getFieldsValue();
                    await saveDrafts('charge', values);
                  }}
                >
                  另存为草稿箱
                </LoadingButton>
                <DraftsModal
                  businessKey="charge"
                  onFinish={async (values) => {
                    await formRef.current?.setFieldsValue(omit(values, 'contractNumber'));
                  }}
                >
                  <Button hidden={query.type !== 'create' && query.type !== 'update'}>
                    设置草稿箱内容
                  </Button>
                </DraftsModal>
                <LoadingButton
                  onLoadingClick={() => approveSampleSend(true)}
                  hidden={query.type !== 'approve'}
                  type="primary"
                >
                  同意通过
                </LoadingButton>
                <LoadingButton
                  onLoadingClick={() => approveSampleSend(false)}
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
                    await updateSampleSend(query.contractNumber as string, values as any);
                  }}
                >
                  保存修改
                </LoadingButton>
                <LoadingButton
                  hidden={query.type !== 'create'}
                  type="primary"
                  onLoadingClick={async () => {
                    const values = await formRef.current?.validateFields();
                    createSampleSend({
                      ...values,
                      type: query.orderType,
                    });
                  }}
                >
                  确定创建
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
        <BusSelectUser
          label="跟进人"
          colProps={{ span: 8 }}
          initialValue={initialState?.currentUser?.id}
          placeholder="请输入名称"
          name="operatorId"
          width="sm"
          readonly={true}
        />
        <ProFormDatePicker
          readonly={readonly}
          colProps={{ span: 8 }}
          rules={[{ required: true }]}
          label="交期时间"
          fieldProps={{ disabledDate: disabledLastDate }}
          width="sm"
          name="deliverDate"
        />
        <BusSelectCustomerCompany
          label="客户公司"
          width="lg"
          colProps={{ span: 12 }}
          readonly={readonly}
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
                  companyId={companyId}
                  name="contactId"
                />
                <BusSelectCustomerAddress
                  label="客户收货地址"
                  style={{ width: '100%' }}
                  readonly={readonly}
                  colProps={{ span: 24 }}
                  width="lg"
                  companyId={companyId}
                  name="addressId"
                />
              </>
            );
          }}
        </ProFormDependency>
        {/* 仅需要收费时可填写 */}
        {isCharge ? (
          <>
            <ProFormDigit
              label="预付比例(%)"
              colProps={{ span: 8 }}
              rules={[{ required: true }]}
              fieldProps={{
                addonAfter: '%',
                precision: 2,
              }}
              hidden={!isCharge}
              min={0}
              readonly={readonly}
              max={100}
              name="prepayPercent"
            />

            <ProFormRadio.Group
              label="发票类型"
              name="invoiceType"
              colProps={{ span: 8 }}
              hidden={!isCharge}
              readonly={readonly}
              initialValue="发票"
              options={['发票', '普票', '无票']}
            />
            <ProFormText
              readonly={readonly}
              name="payment"
              label="付款方式"
              hidden={!isCharge}
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
            <ProFormRadio.Group
              name="distributionPrint"
              readonly={query.type !== 'approve'}
              label="配货单是否打印"
              options={[
                { label: '打印', value: true },
                { label: '不打印', value: false },
              ]}
              initialValue={false}
              colProps={{ span: 8 }}
              rules={[{ required: query.type === 'approve' }]}
            />
          </>
        ) : null}
        <ProFormText
          readonly={readonly}
          name="logisticsMode"
          label="物流方式"
          colProps={{ span: 8 }}
          placeholder="请输入物流方式"
          rules={[{ required: true }]}
        />
        <ProForm.Item
          name="orderSampleStyleDemand"
          label="仓库款式"
          rules={[
            {
              validator(rule, value, callback) {
                if (isEmpty(value)) {
                  return callback('仓库款式不能为空');
                }
                callback();
              },
            },
          ]}
        >
          <OrderStyleDemandTable isCharge={isCharge} readonly={readonly} />
        </ProForm.Item>
        {collectionInfo?.collectionLog ? (
          <OrderCollectionSlipLogTable list={collectionInfo?.collectionLog} />
        ) : null}
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
      </ProForm>
    </Card>
  );
};
export default OrderContractInfo;

/**@name 订单款式 */
function OrderStyleDemandTable(props: {
  onChange?: (styleGroup: OrderSampleStyleDemand[]) => any;
  value?: OrderSampleStyleDemand[];
  isCharge: boolean;
  readonly?: boolean;
}) {
  const modalRef = useRef<SampleSendStyleDemandModalRef>(null);
  const [dataSource, setDataSource] = useState<OrderSampleStyleDemand[]>([]);
  const columns: ProColumns<OrderSampleStyleDemand>[] = [
    { title: '物料编码(型号)', dataIndex: 'materialCode' },
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
    ...(props.isCharge
      ? [
          {
            title: '总金额',
            dataIndex: 'totalPrice',
          },
        ]
      : []),
    {
      title: '操作',
      fixed: 'right',
      key: 'operation',
      render(dom, entity, index, action, schema) {
        return (
          <Space size="small">
            <Button
              type="link"
              size="small"
              onClick={() => {
                modalRef.current?.show('watch', { ...entity, index });
              }}
            >
              查看
            </Button>
            <Button
              hidden={props.readonly}
              onClick={() => {
                modalRef.current?.show('update', { ...entity, index });
              }}
              type="link"
              size="small"
            >
              修改
            </Button>

            <Button
              hidden={props.readonly}
              type="link"
              size="small"
              danger
              onClick={() => {
                change(
                  dataSource.filter((i, dindex) => {
                    if (dindex === index) {
                      return false;
                    }
                    return true;
                  }),
                );
              }}
            >
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
  function change(data: OrderSampleStyleDemand[]) {
    setDataSource(data);
    props.onChange?.(data);
  }
  return (
    <>
      <SampleSendStyleDemandModal
        ref={modalRef}
        isCharge={props.isCharge}
        onFinish={(value, type) => {
          console.log(value, 'SampleSendStyleDemandModalProps');
          if (type === 'create') {
            change([...dataSource, value]);
          } else if (type === 'update') {
            change([
              ...dataSource.map((i, index) => {
                console.log('====================================');
                console.log((i as any).index, index, value);
                console.log('====================================');
                if (value.index === index) {
                  return value;
                }
                return i;
              }),
            ]);
          }
        }}
      />
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
                <Button
                  key="create"
                  onClick={() => {
                    modalRef.current?.show('create');
                  }}
                >
                  新增款式
                </Button>,
              ];
        }}
      />
    </>
  );
}
