import { Col, Row } from 'antd';
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import BusSizeTemplateLeftList from './LeftList';
import BusSizeTemplateTable from './Table';

const BusSizeTemplateDom: React.FC = () => {

  const [selectId, setSelectId] = useState<number | undefined>(undefined);

  return (
    <Row gutter={[24, 0]} style={{ height: '100%', overflow: 'auto' }}>
      <Col span={6}>
        <BusSizeTemplateLeftList onSelect={setSelectId} />
      </Col>
      <Col span={18}>
        <BusSizeTemplateTable selectId={selectId} />
      </Col>
    </Row>
  );
}

export default BusSizeTemplateDom
