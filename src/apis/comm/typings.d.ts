/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-02 09:44:47
 * @Description: 公用类型
 */
declare namespace PAGINATION_QUERY {
  type Param<T = Record<string, any>, U = Record<string, string | null>> = {
    query?: T;
    /**
     * 页码
     */
    page?: number;
    /**
     * 数量
     */
    limit?: number;
    order?: U;
  };
  type Result<T = Record<string, any>> = {
    items: T[];
    meta: {
      /**
       * 总数量
       */
      totalItems: number;
      /**
       * 当前已查询数量
       */
      itemCount: number;
      /**
       * 欲查询数量
       */
      itemsPerPage: number;
      /**
       * 总页数
       */
      totalPages: number;
      /**
       * 当前页码
       */
      currentPage: number;
    };
  };
}

declare type RESULT_SUCCESS<T = any> = {
  msg: string;
  data: T;
  code: number;
};

declare type PartialObject<T> = { [P in keyof T]?: T[P] | undefined };

declare type PageDateQuery = Date | string;
declare type PageRangeDateQuery = [PageDateQuery, PageDateQuery];

/**
 * 人员组
 */
declare type PersonGroup = {
  /**@name 用户Id组 */
  userIds?: number[];
  /**@name 角色Id组 */
  roleIds?: number[];
  /**@name 部门Id组 */
  deptIds?: number[];
};

declare type CommTree = {
  label: string;
  value: number | string;
  children: CommTree[];
};
