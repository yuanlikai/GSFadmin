<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>中介报备</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

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
        disabled:false,
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
            key: 'put_id',
            align:'center',
            width:50,
          },
          {
            title: '用户ID',
            key: 'user_id',
            align:'center',
            width:120,
          },
          {
            title: '楼盘名称',
            key: 'hou_name',
            align:'center',
          },
          {
            title: '报备时间',
            align:'center',
            render:(h,params)=>{
              return h('div', [
                h('p',this.timestampToTime(params.row.addtime))
              ])
            }
          },
          {
            title: '中介手机',
            key: 'user_mobile',
            align:'center',
          },
          {
            title: '公司名称 / 分行',
            key: 'put_firm',
            align:'center',
            render:(h,params)=>{
              return h('div', [
                h('p',params.row.put_firm+' / '+params.row.put_branch)
              ])
            }
          },
          {
            title: '对接人 / 手机',
            key: 'agent_put_butt',
            align:'center',
            render:(h,params)=>{
              return h('div',[
                h('p',params.row.put_butt+" / "+params.row.put_mobile)
              ])
            }
          },
          {
            title: '带看车牌',
            key: 'put_plate',
            align:'center',
            width:120,
          },
          {
            title: '客户 / 手机 / 预算',
            key: 'agent_username',
            render:(h,params)=>{
              return h('div',[
                h('p',params.row.username+" / "+params.row.usermobile+" / "+params.row.put_price)
              ])
            }
          },
          {
            title: '看房人数 / 时间',
            key: 'agent_put_plate',
            align:'center',
            render:(h,params)=>{
              return h('div',[
                h('p',params.row.put_num+" / "+this.timestampToTime(params.row.put_seetime).split(' ')[0])
              ])
            }
          },
          {
            title: '操作',
            align: 'center',
            width:100,
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '是否继续删除该报备?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/agent_put/del', v.Qs.stringify({
                        put_id: params.row.put_id,
                      })).then((res, req) => {
                        if(res.data.error===0){
                          v.positList()
                        }else{
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
                ])

              ]);
            }
          }
        ],
        data1: []
      }
    },
    methods: {

      //中介报备
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/agent_put/index', v.Qs.stringify({
          pag: v.pag,
          num: 11
        })).then((res, req) => {
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
