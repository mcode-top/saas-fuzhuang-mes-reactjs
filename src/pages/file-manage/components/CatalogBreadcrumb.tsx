import { Breadcrumb, Button, Skeleton } from 'antd';
import { useEffect, useState } from 'react';

/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-25 20:39:56
 * 目录面包屑
 */
export default function CatalogBreadcrumb(props: {
  list: {
    name: string;
    id: number;
    parentId: number;
  }[];
  loading?: boolean;
  onChange?: (parentId: number) => void;
}) {
  return props.loading !== true ? (
    <Breadcrumb>
      <Breadcrumb.Item key={-1}>
        <Button type="link" size="small" onClick={() => props.onChange?.(-1)}>
          全部文件
        </Button>
      </Breadcrumb.Item>
      <Breadcrumb.Item key={0}>
        <Button type="link" size="small" onClick={() => props.onChange?.(0)}>
          根目录
        </Button>
      </Breadcrumb.Item>
      {props?.list?.map((item, index) => (
        <Breadcrumb.Item key={item.id}>
          {props.list.length - 1 === index ? (
            item.name
          ) : (
            <Button type="link" size="small" onClick={() => props.onChange?.(item.id)}>
              {item.name}
            </Button>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  ) : (
    <Skeleton.Input active={true} />
  );
}
