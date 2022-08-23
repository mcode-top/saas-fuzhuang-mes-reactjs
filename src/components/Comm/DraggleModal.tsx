/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-07 17:23:42
 * @Description: 可拖拽对话框
 */
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { BetaSchemaForm } from '@ant-design/pro-form';
import type { FormSchema } from '@ant-design/pro-form/lib/components/SchemaForm';
import type { ModalProps } from 'antd/lib/modal/Modal';

/**
 * 可拖拽JSON表单对话框
 * @see https://procomponents.ant.design/components/modal-form
 * @param props
 * @returns
 */
export function DraggleBetaSchemaFormModal<T, ValueType = 'text'>(
  props: FormSchema<T, ValueType>,
): JSX.Element {
  const draggleRef = React.createRef<any>();
  const [bounds, setBounds] = useState({});
  const [disabled, setDisabled] = useState(true);
  const onStart = (event: any, uiData: any) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  return (
    <BetaSchemaForm<T, ValueType>
      {...{
        ...props,
        modalProps: {
          modalRender: (modal: any) => {
            return (
              <Draggable
                disabled={disabled}
                bounds={bounds}
                onStart={(event, uiData) => onStart(event, uiData)}
              >
                <div ref={draggleRef}>{modal}</div>
              </Draggable>
            );
          },
          title: (
            <div
              style={{
                width: '100%',
                cursor: 'move',
              }}
              onMouseOver={() => {
                if (disabled) {
                  setDisabled(false);
                }
              }}
              onMouseOut={() => {
                setDisabled(true);
              }}
              // fix eslintjsx-a11y/mouse-events-have-key-events
              // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
              onFocus={() => {}}
              onBlur={() => {}}
              // end
            >
              {props?.title}
            </div>
          ),
          ...(props as any)?.modalProps,
        },
      }}
    />
  );
}
