// 引用vue 和vue-router
import Vue from 'vue';
import VueRouter from 'vue-router';

// 大板块的引用
import Home from '../components/Home/home.vue';//总的页面
import Login from '../components/rootGlobal/login.vue';//登陆页面
// 页面的基本架构
import Hello from '../components/Home/hello.vue';//欢迎界面
import Err401 from '../components/rootGlobal/401.vue';//错误界面
import empty from '../components/rootGlobal/empty.vue';//空组建进行页面进行刷新时使用
//管路员
import AllDataCollectionFirst from '../components/gradeFirst/allDataCollection.vue'; //数据汇总
import DetailDataCollectionFirst from '../components/gradeFirst/detailDataCollection.vue'; //详情数据
import UserManagementFirst from '../components/gradeFirst/userManagement.vue'; //账号管理

//一级推广员
import AllDataCollectionTwo from '../components/gradeTwo/allDataCollection.vue'; //数据汇总
import DetailDataCollectionTwo from '../components/gradeTwo/detailDataCollection.vue'; //详情数据
import UserManagementTwo from '../components/gradeTwo/userManagement.vue'; //账号管理


//二级推广员
import AllDataCollectionThree from '../components/gradeThree/allDataCollection.vue'; //数据汇总
import DetailDataCollectionThree from '../components/gradeThree/detailDataCollection.vue'; //详情数据
// 把router 引用进入vue
Vue.use(VueRouter);
// 定义出现的权限判断
// T1、T2、P1、P2、O1、O2、M、C、G
// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公共页面
export const constantRouterMap = [
    {
        path: '/login',
        component: Login,
        name: '',
        meta: { role: ['T1','T2','T3'] },
        hidden: true, //hidden为自定义属性，如果hidden为true则不显示在sidebar侧边栏中
    },
    {
        path: '/home',
        component: Home,
        name: '',
        meta: { role: ['T1','T2','T3'] },
        hidden: true,
        children: [
            { path: '/hello', component: Hello, name: '首页', meta: { role: ['T1','T2','T3'] }, hidden: true },
            { path: '/401', component: Err401, name: '401', meta: { role: ['T1','T2','T3'] }, },
           // { path: '/systemSetup/accountManagement', component: accountManagement, name: '账号管理', iconCls: 'el-icon-menu', hidden: false, meta: { role: ['T1', 'P1'] } },
        ],
    },
    {
        path: '/empty',
        component: empty,
        name: '',
        meta: { role: ['T1','T2','T3'] },
        hidden: true,
    },
];
// 实例化vue的时候只挂载constantRouterMap
export default new VueRouter({
    // 默认不开启history的模式，进行相应的hash模式
    // mode: 'history',
    routes: constantRouterMap,
});
// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouterMap = [
    //管理员
    {
		path: '/home',
		component: Home,
		iconCls: 'icon-home',
		name: '首页',
        meta: { role: ['T1'] },
		children: [
            {path: '/gradeFirst/allDataCollection',component: AllDataCollectionFirst,name: '汇总数据',iconCls: 'el-icon-menu',hidden: false,meta: { role: ['T1'] }},
            {path: '/gradeFirst/detailDataCollection',component: DetailDataCollectionFirst,name: '详情数据',iconCls: 'el-icon-menu',hidden: false,meta: { role: ['T1'] }},
            {path: '/gradeFirst/userManagement',component: UserManagementFirst,name: '账号管理',iconCls: 'el-icon-menu',hidden: false,meta: { role: ['T1'] }},
        ]
    },
    {
		path: '/home',
		component: Home,
		iconCls: 'icon-home',
		name: '首页',
        meta: { role: ['T2'] },
		children: [
            {path: '/gradeTwo/allDataCollection',component: AllDataCollectionTwo,name: '汇总数据',iconCls: 'el-icon-menu',hidden: false,meta: { role: ['T2'] }},
            {path: '/gradeTwo/detailDataCollection',component: DetailDataCollectionTwo,name: '详情数据',iconCls: 'el-icon-menu',hidden: false,meta: { role: ['T2'] }},
            {path: '/gradeTwo/userManagement',component: UserManagementTwo,name: '账号管理',iconCls: 'el-icon-menu',hidden: false,meta: { role: ['T2'] }},
        ]
    },
    //二级推广员
    {
		path: '/home',
		component: Home,
		iconCls: 'icon-home',
		name: '首页',
        meta: { role: ['T3'] },
		children: [
            {path: '/gradeThree/allDataCollection',component: AllDataCollectionThree,name: '汇总数据',iconCls: 'el-icon-menu',hidden: false,meta: { role: ['T3'] }},
            {path: '/gradeThree/detailDataCollection',component: DetailDataCollectionThree,name: '详情数据',iconCls: 'el-icon-menu',hidden: false,meta: { role: ['T3'] }},
        ]
    },
    //{ path: '*', redirect: '/401', hidden: true, },
];
