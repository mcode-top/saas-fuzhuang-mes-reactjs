import { fetchTableModel } from '@/apis/custom-form/custom-form';
import { CUSTOM_TABLE_BUSINESS_KEY_TO_TABLE_MODEL } from '@/pages/custom-form/custom-form.config';

export const key = CUSTOM_TABLE_BUSINESS_KEY_TO_TABLE_MODEL;

export async function loader(options: { businessKey: string }) {
  return await fetchTableModel(options.businessKey).then((res) => res.data);
}
