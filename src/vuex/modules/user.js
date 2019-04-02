import { allget } from '../../api/api';
import md5 from '../../public_js/md5';
import axios from 'axios';
const user = {
    state: {
        user: '',
        name: '',
        status: '',
        roles: [],
        router: [],
        sid: '',
        status: '',
        token: '',
    },
    mutations: {
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_USER: (state, user) => {
            state.user = user;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_ROUTER: (state, router) => {
            state.router = router;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_SID: (state, sid) => {
            state.sid = sid;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
    },
    actions: {
        // 获取用户信息，请求接口数据，将信息保存在user中
        GetInfo({ commit }, ueserInfo) {
            return new Promise((resolve, reject) => {
                var url = '/Salesman/login';
                var params = {
                    username: ueserInfo.username,
                    password: ueserInfo.password,
                };
                try {
                    axios.get( allget+url, { params: params } )
                    .then((res) => {
                        if(res.data.code) {
                            var arr = [];
                            if(res.data.data.level==0) { arr.push('T1') } 
                            else if(res.data.data.level==1) { arr.push('T2'); }
                            else if(res.data.data.level==2) { arr.push('T3'); }
                            // 可以在这里设置角色测试
                            commit('SET_ROLES', arr); 
                            commit('SET_USER', res.data.data.username);
                            commit('SET_NAME', res.data.data.name);
                            commit('SET_SID', res.data.data.sid);
                            commit('SET_STATUS', res.data.data.status);
                            commit('SET_TOKEN', 'youwodianliaodoudou');
                            // 每天一次的登录，将信息储存到cookie保留一天
                            baseConfig.setCookie(
                                'userlist',
                                JSON.stringify(
                                    {
                                        roles: arr,
                                        user_name: res.data.data.user_name,
                                        real_name: res.data.data.name,
                                        sid: res.data.data.sid,
                                        status: res.data.data.status,
                                    }
                                ),
                                1
                            );
                            resolve(res);
                        } else {
                            baseConfig.warningTipMsg(ueserInfo.obj, res.data.msg);
                            resolve(res);
                        }
                    });
                } catch(e) {
                    console.log(e);
                } finally {  }
            })
            .catch(e => {
                console.log(e);
                reject(e);
            });
        },
        // 直接进入，从login.vue直接路由回到hello.vue
        AgainGetInfo({ commit }) {
            return new Promise((resolve, reject) => {
                try {
                    // 可以在这里设置角色测试
                    commit('SET_ROLES', JSON.parse(baseConfig.getCookie('userlist')).roles); 
                    commit('SET_USER', JSON.parse(baseConfig.getCookie('userlist')).user_name);
                    commit('SET_NAME', JSON.parse(baseConfig.getCookie('userlist')).real_name);
                    commit('SET_SID', JSON.parse(baseConfig.getCookie('userlist')).sid);
                    commit('SET_STATUS', JSON.parse(baseConfig.getCookie('userlist')).status);
                    commit('SET_TOKEN', 'youwodianliaodoudou');
                    resolve(baseConfig.getCookie('userlist'));
                } catch(e) {
                    console.log(e);
                } finally {  }
            })
            .catch(e => {
                reject(e);
            });
        },
        // 证明
        GetInfoId({ commit, state }) {
            commit('SET_TOKEN', 'youwodianliaodoudou');
        },
        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_ROLES', []);
                    Cookies.remove('Admin-Token');
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                Cookies.remove('Admin-Token');
                resolve();
            });
        },
        // 动态修改权限
        ChangeRole({ commit }, role) {
            return new Promise(resolve => {
                commit('SET_ROLES', [role]);
                Cookies.set('Admin-Token', role);
                resolve();
            });
        },
        // 保存用户在每一个版块的当前的路由
        // 如果是路由跳转的地方进行拿取相应的值，之前的路由的大地址进行的切换，进行相应的改变
        // 在跳转成功之后进行相应的发起改变相应的值
        // ChangeOneRoute({ commit }, param) {
        //     return new Promise((resolve, reject) => {
        //         var arr = param.data;
        //         if(param.path.indexOf('/operationData')==0) {
        //             arr[0] = param.path;
        //         } else if(param.path.indexOf('/userManagement')==0) {
        //             arr[1] = param.path;                    
        //         } else if(param.path.indexOf('/operationSupport')==0) {
        //             arr[2] = param.path;                    
        //         } else if(param.path.indexOf('/activities')==0) {
        //             arr[3] = param.path;                    
        //         } else if(param.path.indexOf('/systemSetup')==0) {
        //             arr[4] = param.path;                    
        //         }
        //         commit('SET_ALL_ROLES', arr);
        //         resolve('成功');
        //     })
        //     .catch((error) => {
        //         reject(error);
        //     }); 
        // },
    }
};
export default user;