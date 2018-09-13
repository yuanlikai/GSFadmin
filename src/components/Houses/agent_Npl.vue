<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>中介评论未审核</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <!--<Button @click="$router.push('superiorAdd')" type="primary" style="margin-bottom: 15px">-->
      <!--<Icon type="md-add"></Icon>-->
      <!--添加优质房源-->
      <!--</Button>-->

      <Table :loading="loading2" :columns="columns1" :data="data1" height="568" border></Table>
    </Content>
    <div style="float: left;width: 100%;text-align: center;margin-top: 25px;">
      <Page :total="total" :page-size="11" @on-change="page"/>
    </div>
  </Layout>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        state: 0,
        admin_id: '',
        disabled: false,
        positLi: [],
        poist: [],
        modal1: false,
        pag: 1,
        loading2: true,
        loading1: true,
        total: 0,
        columns1: [
          {
            title: 'ID',
            key: 'agent_crit_id',
            align: 'center',
            width: 50,
          },
          {
            title: '中介ID',
            key: 'agent_id',
            align: 'center',
            width: 80,
          },
          {
            title: '用户ID',
            key: 'user_id',
            align: 'center',
            width: 80,
          },
          {
            title: '用户昵称',
            key: 'agent_user_nick',
            align: 'center',
            width: 200,
          },
          {
            title: '评论内容',
            key: 'agent_info',
          },
          {
            title: '操作',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '是否继续审核该楼盘评论?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/agent/shen', v.Qs.stringify({
                        agent_crit_id: params.row.agent_crit_id,
                        agent_isadout:0,
                      })).then((res, req) => {
                        if (res.data.error === 0) {
                          v.positList();
                          v.$Message.success('审核成功')
                        } else {
                          v.$Message.error(res.data.errMsg)
                        }
                      })
                    }
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style:{
                      marginRight:'5px'
                    },
                  }, '审核')
                ]),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '是否继续删除该楼盘评论?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/agent/pingLunDel', v.Qs.stringify({
                        agent_crit_id: params.row.agent_crit_id,
                      })).then((res, req) => {
                        if (res.data.error === 0) {
                          v.positList()
                        } else {
                          v.$Message.error(res.data.errMsg)
                        }
                      })
                    }
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  }, '删除')
                ]),
              ]);
            }
          }
        ],
        data1: []
      }
    },
    methods: {

      //优质房源列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/agent/pingLun', v.Qs.stringify({
          pag: v.pag,
          num: 11
        })).then((res, req) => {
          console.log(res.data.data)
          v.loading2 = false;
          if (res.data.error === 0) {
            v.data1 = res.data.data.info;
            v.total = res.data.data.nodes
          } else {
            v.$Message.error(res.data.errMsg)
          }
        })
      },

      //分页
      page(i) {
        this.pag = i;
        this.positList()
      },


      cancel() {
        this.$Message.info('你点击了取消');
      },
    },
    mounted() {
      this.positList()
    }
  }
</script>

<style lang="less">
</style>
