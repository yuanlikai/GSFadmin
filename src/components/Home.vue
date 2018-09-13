<style>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
</style>
<template>
  <div class="layout">
    <Layout>

      <Header>
        <Menu @on-select="returns" mode="horizontal" theme="dark" active-name="2">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <MenuItem name="1" style="float: right">
              退出
            </MenuItem>
            <MenuItem name="2" style="float: right">
              <Icon type="logo-octocat"/>
              {{user}}
            </MenuItem>
          </div>
        </Menu>
      </Header>

      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu :active-name="active" theme="light" width="auto"
                :open-names="[active.split('-')[0],active.split('-')[0].length==2?active.split('-')[0].substr(0,1):'']"
                @on-select="select">

            <Submenu name="1">
              <template slot="title">
                <Icon type="md-lock"/>
                RBAC权限管理
              </template>
              <MenuItem name="1-1">管理员管理</MenuItem>
              <MenuItem name="1-2">职位管理</MenuItem>
              <MenuItem name="1-3">权限管理</MenuItem>
            </Submenu>

            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-home"/>
                楼盘管理
              </template>
              <MenuItem name="2-1">类型列表</MenuItem>
              <MenuItem name="2-2">规格列表</MenuItem>
              <MenuItem name="2-3">优质楼盘</MenuItem>
              <Submenu name="21">
                <template slot="title">
                  个人房源管理
                </template>
                <MenuItem name="21-4">未审核房源</MenuItem>
                <MenuItem name="21-5">已审核房源</MenuItem>
              </Submenu>
              <Submenu name="22">
                <template slot="title">
                  中介楼盘管理
                </template>
                <MenuItem name="22-6">未审核楼盘</MenuItem>
                <MenuItem name="22-7">已审核楼盘</MenuItem>
                <MenuItem name="22-8">评论未审核</MenuItem>
                <MenuItem name="22-9">评论已审核</MenuItem>
              </Submenu>
              <Submenu name="23">
                <template slot="title">
                  开发商楼盘管理
                </template>
                <MenuItem name="23-10">未审核楼盘</MenuItem>
                <MenuItem name="23-11">已审核楼盘</MenuItem>
                <MenuItem name="23-12">评论未审核</MenuItem>
                <MenuItem name="23-13">评论已审核</MenuItem>
              </Submenu>
              <MenuItem name="2-4">预约管理</MenuItem>
            </Submenu>

            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-people"/>
                用户管理
              </template>
              <MenuItem name="3-1">用户列表</MenuItem>
              <MenuItem name="3-2">中介列表</MenuItem>
              <MenuItem name="3-3">开发商列表</MenuItem>
              <MenuItem name="3-4">未审核列表</MenuItem>
            </Submenu>

            <Submenu name="4">
              <template slot="title">
                <Icon type="ios-people"/>
                其他管理
              </template>
              <MenuItem name="4-1">日志管理</MenuItem>
              <MenuItem name="4-2">意见反馈</MenuItem>
              <MenuItem name="4-3">中介报备</MenuItem>
              <MenuItem name="4-4">轮播图管理</MenuItem>
              <MenuItem name="4-5">活动管理</MenuItem>
              <MenuItem name="4-6">新闻管理</MenuItem>
              <MenuItem name="4-7">订单管理</MenuItem>
              <MenuItem name="4-8">收藏列表</MenuItem>
            </Submenu>

          </Menu>
        </Sider>
        <router-view></router-view>

      </Layout>
    </Layout>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        user: window.sessionStorage.getItem('user'),
        active: sessionStorage.getItem('sele')
      }
    },
    methods: {
      returns(name){
        if(name==1){
          console.log('1')
          this.Yl.removeCookie('admin')
          this.$Message.success('退出登录成功')
          this.$router.push('/')
        }
      },
      select(name) {
        console.log(name)
        switch (name) {

          case '1-1':
            this.$router.push('Admin');
            sessionStorage.setItem('sele', name);
            break;
          case '1-2':
            this.$router.push('Posit');
            sessionStorage.setItem('sele', name);
            break;
          case '1-3':
            this.$router.push('JuriList');
            sessionStorage.setItem('sele', name);
            break;

          case '2-1':
            this.$router.push('typeList');
            sessionStorage.setItem('sele', name);
            break;
          case '2-2':
            this.$router.push('specList');
            sessionStorage.setItem('sele', name);
            break;
          case '2-3':
            this.$router.push('superior');
            sessionStorage.setItem('sele', name);
            break;
          case '2-4':
            this.$router.push('reserve');
            sessionStorage.setItem('sele', name);
            break;
          case '21-4':
            this.$router.push('ToAudit');
            sessionStorage.setItem('sele', name);
            break;
          case '21-5':
            this.$router.push('OkAudit');
            sessionStorage.setItem('sele', name);
            break;
          case '22-6':
            this.$router.push('agent_ToAudit');
            sessionStorage.setItem('sele', name);
            break;
          case '22-7':
            this.$router.push('agent_OkAudit');
            sessionStorage.setItem('sele', name);
            break;
          case '22-8':
            this.$router.push('agent_Npl');
            sessionStorage.setItem('sele', name);
            break;
          case '22-9':
            this.$router.push('agent_Ypl');
            sessionStorage.setItem('sele', name);
            break;
          case '23-10':
            this.$router.push('deve_To');
            sessionStorage.setItem('sele', name);
            break;
          case '23-11':
            this.$router.push('deve_Ok');
            sessionStorage.setItem('sele', name);
            break;
          case '23-12':
            this.$router.push('deve_Npl');
            sessionStorage.setItem('sele', name);
            break;
          case '23-13':
            this.$router.push('deve_Ypl');
            sessionStorage.setItem('sele', name);
            break;

          case '3-1':
            this.$router.push('userList');
            sessionStorage.setItem('sele', name);
            break;
          case '3-2':
            this.$router.push('agentList');
            sessionStorage.setItem('sele', name);
            break;
          case '3-3':
            this.$router.push('deveList');
            sessionStorage.setItem('sele', name);
            break;
          case '3-4':
            this.$router.push('auditList');
            sessionStorage.setItem('sele', name);
            break;

          case '4-1':
            this.$router.push('JournalList');
            sessionStorage.setItem('sele', name);
            break;
          case '4-2':
            this.$router.push('Tickling');
            sessionStorage.setItem('sele', name);
            break;
          case '4-3':
            this.$router.push('Agent');
            sessionStorage.setItem('sele', name);
            break;
          case '4-4':
            this.$router.push('Banner');
            sessionStorage.setItem('sele', name);
            break;
          case '4-5':
            this.$router.push('Adver');
            sessionStorage.setItem('sele', name);
            break;
          case '4-6':
            this.$router.push('journalism');
            sessionStorage.setItem('sele', name);
            break;
          case '4-7':
            this.$router.push('service');
            sessionStorage.setItem('sele', name);
            break;
          case '4-8':
            this.$router.push('collect');
            sessionStorage.setItem('sele', name);
            break;
        }
      }


    },
    mounted() {
    }

  }
</script>
