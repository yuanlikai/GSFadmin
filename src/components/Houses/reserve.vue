<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>预约管理</BreadcrumbItem>
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
            key: 'book_id'
          },
          {
            title: '用户ID',
            key: 'user_id',
          },
          {
            title: '楼盘ID',
            key: 'hou_id'
          },
          {
            title: '楼盘名称',
            key: 'book_name'
          },
          {
            title: '预约类型',
            render: (h, params) => {
              if (params.row.book_type === 0) {
                return h('div', [
                  h('p', '新房')
                ])
              } else {
                return h('div', [
                  h('p', '中介')
                ])
              }
            }
          },
          {
            title: '预约人 / 电话',
            key: 'book_nick',
            render:(h,params)=>{
              return h('div', [
                h('p', params.row.book_nick+' / '+params.row.book_mobile)
              ])
            }
          },
          {
            title: '负责人 / 电话',
            key: 'book_nick',
            render:(h,params)=>{
              return h('div', [
                h('p', params.row.hou_name+' / '+params.row.mobile)
              ])
            }
          },
          {
            title: '添加时间',
            key: 'user_regtime',
            render: (h, params) => {

              return h('div', [
                h('p', this.timestampToTime(params.row.addtime))
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
                      v.Axios.post('/index.php/admin/hou/yuYueDel', v.Qs.stringify({
                        book_id: params.row.book_id,
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

      //预约列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/hou/yuYue', v.Qs.stringify({
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
