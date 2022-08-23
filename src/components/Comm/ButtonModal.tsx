/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-18 14:22:36
 * @Description: 按钮 - 对话框 通过按钮除非对话框显示
 */

import type { ModalProps } from 'antd';
import { Modal } from 'antd';
import classNames from 'classnames';
import { omit } from 'lodash';
import React, { useState } from 'react';

export default function ButtonModal(
  props: ModalProps & {
    buttonRender: React.ReactNode;
    children: React.ReactNode;
    buttonClass?: string;
    buttonStyle?: React.CSSProperties;
  },
) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={props.onOk ? undefined : null}
        {...omit(props, ['buttonRender'])}
        onOk={(e) => {
          const promise: any = props.onOk?.(e);
          if (promise && promise instanceof Promise) {
            promise.then((res) => {
              setVisible(false);
            });
          } else {
            setVisible(false);
          }
          return promise;
        }}
      >
        {props.children}
      </Modal>
      <div
        className={props.buttonClass}
        style={props.buttonStyle}
        onClick={() => {
          setVisible(true);
        }}
      >
        {props.buttonRender}
      </div>
    </>
  );
}
