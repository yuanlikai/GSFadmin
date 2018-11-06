<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>欢迎登陆贵上房后台管理页面</BreadcrumbItem>
    </Breadcrumb>
    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
      <img style="margin: 0 auto;display: block;width:100%" src="https://gsfhuodong.oss-cn-hangzhou.aliyuncs.com/625840045492456641.png" alt="">
    </Content>
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
            key: 'order_id',
            align: 'center',
            width: 50,
          },
          {
            title: '用户ID',
            key: 'user_id',
            align: 'center',
          },
          {
            title: '用户名称',
            key: 'user_name',
            align: 'center',
          },
          {
            title: '楼盘名称',
            key: 'hou_ses_name',
            align: 'center',
          },
          {
            title: '开发商名称',
            key: 'developers_name',
            align: 'center',
          },
          {
            title: '支付状态',
            key: 'order_status',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('p', params.row.order_status === 0 ? '待支付' : '已支付')
              ])
            }
          },
          {
            title: '支付方式',
            key: 'order_pay',
            align: 'center',
            render: (h, params) => {
              let sta;
              switch (params.row.order_pay) {
                case 0:
                  sta = '支付宝';
                  break;
                case 1:
                  sta = '微信';
                  break;
                case 2:
                  sta = 银联;
                  break;
              }
              return h('div', [
                h('p',sta)
              ])
            }
          },
          {
            title: '支付时间',
            key: 'addtime',
            align: 'center',
            width: 150,
            render: (h, params) => {
              return h('div', [
                h('p', this.timestampToTime(params.row.addtime))
              ])
            }
          },
        ],
        data1: []
      }
    },
    methods: {

      //日志列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/order/index', v.Qs.stringify({
          pag: v.pag,
          num: 11
        })).then((res, req) => {
          console.log(res.data)
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
