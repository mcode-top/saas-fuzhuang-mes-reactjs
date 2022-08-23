/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-11 20:07:25
 * @Description: 设置安全性
 */

import { updateCurrentUserPassword } from '@/apis/user';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';

export default function SettingSecurity() {
  async function handleFinish(formData) {
    await updateCurrentUserPassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.password,
    });
    message.success('密码修改成功');
  }
  return (
    <ProForm
      layout="vertical"
      onFinish={handleFinish}
      submitter={{
        searchConfig: {
          resetText: '重置',
          submitText: '确认修改密码',
        },
      }}
    >
      <ProFormText.Password
        width="md"
        name="oldPassword"
        label="请输入旧密码"
        rules={[
          {
            required: true,
            message: '必须输入旧密码',
          },
        ]}
      />
      <ProFormText.Password
        width="md"
        name="password"
        label="请输入新密码"
        rules={[
          {
            required: true,
            message: '必须输入新密码',
          },
        ]}
      />
      <ProFormText.Password
        width="md"
        name="confirmPassword"
        label="请确认新密码"
        rules={[
          {
            required: true,
            message: '必须输入确认密码',
          },
          ({ getFieldValue }) => {
            return {
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两个新密码与确认密码必须相同'));
              },
            };
          },
        ]}
      />
    </ProForm>
  );
}
