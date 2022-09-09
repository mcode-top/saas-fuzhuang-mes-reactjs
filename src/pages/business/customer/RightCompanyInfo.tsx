import { fetchRemoveCustomerCompany, fetchUpdateCustomerCompany } from '@/apis/business/customer';
import type { BusCustomerCompanyType } from '@/apis/business/customer/typing';
import LoadingButton from '@/components/Comm/LoadingButton';
import { CustomerCompanyValueEnum } from '@/configs/commValueEnum';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProCoreActionType } from '@ant-design/pro-utils';
import type { FormInstance } from 'antd';
import { Button, Form, Popconfirm, Tabs } from 'antd';
import { useState } from 'react';
import CustomerAddressList from './address/CustomerAddressList';
import CustomerContacterList from './contacter/CustomerContacterList';

const RightCompanyInfo: React.FC<{
  record: BusCustomerCompanyType;
  onChange: (type: 'value' | 'company') => any;
}> = (props) => {
  const [readonly, setReadonly] = useState<boolean>(true);
  const [formRef] = Form.useForm();
  return (
    <PageContainer
      style={{ margin: 0 }}
      content={<CustomerCompanyInfo formRef={formRef} readonly={readonly} record={props.record} />}
      tabList={[
        {
          tab: '公司联系人',
          key: 'contacter',
          children: <CustomerContacterList record={props.record} />,
        },
        {
          tab: '公司收货地址',
          key: 'address',
          children: <CustomerAddressList record={props.record} />,
        },
      ]}
      extra={[
        <Button
          key="1"
          hidden={!readonly}
          onClick={() => {
            setReadonly(false);
          }}
        >
          修改客户
        </Button>,
        <LoadingButton
          hidden={readonly}
          key="2"
          type="primary"
          onLoadingClick={async () => {
            const data = await formRef.validateFields();
            try {
              await fetchUpdateCustomerCompany({ ...(props.record || {}), ...data });
              setReadonly(true);
              props.onChange?.('company');
            } catch (error) {
              console.error(error);
            }
          }}
        >
          保存
        </LoadingButton>,
        <Button
          hidden={readonly}
          key="cancel"
          onClick={() => {
            formRef.resetFields();
            setReadonly(true);
          }}
        >
          取消修改
        </Button>,
        <Popconfirm
          key="Popconfirm"
          title="如果删除客户公司则联系人与地址将不存在，您确定要删除当前客户公司吗？"
          onConfirm={async () => {
            await fetchRemoveCustomerCompany(props.record.id);
            props.onChange?.('company');
          }}
          okText="确认删除"
          cancelText="不删除"
        >
          <Button key="3" danger>
            删除当前客户
          </Button>
        </Popconfirm>,
      ]}
    />
  );
};

/**@name 客户公司详情 */
function CustomerCompanyInfo(props: {
  record: BusCustomerCompanyType;
  readonly?: boolean;
  actionRef?: React.MutableRefObject<ProCoreActionType<ProCoreActionType> | undefined>;
  formRef?: FormInstance<any>;
}) {
  const editable = props.readonly === true ? false : undefined;
  const columns: ProDescriptionsItemProps<Record<string, any>, 'text'>[] = [
    {
      title: '公司名称',
      dataIndex: 'name',
      editable,
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: '公司电话',
      dataIndex: 'phone',
      editable,
    },
    {
      title: '公司类型',
      dataIndex: 'type',
      valueEnum: CustomerCompanyValueEnum.Type,
      formItemProps: {
        rules: [{ required: true }],
      },
      valueType: 'select',
      editable,
    },
    {
      title: '公司地址',
      dataIndex: 'address',
      valueType: 'textarea',
      editable,
    },
    {
      title: '备注描述',
      dataIndex: 'remark',
      valueType: 'textarea',
      editable,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      editable: false,
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      valueType: 'date',
      editable: false,
    },
  ];

  return (
    <ProDescriptions
      column={3}
      dataSource={props.record}
      actionRef={props?.actionRef}
      editable={{
        form: props.formRef,
        editableKeys: (props.readonly
          ? []
          : columns.filter((i) => i.editable !== false).map((i) => i.dataIndex)) as any,
        actionRender: () => [],
      }}
      columns={columns}
    />
  );
}

export default RightCompanyInfo;
