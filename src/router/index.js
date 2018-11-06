import Vue from 'vue'
import Router from 'vue-router'
// import Index from '@/components/Index'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: (resolve) => require(['@/components/Index'], resolve),
    },
    {
      path: '/Home',
      name: 'Home',
      component: (resolve) => require(['@/components/Home'], resolve),
      children: [
        //欢迎页
        {
          path: '/welcome',
          name: 'welcome',
          component: (resolve) => require(['@/components/welcome'], resolve)
        },

        //权限管理
        {
          path: '/Admin',
          name: 'Admin',
          component: (resolve) => require(['@/components/Juri/Admin'], resolve)
        },
        {
          path: '/Posit',
          name: 'Posit',
          component: (resolve) => require(['@/components/Juri/Posit'], resolve)
        },
        {
          path: '/JuriList',
          name: 'JuriList',
          component: (resolve) => require(['@/components/Juri/JuriList'], resolve),
        },

        //楼盘管理
        {
          path: '/typeList',
          name: 'typeList',
          component: (resolve) => require(['@/components/Houses/typeList'], resolve),
        },
        {
          path: '/specList',
          name: 'specList',
          component: (resolve) => require(['@/components/Houses/specList'], resolve),
        },
        {
          path: '/superior',
          name: 'superior',
          component: (resolve) => require(['@/components/Houses/superior'], resolve),
        },
        {
          path: '/superiorAdd',
          name: 'superiorAdd',
          component: (resolve) => require(['@/components/Houses/superiorAdd'], resolve),
        },
        {
          path: '/ToAudit',
          name: 'ToAudit',
          component: (resolve) => require(['@/components/Houses/ToAudit'], resolve),
        },
        {
          path: '/OkAudit',
          name: 'OkAudit',
          component: (resolve) => require(['@/components/Houses/OkAudit'], resolve),
        },
        {
          path: '/agent_OkAudit',
          name: 'agent_OkAudit',
          component: (resolve) => require(['@/components/Houses/agent_OkAudit'], resolve),
        },
        {
          path: '/agent_ToAudit',
          name: 'agent_ToAudit',
          component: (resolve) => require(['@/components/Houses/agent_ToAudit'], resolve),
        },
        {
          path: '/agent_Ypl',
          name: 'agent_Ypl',
          component: (resolve) => require(['@/components/Houses/agent_Ypl'], resolve),
        },
        {
          path: '/agent_Npl',
          name: 'agent_Npl',
          component: (resolve) => require(['@/components/Houses/agent_Npl'], resolve),
        },
        {
          path: '/deve_To',
          name: 'deve_To',
          component: (resolve) => require(['@/components/Houses/deve_To'], resolve)
        },
        {
          path: '/deve_Ok',
          name: 'deve_Ok',
          component: (resolve) => require(['@/components/Houses/deve_Ok'], resolve)
        },
        {
          path: '/deveType',
          name: 'deveType',
          component: (resolve) => require(['@/components/Houses/deveType'], resolve)
        },
        {
          path: '/reserve',
          name: 'reserve',
          component: (resolve) => require(['@/components/Houses/reserve'], resolve)
        },
        {
          path: '/deve_Npl',
          name: 'deve_Npl',
          component: (resolve) => require(['@/components/Houses/deve_Npl'], resolve)
        },
        {
          path: '/deve_Ypl',
          name: 'deve_Ypl',
          component: (resolve) => require(['@/components/Houses/deve_Ypl'], resolve)
        },

        //用户管理
        {
          path: '/userList',
          name: 'userList',
          component: (resolve) => require(['@/components/User/userList'], resolve)
        },
        {
          path: '/agentList',
          name: 'agentList',
          component: (resolve) => require(['@/components/User/agentList'], resolve)
        },
        {
          path: '/deveList',
          name: 'deveList',
          component: (resolve) => require(['@/components/User/deveList'], resolve)
        },
        {
          path: '/auditList',
          name: 'auditList',
          component: (resolve) => require(['@/components/User/auditList'], resolve)
        },

        //日志管理
        {
          path: '/JournalList',
          name: 'JournalList',
          component: (resolve) => require(['@/components/Rest/JournalList'], resolve)
        },

        //意见反馈
        {
          path: '/Tickling',
          name: 'Tickling',
          component: (resolve) => require(['@/components/Rest/Tickling'], resolve)
        },

        //中介报备
        {
          path: '/agent',
          name: 'agent',
          component: (resolve) => require(['@/components/Rest/agent'], resolve)
        },

        //轮播图管理
        {
          path: '/Banner',
          name: 'Banner',
          component: (resolve) => require(['@/components/Rest/Banner'], resolve)
        },

        //广告管理
        {
          path: '/Adver',
          name: 'Adver',
          component: (resolve) => require(['@/components/Rest/Adver'], resolve)
        },

        //新闻管理
        {
          path: '/journalism',
          name: 'journalism',
          component: (resolve) => require(['@/components/Rest/journalism'], resolve)
        },

        //客服管理
        {
          path: '/service',
          name: 'service',
          component: (resolve) => require(['@/components/Rest/service'], resolve)
        },

        //收藏列表
        {
          path: '/collect',
          name: 'collect',
          component: (resolve) => require(['@/components/Rest/collect'], resolve)
        },
      ]
    }
  ]
})
