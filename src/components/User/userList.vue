<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>用户列表</BreadcrumbItem>
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
            width:50,
            align:'center',
            key: 'user_id'
          },
          {
            title: '头像',
            key: 'user_headpic',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: 'http://img.gsfzd.com/' + params.row.user_headpic,
                  },
                  style: {
                    'width': '30px'
                  }
                })
              ])
            }
          },
          {
            title: '用户名',
            key: 'user_name'
          },
          {
            title: '用户昵称',
            key: 'user_nick'
          },
          {
            title: '手机号',
            key: 'user_mobile'
          },
          {
            title: '性别',
            key: 'user_sex',
            render: (h, params) => {
              if (params.row.user_sex === 0) {
                return h('div', [
                  h('p', '女')
                ])
              } else {
                return h('div', [
                  h('p', '男')
                ])
              }
            }
          },

          {
            title: '注册时间',
            key: 'user_regtime',
            render: (h, params) => {
              function timestampToTime(timestamp) {
                let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() + ' ';
                let h = date.getHours() + ':';
                let m = date.getMinutes() + ':';
                let s = date.getSeconds();
                return Y + M + D + h + m + s;
              }

              return h('div', [
                h('p', timestampToTime(params.row.user_regtime))
              ])
            }
          },

          {
            title: '操作',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '是否继续删除该职位?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/user/del', v.Qs.stringify({
                        user_id: params.row.user_id,
                        user_blacklist: 1
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
                ])

              ]);
            }
          }
        ],
        data1: []
      }
    },
    methods: {

      //用户列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/user/index', v.Qs.stringify({
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
