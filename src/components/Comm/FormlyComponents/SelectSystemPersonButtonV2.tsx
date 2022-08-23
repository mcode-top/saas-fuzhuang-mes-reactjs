import { useField } from '@formily/react';
import IdToPerson from '../IdToPerson';
import type { SelectSystemPersonType } from '@/components/SelectSystemPerson';
import SelectSystemPerson from '@/components/SelectSystemPerson';
import { Button, Col, Row } from 'antd';
import React from 'react';
import { omit } from 'lodash';
/**@name 系统人员类型 */
type SystemPersonType = 'dept' | 'user' | 'role';
/**@name 系统值如果是multiple则number[] 否number */
type SystemPersonValueType = number[] | number | undefined;
const IdToPersonView: React.FC<{
  value: SystemPersonValueType;
  type: SystemPersonType;
}> = (props) => {
  return <IdToPerson person={setValue(props.value, props.type)} />;
};
/**
 * 选择系统人员组件V2
 */
const SelectSystemPersonButtonV2: React.FC<{
  type: SystemPersonType;
  value: SystemPersonValueType;
  readOnly?: boolean;
  multiple?: boolean | undefined;
  onChange?: ((value: SystemPersonValueType) => void) | undefined;
  onFinish?: ((value: SystemPersonValueType) => Promise<any>) | undefined;
}> = (props) => {
  // Formly只读时
  const upForm = useField();
  if (props.readOnly || (upForm && (upForm.readPretty || upForm.readOnly))) {
    return <IdToPersonView value={props.value} type={props.type} />;
  }
  let showType = 'showUser';
  if (props.type === 'role') {
    showType = 'showRole';
  } else if (props.type === 'dept') {
    showType = 'showDept';
  }
  return (
    <Row gutter={[0, 12]}>
      {props.value && (
        <Col span="24">
          <IdToPersonView value={props.value} type={props.type} />
        </Col>
      )}
      <Col span="24">
        <SelectSystemPerson
          {...{ [showType]: true }}
          multiple={props.multiple}
          onChange={(value) => {
            let returnValue: number[] | number | undefined = undefined;
            if (props.type === 'user') {
              returnValue = value?.userIds;
            } else if (props.type === 'role') {
              returnValue = value?.roleIds;
            } else if (props.type === 'dept') {
              returnValue = value?.deptIds;
            }
            if (!props.multiple) {
              returnValue = (returnValue as number[])[0];
            }
            props.onChange?.(returnValue);
            return props.onFinish?.(returnValue);
          }}
          value={setValue(props.value, props.type)}
        >
          <Button>点击选择系统人员 </Button>
        </SelectSystemPerson>
      </Col>
    </Row>
  );
};
function setValue(value: SystemPersonValueType, type: SystemPersonType) {
  let personValue: PersonGroup | undefined = undefined;
  if (value === undefined) return undefined;
  const propsValue = Array.isArray(value) ? value : [value];
  if (type === 'dept') {
    personValue = { deptIds: propsValue };
  } else if (type === 'user') {
    personValue = { userIds: propsValue };
  } else if (type === 'role') {
    personValue = { roleIds: propsValue };
  }
  return personValue;
}

export default SelectSystemPersonButtonV2;
