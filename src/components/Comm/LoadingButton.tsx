import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import { omit } from 'lodash';
import { useState } from 'react';

/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-17 23:12:04
 * @Description: 文件描述
 */
const LoadingButton: React.FC<
  Omit<ButtonProps, 'onClick'> & {
    onLoadingClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<any>;
  }
> = (props) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      loading={loading}
      {...omit(props, ['onLoadingClick'])}
      onClick={async (event) => {
        const promise = props?.onLoadingClick?.(event);
        if (promise instanceof Promise) {
          setLoading(true);
          promise.finally(() => {
            setLoading(false);
          });
        }
      }}
    >
      {props?.children}
    </Button>
  );
};
export default LoadingButton;
