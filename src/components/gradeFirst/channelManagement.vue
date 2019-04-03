<template>
	<!-- 渠道管理 -->
	<section>
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
				<el-table-column prop="channel_id" label="渠道ID" ></el-table-column>
				<el-table-column prop="channel_name" label="渠道名称" ></el-table-column>
                <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-button 
                            size="mini" 
                            type="danger" 
                            v-if="scope.row.status == 0"
                            @click="checkStatus(scope.$index, scope.row)">下架</el-button>
                        <el-button 
                            size="mini" 
                            type="primary" 
                            v-if="scope.row.status == 1"
                            @click="checkStatus(scope.$index, scope.row)">上架</el-button>
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
	},
	methods: {
		handleCurrentChange(val) {
			var _this = this;
            _this.page = val;
            _this.star = (_this.page)*20;
            _this.end = _this.star+20;
		},
		// 获取数据列表
		getTableData() {
			var _this = this ;
			_this.listLoading = true;
			var url = '/Salesman/getChannelList';
			var params = {page:_this.page};
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
        //切换状态 0下架 1上架
        checkStatus(index, rows){
            var _this = this ;
			_this.listLoading = true;
			var url = '/Salesman/setChannel';
			var params = {
                channel_id: rows.channel_id,
                status: rows.status==0?1:0
            };
			axios.get(allget+url, { params: params })		
                .then((res) => {
                    _this.listLoading = false;
                    if(res.data.code == 1) {
                        _this.getTableData();
                    } else {
                        baseConfig.warningTipMsg(_this, res.data.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
	},
	mounted() {
		var _this = this;
		this.$nextTick(function() {
			_this.tableHeight = baseConfig.lineNumber(pageHeight);
			_this.getTableData();
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
