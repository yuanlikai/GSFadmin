<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>个人房源已审核</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <Table :loading="loading2" :columns="columns10" :data="data9" height='568' border></Table>
    </Content>
    <div style="float: left;width: 100%;text-align: center;margin-top: 25px;">
      <Page :total="total" :page-size="11" @on-change="page"/>
    </div>
  </Layout>
</template>

<script type="text/ecmascript-6">
  import expandRow from './table-expand.vue';

  export default {
    components: {expandRow},
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
        columns10: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            title: 'ID',
            align:'center',
            key: 'user_post_id',
            width:50,
          },
          {
            title: '标题',
            key: 'user_post_title'
          },
          {
            title: '小区名',
            key: 'user_post_plot'
          },
          {
            title: '地址',
            key: 'user_address'
          },
          {
            title: '户型',
            key: 'age',
            render: (h, params) => {
              return h('div', [
                h('p', params.row.user_post_room + '室' + params.row.user_post_type.split(',')[0] + '室' + params.row.user_post_type.split(',')[1] + '卫')
              ])
            }
          },
          {
            title: '总价(¥)',
            key: 'user_post_pirce'
          },
          {
            title: '房屋类型',
            key: 'hou_type_title'
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
                    title: '是否继续删除该个人房源?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/user/postDel', v.Qs.stringify({
                        user_post_id: params.row.user_post_id
                      })).then((res, req) => {
                        if (res.data.error === 0) {
                          v.positList();
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
        data9: []
      }
    },
    methods: {

      //用户列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/user/OkAudit', v.Qs.stringify({
          pag: v.pag,
          num: 11
        })).then((res, req) => {
          console.log(res.data)
          v.loading2 = false;
          if (res.data.error === 0) {
            v.data9 = res.data.data.info;
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
