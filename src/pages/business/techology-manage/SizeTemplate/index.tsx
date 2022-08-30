import ProCard from '@ant-design/pro-card';
import { Col, Row } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import BusSizeTemplateLeftList from './LeftList';
import BusSizeTemplateTable from './Table';
import { BusSizeTemplateParentType } from './typing';

const BusSizeTemplateDom: React.FC = () => {
  const [select, setSelect] = useState<{
    selectId: number | undefined;
    node: BusSizeTemplateParentType | undefined;
  }>();

  return (
    <Row gutter={[24, 0]} style={{ height: '100%', overflow: 'auto' }}>
      <Col span={6}>
        <BusSizeTemplateLeftList
          onSelect={(selectId, node) => {
            setSelect({ selectId, node });
          }}
        />
      </Col>
      <Col span={18}>
        <BusSizeTemplateTable selectId={select?.selectId} selectNode={select?.node} />
      </Col>
    </Row>
  );
};

export default BusSizeTemplateDom;
