<template>
	<!-- 账号管理 -->
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom:0px;">
			<el-form :inline="true" style="overflow:hidden;" :model="formOne">
                <el-form-item label="UID/账号">
                    <el-input 
                    v-model="formOne.keyword" 
                    auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
					<el-button 
					type="primary"
					@click="getTableData">查询</el-button>
                    <el-button 
					type="primary"
					@click="addInfoBtn">添加账号</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<template>
			<el-table 
			ref="tableHeight" 
			:data="onePageTabData" 
			border fit highlight-current-row 
			v-loading="listLoading" 
			style="width:100%;" 
			:height="tableHeight">
				<el-table-column prop="" label="序号ID" >
                    <template slot-scope="scope">
                         <div slot="reference" class="name-wrapper">
                            {{scope.$index+1}}
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="username" label="登陆账号" ></el-table-column>
				<el-table-column prop="name" label="推广员姓名" ></el-table-column>
                <el-table-column prop="uid" label="豆豆UID" ></el-table-column>
                <el-table-column prop="level" label="推广员级别">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.level==1">一级推广员</p>
                            <p v-else-if="scope.row.level==2">二级推广员</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="parent_name" label="所属推广员"></el-table-column>
				<el-table-column prop="status" label="账号状态">
                   <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.status==0">冻结</p>
                            <p v-else-if="scope.row.status==1">正常</p>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="create_time" label="添加时间"></el-table-column>
                <el-table-column prop="create_admin" label="添加人"></el-table-column>
                <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-button 
                            size="mini" 
                            type="primary" 
                            @click="editerData(scope.$index, scope.row)">编辑</el-button>
                        <el-button 
                            size="mini" 
                            type="danger" 
                            v-if="scope.row.status == 1"
                            @click="setSalesmanStatus(scope.$index, scope.row)">冻结账号</el-button>
                        <el-button 
                            size="mini" 
                            type="danger" 
                            v-if="scope.row.status == 0"
                            @click="setSalesmanStatus(scope.$index, scope.row)">解冻账号</el-button>
                        <el-button 
                            size="mini" 
                            type="danger" 
                            @click="changePasswordBtn(scope.$index, scope.row)">修改密码</el-button>
                        
                    </template>
                </el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
				<el-pagination 
				layout="total,prev,pager,next,jumper" 
				@current-change="handleCurrentChange" 
				
				:total="totalpage" 
				style="float:right;"></el-pagination>
			</el-col>
            <!--添加账号-->
            <el-dialog title="添加账号" :visible.sync="addInfo.dialogFormVisible">
                <el-form :model="addInfo">
                    <el-form-item label="登陆账号" :label-width="formLabelWidth">
                        <el-input 
                        v-model="addInfo.username" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="登陆密码" :label-width="formLabelWidth">
                        <el-input 
                        type="password"
                        v-model="addInfo.password" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="推广员姓名" :label-width="formLabelWidth">
                        <el-input 
                        v-model="addInfo.name" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                     <el-form-item label="豆豆UID" :label-width="formLabelWidth">
                        <el-input 
                        v-model="addInfo.uid" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道" :label-width="formLabelWidth">
                        <el-select v-model="addInfo.channel_list" multiple style="width:100%">
                            <el-option 
                            v-for="(item, index) in channlList"
                            :key="index"
                            :label="item.annotation" 
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="推广员级别" :label-width="formLabelWidth">
                        <el-select v-model="addInfo.level" style="width:100%" @change="getNext">
                            <el-option label="一级推广员" value="1">一级推广员</el-option>
                            <el-option label="二级推广员" value="2">二级推广员</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth" v-show="isCheck">
                        <el-select v-model="addInfo.leveler" style="width:100%" placeholder="请选择上级推广员">
                            <el-option 
                            v-for="(item, index) in levelers"
                            :key="index"
                            :label="item.name" 
                            :value="item.sid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button 
                    @click="closeAddBtn">取 消</el-button>
                    <el-button 
                    type="primary" 
                    @click="sureAdd">确 定</el-button>
                </div>
            </el-dialog>
            <!--编辑账号-->
            <el-dialog title="编辑账号" :visible.sync="editerInfo.dialogFormVisible">
                <el-form :model="editerInfo">
                    <el-form-item label="登陆账号" :label-width="formLabelWidth">
                        <el-input 
                        v-model="editerInfo.username" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="推广员姓名" :label-width="formLabelWidth">
                        <el-input 
                        v-model="editerInfo.name" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                     <el-form-item label="豆豆UID" :label-width="formLabelWidth">
                        <el-input 
                        v-model="editerInfo.uid" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="渠道" :label-width="formLabelWidth">
                        <el-select v-model="editerInfo.channel_list" multiple style="width:100%">
                            <el-option 
                            v-for="(item, index) in channlList"
                            :key="index"
                            :label="item.annotation" 
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="推广员级别" :label-width="formLabelWidth">
                        <el-select v-model="editerInfo.level" style="width:100%" @change="getNextEditer">
                            <el-option label="一级推广员" value="1">一级推广员</el-option>
                            <el-option label="二级推广员" value="2">二级推广员</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                        <el-select v-model="editerInfo.leveler" style="width:100%" placeholder="请选择上级推广员">
                            <el-option 
                            v-for="(item, index) in levelers"
                            :key="index"
                            :label="item.name" 
                            :value="item.sid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button 
                    @click="closeEditerBtn">取 消</el-button>
                    <el-button 
                    type="primary" 
                    @click="sureEditer">确 定</el-button>
                </div>
            </el-dialog>
            <!--修改密码-->
            <el-dialog title="修改密码" :visible.sync="changePassword.dialogFormVisible">
                <el-form :model="changePassword">
                    <el-form-item label="登陆密码" :label-width="formLabelWidth">
                        <el-input 
                        type="password"
                        v-model="changePassword.password" 
                        auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button 
                    @click="closeChangeBtn">取 消</el-button>
                    <el-button 
                    type="primary" 
                    @click="sureChange">确 定</el-button>
                </div>
            </el-dialog>
		</template>
	</section>
