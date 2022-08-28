import { fetchCreateCustomerCompany, fetchUpdateCustomerCompany } from '@/apis/business/customer';
import { BusCustomerCompanyType } from '@/apis/business/customer/typing';
import LoadingButton from '@/components/Comm/LoadingButton';
import { SimpleColumnListRef } from '@/components/Comm/SimpleColumnList';
import { CustomerCompanyValueEnum } from '@/configs/commValueEnum';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import { ProCoreActionType } from '@ant-design/pro-utils';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Form,
  FormInstance,
  Row,
  Space,
  Statistic,
  Table,
  Tooltip,
} from 'antd';
import React, { useState } from 'react';
import { useImperativeHandle } from 'react';
import BusCustomerLeftListDom from './LeftList';
import RightCompanyInfo from './RightCompanyInfo';

const BusCustomerDom: React.FC = () => {
  const [selectRecord, setSelectRecord] = useState<BusCustomerCompanyType>();
  const listRef = React.createRef<SimpleColumnListRef>();
  return (
    <Row gutter={[24, 0]} style={{ height: '100%' }}>
      <Col span={6} style={{ height: '100%' }}>
        <BusCustomerLeftListDom actionRef={listRef} onChange={setSelectRecord} />
      </Col>
      <Col span={18}>
        {selectRecord ? (
          <RightCompanyInfo
            onChange={(type) => {
              if (type === 'company') {
                listRef?.current?.reload?.();
              }
            }}
            record={selectRecord}
          />
        ) : (
          <Empty description="请新建客户公司" />
        )}
      </Col>
    </Row>
  );
};

export default BusCustomerDom;
