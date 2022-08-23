/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-08 14:01:16
 * @Description: 自定义表单模板
 */
import type { DnFC } from '@designable/react';
import React from 'react';
import { createBehavior, createResource } from '@designable/core';

import cls from 'classnames';

interface TemplateProps {
  value: any;
  style?: React.CSSProperties; // 元素样式
  className?: string; // 元素类名
}
export const TemplateName: DnFC<TemplateProps> = (props) => {
  const tagName = '设置需要生成自定义表单的标签(如果没有全局引入这里需要引入一下)';
  return React.createElement(
    tagName,
    {
      ...props,
      className: cls(props.className, '其他class'),
      // 设置编辑器中更改的数据影响到的 字段
      'data-content-editable': 'x-component-props.value',
    },
    props.value,
  );
};
const name = 'Template';
const title = '示例';
// 设置右边栏的配置界面
TemplateName.Behavior = createBehavior({
  name: name, //设置组件的名称
  extends: ['Field'], //继承那个组件
  selector: (node) => node.props?.['x-component'] === name, // 设置右边栏显示条件
  designerProps: {
    propsSchema: {},
  },
});
TemplateName.Resource = createResource({
  icon: 'TextSource',
  title: title,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        'x-component': name,
      },
    },
  ],
});
