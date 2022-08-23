import { useField } from '@formily/react';
import IdToPerson from '../IdToPerson';
import type { SelectSystemPersonType } from '@/components/SelectSystemPerson';
import SelectSystemPerson from '@/components/SelectSystemPerson';
import { Button, Col, Row } from 'antd';
import React from 'react';
import { omit } from 'lodash';

/**
 * 选择系统人员组件
 */
const SelectSystemPersonButton: React.FC<
  Omit<SelectSystemPersonType, 'children'> & { readOnly?: boolean }
> = (props) => {
  // Formly只读时
  const upForm = useField();
  if (props.readOnly || (upForm && (upForm.readPretty || upForm.readOnly))) {
    return <IdToPerson showTypeTitle person={props.value} />;
  }
  return (
    <Row gutter={[0, 12]}>
      {props.value && (
        <Col span="24">
          <IdToPerson showTypeTitle person={props.value} />
        </Col>
      )}
      <Col span="24">
        <SelectSystemPerson {...omit(props, 'children')}>
          <Button>点击选择系统人员 </Button>
        </SelectSystemPerson>
      </Col>
    </Row>
  );
};
export default SelectSystemPersonButton;
