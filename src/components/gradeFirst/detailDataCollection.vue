<template>
	<!-- 详情数据 -->
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom:0px;">
			<el-form :inline="true" style="overflow:hidden;" :model="formOne">
				<el-form-item>
					<div class="block">
						<span class="registerTime">日期</span>
						<el-date-picker 
						v-model="formOne.choiceDate" 
						type="daterange" 
						range-separator=" 至 " 
						placeholder="选择日期范围"></el-date-picker>
					</div>
				</el-form-item>
				<el-form-item>
					<span>渠道</span>
					<el-select style="width: 200px;" v-model="formOne.channel_list" multiple>
						<el-option 
                        v-for="(item, index) in channlList"
                        :key="index"
                        :label="item.annotation" 
                        :value="item.id">
                        </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<span>推广员</span>
					<el-select style="width: 200px;" v-model="formOne.sid">
						<el-option label="全部" value=""></el-option>
						<el-option 
                            :label="item.name" 
                            :value="item.sid"
                            v-for="(item, index) in salesmanOption"
                            :key="index"
                            ></el-option>
					</el-select>
				</el-form-item>
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
                    @click.native.prevent="handleDownloadOne">导出</el-button>
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
				<el-table-column prop="addtime" label="注册时间" ></el-table-column>
				<el-table-column prop="uid" label="UID" ></el-table-column>
				<el-table-column prop="nickname" label="昵称" ></el-table-column>
				<el-table-column prop="sex" label="性别">
                   <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.sex==1">男</p>
                            <p v-else-if="scope.row.sex==2">女</p>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="is_online" label="是否在线">
                     <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.is_online==0">否</p>
                            <p v-else-if="scope.row.is_online==1">是</p>
                        </div>
                    </template>
                </el-table-column>
				<el-table-column prop="lasttime" label="最后登录时间"></el-table-column>
				<!-- <el-table-column prop="recharge_sum" label="日充值"></el-table-column>
                <el-table-column prop="call_count_total" label="总充值"></el-table-column> -->
                <el-table-column prop="call_count" label="有效随机电话数量"></el-table-column>
                <el-table-column prop="channel" label="渠道">
                    <template slot-scope="scope">
                         <div slot="reference" class="name-wrapper">
                            {{getChannl(scope.row.channel)}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="所属推广员"></el-table-column>
                <el-table-column prop="level" label="推广员级别">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <p v-if="scope.row.level==1">一级推广员</p>
                            <p v-else-if="scope.row.level==2">二级推广员</p>
                        </div>
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
                channel_list:null,
                sid:null,
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
               var thisChannlId = '';
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
            obj.channel_list = _this.formOne.channel_list.join(',');
            obj.sid = _this.formOne.sid;
            obj.parent_sid = store.state.user.sid;
            obj.page = _this.page;
            obj.keyword = _this.formOne.keyword;
			return obj; 
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Salesman/getUserDetail';
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
                sid: store.state.user.sid
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
        //导出
        handleDownloadOne() {
			require.ensure([], () => {
			const { export_json_to_excel } = require('../vendor/Export2Excel');
			const tHeader = ['注册时间','UID','昵称','性别','是否在线','最后登录时间','有效随机电话数量','渠道','所属推广员','推广员级别'];
			const filterVal = ['addtime','uid','nickname','sex','is_online','lasttime','call_count','channel','name','level'];
			const data = this.formatJson(filterVal, this.tabData);
			export_json_to_excel(tHeader, data, 'excel表');
            })
		},
        formatJson(filterVal, jsonData) {
			return jsonData.map(v => filterVal.map(j => {
			if (j === 'timestamp') {
				return parseTime(v[j])
			} else {
				return v[j]
			}
			}))
		},
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
