/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-25 09:59:58
 * @Description: alibaba/formly json表单注册器
 */

import { createSchemaField, useField } from '@formily/react';
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
import SelectSystemPersonButton from './FormlyComponents/SelectSystemPersonButton';
import SelectSystemPersonButtonV2 from './FormlyComponents/SelectSystemPersonButtonV2';
import SelectUploadFile from './FormlyComponents/Upload';

const FormlySchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    DatePicker,
    Cascader,
    Select,
    ArrayItems,
    Editable,
    SelectUploadFile,
    SelectSystemPersonButton,
    SelectSystemPersonButtonV2,
  },
  scope: {},
});
export default FormlySchemaField;
