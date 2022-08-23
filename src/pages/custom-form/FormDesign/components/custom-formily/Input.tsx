/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-08 13:01:57
 * @Description: 自定义 formily输入框
 */

import React from 'react';
import type { DnFC } from '@designable/react';
import { createBehavior, createResource } from '@designable/core';

import cls from 'classnames';
import { createVoidFieldSchema } from '@designable/formily-antd';

interface TextProps {
  value?: string;
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p';
  style?: React.CSSProperties;
  className?: string;
}

export const FFP: DnFC<TextProps> = (props) => {
  const tagName = props.mode === 'normal' || !props.mode ? 'div' : props.mode;
  return React.createElement(
    tagName,
    {
      ...props,
      className: cls(props.className, 'abc'),
      'data-content-editable': 'x-component-props.value',
    },
    props.value,
  );
};
FFP.Behavior = createBehavior({
  name: 'FFP',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'FFP',
  designerProps: {
    propsSchema: createVoidFieldSchema({
      type: 'object',
      properties: {
        mode: {
          title: '文本类型',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            defaultValue: 'normal',
          },
          enum: ['h1', 'h2', 'h3', 'p', 'normal'],
        },
      },
    }),
  },
  designerLocales: {},
});

FFP.Resource = createResource({
  icon: 'TextSource',
  title: '标题',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        'x-component': 'FFP',
      },
    },
  ],
});
