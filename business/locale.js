'use strict';

angular.module('nm.locale', []).service('localeZh', function() {
    this.text = {
        foot: 'Copyright 2000-2014 XINHUANET.com All Rights Reserved.未经协议授权禁止下载使用.',
        tip: {
            help: '帮助',
            set: '设置',
            logout: '退出'
        },
        menu: {
            net: '网络传媒影响力分析',
            social: '社交媒体传播影响力分析'
        },
        op: {
            key: '<i class="icon-list"></i> 关键词列表',
            add: '<i class="icon-plus"></i> 添加关键词'
        },
        addKey: {
            title:'添加关键词',
            tip:'注:新的关键词添加后,需要24小时的数据采集和处理时间,届时请在关键词列表中或搜索框中查询结果.',
            suc:'成功添加关键词：',
            txt:'确定'
        } 
    }; 
    this.net = {
        title1: '报道力度分析',
        title2: '转载影响力',
        title3: '转载贡献排名',
        title4: '媒体报道热词分析',
        title5: '媒体情绪分析',
        title6: 'App影响力分析'
    };
    this.social = {
        title1: '社交媒体提及量',
        title2: '口碑分析',
        title3: '社交媒体热词',
        title4: '性别分布',
        title5: '认证类型',
        title6: '地域分布',
        title7: '官微影响力分析'
    };
    this.customKey = []; 
});