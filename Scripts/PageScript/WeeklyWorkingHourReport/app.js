/**
 * app.js
 * Created by Zhou.Xin.Lin on 2017/12/14.
 */
define('app', function (require) {
    var Vue = require('vue');
    var Mock = require('mock');
    var Ajax = require('ajax');

    Mock.mock('/lines', {
        'lines|3-5': [{
            'name': /L[D-E]0\d/,
            'id|10000-99999': 10000
        }]
    });

    Mock.mock('/workingHours', {
        'workingHours|10': [{
            'id|10000-99999': 10000,
            'lineName': /L[D-E]0\d/,
            'standardWorkingHour|20-30': 20,
            'realWorkingHour|20-30': 20,
            'varianceReason': '@csentence'
        }]
    });

    var App = {
        template: '<div id="app">' +
        '<el-row><el-col :span="24"><div :style="styles.gridContent"></div></el-col></el-row>' +
        '<el-card class="box-card">' +
        '<el-form :inline="true" :model="searchCondition" class="demo-form-inline">' +
        '<el-form-item label="生产周">' +
        '<el-date-picker v-model="searchCondition.week" type="week" format="yyyy 第 WW 周" placeholder="选择周" />' +
        '</el-form-item>' +
        '' +
        '<el-form-item label="拉线">' +
        '<el-select v-model="searchCondition.lineIds" multiple clearable placeholder="所有拉">' +
        '<el-option v-for="line in lines" :key="line.id" :label="line.name" :value="line.id" />' +
        '</el-select>' +
        '</el-form-item>' +
        '<el-form-item><el-button type="primary" @click="search">查询</el-button></el-form-item>' +
        '' +
        '' +
        '' +
        '</el-form>' +
        '</el-card>' +
        '' +
        '<el-table :data="tableData6" border show-summary stripe style="width: 100%">' +
        '<el-table-column prop="lineName" label="拉线" width="180" sortable />' +
        '<el-table-column prop="standardWorkingHour" label="标准工时" width="180" sortable />' +
        '<el-table-column prop="realWorkingHour" label="实际工时" width="180" sortable />' +
        '<el-table-column prop="laborTimeVariance" label="工时差异" width="180" sortable />' +
        '<el-table-column prop="varianceReason" label="工时差异原因" width="360" />' +
        '<el-table-column label="操作"><template scope="scope">' +
        '<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button></template></el-table-column>' +
        '</el-table-column></el-table>' +
        '' +
        '</div>',
        data: function () {
            return {
                msg: '测试信息',
                styles: {
                    gridContent: {
                        borderRadius: '4px',
                        minHeight: '36px',
                        backgroundColor: '#1D8CE0'
                    }
                },
                searchCondition: {
                    week: new Date(),  // 控件返回选中周的所在星期日.不过传到后台只要是整个星期内的任意时间都可以
                    lineIds: ''
                },
                lines: [],
                tableData6: []
            }
        },
        created: function () {
            // 获取line列表
            var _this = this;
            Ajax.get('/lines', function (response) {
                _this.lines = JSON.parse(response).lines || [];
            })
        },
        methods: {
            search: function () {
                var _this = this;
                Ajax.get('/workingHours', function (response) {
                    _this.tableData6 = JSON.parse(response).workingHours || [];
                    _this.tableData6.forEach(function (item) {
                        item.laborTimeVariance = item.realWorkingHour - item.standardWorkingHour;
                    })
                })
            },
            handleEdit: function (index, row) {
                // console.log(row)
                var _this = this;
                const h = this.$createElement;
                var oldVarianceReason = row.varianceReason;// 更改前的差异原因
                function confirmChange(action, instance, done){  // 点击确认后调用
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '执行中...';
                    setTimeout(function () {
                        done();
                        _this.$message({
                            type: 'info',
                            message: 'action: ' + action
                        });
                        setTimeout(function () {
                            instance.confirmButtonLoading = false;
                        }, 300);
                    }, 3000);
                }
                function cancelChange(action, instance, done){  // 点击取消后调用
                    //取消时,差异原因变回原来的值
                    row.varianceReason = oldVarianceReason;
                    done();
                }
                this.$msgbox({
                    title: '编辑',
                    message: h('el-form', null, [
                        function () {
                            return h('el-form-item', {attrs: {label: '工时差异原因'}}, [
                                function () {
                                    return h('el-input', {
                                        attrs: {value: row.varianceReason},
                                        on: {
                                            input: function (newValue) {
                                                row.varianceReason = newValue;
                                            }
                                        }
                                    });
                                }
                            ]);
                        }
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: function (action, instance, done) {
                        if (action === 'confirm') {
                            confirmChange(action, instance, done);
                        } else {
                            cancelChange(action, instance, done);
                        }
                    }
                })
            }
        }
    };

    return App;
});