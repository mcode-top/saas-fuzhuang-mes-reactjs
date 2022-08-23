import { MenuDataItem } from '@umijs/route-utils';
type Router = MenuDataItem & {
  component?: string,
  /**
   * 不需要鉴权
   */
  white?: boolean
  access?: string
}
const originRoutes: Router[] = [
  {
    path: "/",
    white: true,
    component: "./custom-form/FormViewer"
  },
  {
    path: "/form",
    white: true,
    hideInMenu: true,
    layout: false,
    component: "./custom-form/FormViewer"
  },
  {
    path: "/login",
    white: true,
    redirect: "/user/login"
  },
  {
    path: '/user',
    layout: false,
    white: true,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
        white: true,
      },
    ],
  },
  {
    path: '/account',
    name: '个人管理',
    hideInMenu: true,
    white: true,
    routes: [
      {
        name: '个人设置',
        hideInMenu: true,
        white: true,
        path: '/account/setting',
        component: './account/Setting',
      },
      {
        name: '个人任务',
        hideInMenu: true,
        white: true,
        path: '/account/task',
        component: './account/Task',
      },
      {
        name: '消息记录',
        hideInMenu: true,
        path: '/account/message',
        component: './message/Account',
      },
    ],
  },
  {
    name: '文件管理',
    white: true,
    path: '/file-manage',
    routes: [
      {
        path: '/file-manage/my',
        name: '我的文件目录',
        white: true,
        component: './file-manage/MyFileList',
      },
      {
        white: true,
        path: "/file-manage/organization",
        name: "公司文件目录",
        component: './file-manage/OrganizationFileList',
      },
    ],
  },
  {
    name: '人员管理',
    path: '/person',
    access: 'canAdmin',
    routes: [
      {
        path: '/person/users',
        name: '用户管理',
        component: './person/Users',
      },
      {
        path: '/person/roles',
        name: '角色管理',
        component: './person/Roles',
      },
    ],
  },
  {
    name: '工艺管理',
    path: '/technology',
    routes: [
      {
        path: '/technology/work-process',
        name: '工序管理',
        component: './business/techology-manage/WorkProcess',
      },
      {
        path: '/technology/work-price',
        name: '工价管理',
        component: './business/techology-manage/WorkPrice',
      },
      {
        path: '/technology/station',
        name: '工位管理',
        component: './business/techology-manage/Station',
      },
      {
        path: '/technology/size-template',
        name: '尺码管理',
        component: './business/techology-manage/SizeTemplate',
      },
      {
        path: '/technology/material',
        name: '物料管理',
        component: './business/techology-manage/Material',
      },
    ],
  },
  {
    name: "系统消息管理",
    path: "/message",
    component: './message/System',

  },
  {
    component: './404',
    name: '未查找到页面',
    path: '(.*)',
    expect: true,
    white: true,
    hideInMenu: true,
  },
]

function authentication(routes: Router[] | Router) {
  if (Array.isArray(routes)) {
    return routes.map(authentication)
  } else {
    const route = routes as Router;
    if (!route.white) {
      route.access = "menuAuth"
    }
    if (Array.isArray(route.routes)) {
      route.routes = authentication(route.routes)
    }
    return route
  }
}

export default authentication(originRoutes);