</template>

<script>
import Event from './../../public_js/event.js';
import { allget } from '../../api/api';
import store from '../../vuex/store';
import axios from 'axios';
export default {
	data() {
		return {
			tableHeight: null, 
			operate_user: '',
			formOne: {
				choiceDate: [new Date()-30*24*60*60*1000, new Date()], 
                keyword:null,
			},
			listLoading: false, 
			tabData: [], 
			totalpage: 1000, 
			page: 1, 
			star: '0',
			end: '20',
			dialogFormVisible: false,
			formLabelWidth: '130px', 
            channlList:null,
            salesmanOption:null,
            addInfo: {
                dialogFormVisible: false,
                username:'',
                password:'',
                name:'',
                uid:'',
                channel_list:[],
                level:'',
                leveler:''
            },
            levelers:'',
            isCheck:false,
            changePassword: {
                dialogFormVisible: false,
                password:'',
                sid:''
            },
            editerInfo: {
                dialogFormVisible: false,
                username:'',
                name:'',
                uid:'',
                channel_list:[],
                level:'',
                leveler:'',
                sid:''
            }
		};
	},
	computed:{
		onePageTabData() {
			var _this = this;
			return _this.tabData.slice(_this.star, _this.end);
		},
        getChannl(channlId){
            var _this = this;
            return function(channlId){
               var thisChannlId = ''
                _this.channlList.forEach(element => {
                    if(element.id == channlId){
                        thisChannlId = element.annotation;
                    }
                });
                return thisChannlId;
            };
        },
	},
	methods: {
		handleCurrentChange(val) {
			var _this = this;
			_this.page = val;
            _this.getTableData();
		},
		// 搜索条件
		searchCondition() {
			var _this = this;
			var obj = {};
			obj.start_date = baseConfig.changeDateTime(_this.formOne.choiceDate[0], 0);
			obj.end_date = baseConfig.changeDateTime(_this.formOne.choiceDate[1], 0);
            obj.parent_sid = store.state.user.sid;
            obj.page = _this.page;
            obj.keyword = _this.formOne.keyword;
			return obj; 
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Salesman/getSalesmanList';
			var params = _this.searchCondition();
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    _this.listLoading = false;
                    if(res.data.code == 1) {
                        _this.tabData = res.data.data;
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
		},
        //获取渠道
        getChannlList(){
            var _this = this ;
			_this.listLoading = true;
			var url = '/Salesman/getChannelOptionListBySid';
			var params = {
                sid: 0
            };
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    _this.listLoading = false;
                    if(res.data.code == 1) {
                        _this.channlList = res.data.data;
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //获取推广员
        getSalesmanOption(){
            var _this = this ;
			_this.listLoading = true;
			var url = '/Salesman/getSalesmanOptionListBySid';
			var params = {
                sid: store.state.user.sid
            };
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    _this.listLoading = false;
                    if(res.data.code == 1) {
                        _this.salesmanOption = res.data.data;
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        addInfoBtn(){
            var _this = this;
            _this.addInfo.dialogFormVisible = true;
        },
        //添加账号
        sureAdd(){
            var _this = this;
             _this.listLoading = true;
            var url = '/Salesman/insertSalesman';
			var params = {
                level: _this.addInfo.level,
                username: _this.addInfo.username,
                password: _this.addInfo.password,
                name: _this.addInfo.name,
                uid: _this.addInfo.uid,
                channel_list: _this.addInfo.channel_list.join(','),
                admin: store.state.user.name,
                parent_sid: _this.addInfo.leveler
            };
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    _this.listLoading = false;
                    if(res.data.code == 1) {
                        baseConfig.successTipMsg(_this, '添加成功');
                        _this.addInfo.dialogFormVisible = false;
                        _this.emplit();
                        _this.getTableData();
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //关闭添加弹窗
        closeAddBtn(){
            this.addInfo.dialogFormVisible = false;
            this.emplit();
        },
        //清数据
        emplit(){
            this.addInfo = {
                dialogFormVisible:false,
                username:'',
                password:'',
                name:'',
                uid:'',
                channel_list:[],
                level:'',
                leveler:''
            };
            this.levelers = '';
            this.isCheck = false;
        },
        //获取推广员
        getNext(){
            var _this = this;
            _this.addInfo.leveler = '';
            _this.levelers = '';
            var url = '/Salesman/getSalesmanOptionListByLevel';
			var params = {
                level: _this.addInfo.level
            };
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    _this.listLoading = false;
                    if(res.data.code == 1) {
                        _this.isCheck = true;
                        _this.levelers = res.data.data;
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getNextEditer(){
            var _this = this;
            _this.editerInfo.leveler = '';
            _this.levelers = '';
            var url = '/Salesman/getSalesmanOptionListByLevel';
			var params = {
                level: _this.editerInfo.level
            };
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    _this.listLoading = false;
                    if(res.data.code == 1) {
                        _this.levelers = res.data.data;
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //设置状态
        setSalesmanStatus(index, rows){
            var _this = this;
            _this.listLoading = true;
            this.$confirm('确定要冻结该账号吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url2 = "/Salesman/setSalesmanStatus";
                let params2 = {
                    sid : rows.sid,
                    status: rows.status==0?1:0,
                    admin: store.state.user.name
                };
                axios.get(allget+url2, {params: params2})
                .then((res) => {
                    _this.listLoading = false;
                    if (res.data.code == 1) {
                        _this.getTableData();
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                    } else {
                        this.$message({
                            type: 'info',
                            message: res.data.msg
                        });
                    }
                })   
            }).catch(() => {
                _this.listLoading = false;
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },
        //修改密码
        changePasswordBtn(index, rows){
            this.changePassword.dialogFormVisible = true;
            this.changePassword.sid = rows.sid;
        },
        closeChangeBtn(){
            this.changePassword.dialogFormVisible = false;
            this.changePassword.password = '';
        },
        sureChange(){
            var _this = this;
            _this.listLoading = true;
            var url = '/Salesman/setSalesmanPassword';
			var params = {
                sid: _this.changePassword.sid,
                password: _this.changePassword.password,
                admin: store.state.user.name
            };
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    _this.listLoading = false;
                    if(res.data.code == 1) {
                        _this.changePassword.dialogFormVisible = false;
                         _this.getTableData();
                         this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //编辑 leveler
        editerData(index, rows){
            console.log(rows)
            var _this = this;
            _this.editerInfo.channel_list = '';
            _this.editerInfo.dialogFormVisible = true;
            _this.editerInfo.username = rows.username;
            _this.editerInfo.name = rows.name;
            _this.editerInfo.uid = rows.uid;
            _this.editerInfo.level = rows.level;
            _this.editerInfo.sid = rows.sid;
            _this.editerPrevChannel(index, rows);
            
            // _this.editerInfo.leveler = rows.parent_name;
        },
        //编辑时上一级的下拉内容
        editerPrev(){
            var _this = this;
            var url = '/Salesman/getSalesmanOptionListByLevel';
			var params = {
                level: _this.editerInfo.level
            };
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    if(res.data.code == 1) {
                       _this.levelers = res.data.data;
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        //编辑时渠道
        editerPrevChannel(index, rows){
            var _this = this;
            var url = '/Salesman/getSalesman';
			var params = {
                sid: rows.sid
            };
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    if(res.data.code == 1) {
                       var arr = [];
                       _this.editerInfo.leveler = res.data.data.parent_sid;
                      _this.editerInfo.channel_list = res.data.data.channel_list;
                      _this.editerPrev();
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        sureEditer(){
            var _this = this;
             _this.listLoading = true;
            var url = '/Salesman/updateSalesman';
			var params = {
                level: _this.editerInfo.level,
                username: _this.editerInfo.username,
                name: _this.editerInfo.name,
                uid: _this.editerInfo.uid,
                channel_list: _this.editerInfo.channel_list.join(','),
                admin: store.state.user.name,
                parent_sid: _this.editerInfo.leveler,
                sid: _this.editerInfo.sid,
            };
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    _this.listLoading = false;
                    if(res.data.code == 1) {
                        baseConfig.successTipMsg(_this, '修改成功');
                        _this.editerInfo.dialogFormVisible = false;
                        _this.closeEditerBtn();
                        _this.getTableData();
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        closeEditerBtn(){
            this.editerInfo= {
                dialogFormVisible: false,
                username:'',
                name:'',
                uid:'',
                channel_list:[],
                level:'',
                leveler:'',
                sid:''
            }
            this.levelers = '';
        }
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(searchPageHeight);
			_this.getTableData();
            _this.getChannlList();
            _this.getSalesmanOption();
		})
	}
};
</script>

<style lang="css" scoped>
/* 页面样式css内容 */
.excelBox{
	width: 500px; height: 270px; margin-left: -150px; background: #f1f7ff;
	position: absolute; left: 50%; top: 15%; z-index: 1000;
}
p{ margin: 0; }
.excelBox>p{
	width:100%; height: 50px; line-height: 50px; font-weight:bold;
	background: #e3efff; text-align:center;
}
.excelBox .excelInput{
	width:100%; height: 60px;
}
.excelBox .select{
	width:100%; height: 80px;
}
.excelBox .excelInput p,
.excelBox .select p{
	width:100%; height: 36px; text-indent: 20px; line-height: 36px;
}
.excelBox .excelInput input{
    width:300px; display:block; margin: 0 auto;
}
.excelBox .select>div{
	width:300px; display:block; margin: 0 auto;
}
.btns{
    width:100%; height: 50px;
}
.btns button{
    width: 80px; height: 40px; text-align:center; line-height: 40px;
    border: none; border-radius: 5px;
    background-color: #78B2FF; margin-top:20px; color: #fff;
}
.btns button:nth-of-type(1){
    margin-left: 150px; cursor: pointer;
}
.btns button:nth-of-type(2){
    margin-left: 50px; cursor: pointer;
}
</style>
