import type { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';

/**@name 只能选择当前时间之后的时间 */
export const disabledLastDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current <= moment().add(-1, 'day').endOf('day');
};
