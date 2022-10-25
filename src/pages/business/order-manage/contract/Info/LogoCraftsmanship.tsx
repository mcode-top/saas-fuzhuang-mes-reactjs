/**@name Logo表单列表 */

import SelectUploadFile from '@/components/Comm/FormlyComponents/Upload';
import ProForm, { ProFormGroup, ProFormList, ProFormText } from '@ant-design/pro-form';
import { Table } from 'antd';

const LogoCraftsmanship: React.FC<{
  readonly?: boolean;
  value?: any[];
}> = (props) => {
  console.log('====================================');
  console.log(props);
  console.log('====================================');
  return props.readonly ? (
    <Table
      size="small"
      rowKey="logo生产流程"
      columns={[
        { title: 'logo生产流程', dataIndex: 'logo生产流程' },
        { title: 'logo工艺位置', dataIndex: 'logo工艺位置' },
        {
          title: 'logo效果图',
          dataIndex: 'logo效果图',
          render(value, record, index) {
            return (
              <SelectUploadFile
                multiple
                value={value}
                readonly={true}
                accpet="image/*"
                description="logo效果图"
                imageProps={{
                  showImage: true,
                  imageColumn: 3,
                  imageSize: 128,
                }}
              />
            );
          },
        },
      ]}
      dataSource={props.value}
    />
  ) : (
    <ProFormList
      name="logo"
      label="Logo内容"
      creatorButtonProps={props.readonly ? false : undefined}
      copyIconProps={
        props.readonly
          ? false
          : {
              tooltipText: '复制此行到末尾',
            }
      }
      deleteIconProps={
        props.readonly
          ? false
          : {
              tooltipText: '删除此行',
            }
      }
      initialValue={props.value ? props.value : []}
    >
      <ProFormGroup>
        <ProFormText colProps={{ span: 12 }} name="logo生产流程" label="logo生产流程" />
        <ProFormText colProps={{ span: 12 }} name="logo工艺位置" label="logo工艺位置" />
      </ProFormGroup>
      <ProForm.Item name="logo效果图" label="logo效果图">
        <SelectUploadFile
          multiple
          readonly={props.readonly}
          accpet="image/*"
          description="logo效果图"
          imageProps={{
            showImage: true,
            imageColumn: 3,
            imageSize: props.readonly ? 128 : 192,
          }}
        />
      </ProForm.Item>
    </ProFormList>
  );
};

export default LogoCraftsmanship;
