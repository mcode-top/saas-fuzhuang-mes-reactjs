/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-21 13:42:56
 * @Description: 表单解析器
 */

import React, { useState, useEffect } from 'react';
import { request } from 'umi';
import { action } from '@formily/reactive';
import * as _ from 'lodash';
import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import '@formily/antd/dist/antd.css';
import 'antd/dist/antd.css';
import {
  Form,
  FormItem,
  FormLayout,
  Input,
  Select,
  Cascader,
  Submit,
  FormGrid,
  Upload,
  ArrayItems,
  Editable,
  DatePicker,
  FormButtonGroup,
} from '@formily/antd';
import { Card, Button, Spin } from 'antd';

import FormlySchemaField from '@/components/Comm/FormlySchemaField';
import type { ISchema } from '@formily/react';
import { ISchemaFieldProps, useField } from '@formily/react';
import { relationCustomTableSelectList } from '../custom-form.helper';

/**@name 动态获取数据 */
const useAsyncDataSource = (service) => (field) => {
  field.loading = true;
  service(field).then(
    action.bound?.((data) => {
      field.dataSource = data;
      field.loading = false;
    }),
  );
};
const form = createForm({
  // readPretty: true,
  validateFirst: true,
});

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '委托名称',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    userId: {
      type: 'number',
      array: true,
      title: '选择人员组',
      'x-decorator': 'FormItem',
      'x-component': 'SelectSystemPersonButtonV2',
      required: true,
      'x-component-props': {
        type: 'user',
        multiple: true,
      },
    },
    reportId: {
      type: 'number',
      title: '选择报价单',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-reactions': {
        effects: ['onFieldInitialValueChange'],
        target: 'reportId',
        fulfill: {
          run: `            $self.loading=true;
           relationCustomTableSelectList($self.value,{
            businessKey:"core_report",
            labelField:"name",
            searchField:"id",
            labelInner:true
          }).then($self.setDataSource).finally(()=>{          $self.loading=false
          })
           `,
        },
      },
      'x-component-props': {
        multiple: false,
        showSearch: true,
        filterOption: false,
        onSearch: `{{  _.debounce(async (value)=>{
            if(value){
              $self.setLoading(true)
              const result = await relationCustomTableSelectList(value,{
                businessKey:"core_report",
                labelField:"name",
              }).finally(()=>{$self.setLoading(false)})
              $self.setDataSource(result)
            }

        },400) }}`,
      },
    },
  },
} as ISchema;
export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      form.setInitialValues({
        userId: 1,
        reportId: 1,
        username: 'Aston Martin',
        firstName: 'Aston',
        lastName: 'Martin',
        email: 'aston_martin@aston.com',
        gender: 1,
        birthday: '1836-01-03',
        username1: [
          {
            name: 'aBC',
            position: 'aa/aaa',
          },
          {
            name: 'aBC1',
            position: 'aa/aa1a',
          },
        ],
        idCard: [
          {
            name: 'this is image',
            thumbUrl:
              'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            uid: 'rc-upload-1615825692847-2',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
        ],
        contacts: [
          { name: '张三', phone: '13245633378', email: 'zhangsan@gmail.com' },
          { name: '李四', phone: '16873452678', email: 'lisi@gmail.com' },
        ],
      });
      setLoading(false);
    }, 100);
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        background: '#eee',
        padding: '40px 0',
      }}
    >
      <Card title="编辑用户" style={{ width: 620 }}>
        <Spin spinning={loading}>
          <Form
            form={form}
            labelCol={5}
            wrapperCol={16}
            onAutoSubmit={(values) => {
              console.log(values);
            }}
          >
            <FormlySchemaField
              schema={schema}
              scope={{ useAsyncDataSource, relationCustomTableSelectList, _ }}
            />
            <FormButtonGroup.FormItem>
              <Submit block size="large">
                提交
              </Submit>
            </FormButtonGroup.FormItem>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};
