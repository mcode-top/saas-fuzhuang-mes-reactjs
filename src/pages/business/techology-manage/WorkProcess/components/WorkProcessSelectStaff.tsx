import { fetchWorkStaffList } from '@/apis/business/techology-manage/work-process';
import { arrayAttributeChange } from '@/utils';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';

/**@name 选择工序员工 */
const BusSelectWorkStaff: React.FC<ProFormSelectProps & { workProcessId: number }> = (props) => {
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
      }}
      readonly={props.workProcessId === undefined || props.readonly}
      params={{ workProcessId: props.workProcessId }}
      request={async (params) => {
        if (params.workProcessId === undefined) {
          return [];
        }
        return arrayAttributeChange((await fetchWorkStaffList(params.workProcessId)).data, [
          ['id', 'value'],
          ['name', 'label'],
        ]);
      }}
    />
  );
};
export default BusSelectWorkStaff;
