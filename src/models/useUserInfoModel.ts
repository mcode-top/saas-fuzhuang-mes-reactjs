import type { UserInfo } from '@/apis/user/typings';
import { useState } from 'react';

/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-01 12:51:12
 * @Description: 用户状态
 */
export default () => {
  const [user, setUser] = useState<UserInfo>();
  return {
    user,
    setUser,
  };
};
