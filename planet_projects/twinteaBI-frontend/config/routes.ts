export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  { name: '我的图表', icon: 'pieChart', path: '/my_chart', component: './MyChart' },
  { name: '智能分析（同步）', icon: 'barChart', path: '/add_chart', component: './AddChart' },
  {
    name: '智能分析（异步）',
    icon: 'barChart',
    path: '/add_chart_async',
    component: './AddChartAsync',
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
