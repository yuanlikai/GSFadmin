<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>收藏管理</BreadcrumbItem>
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
            key: 'collect_id',
            align: 'center',
            width: 50,
          },
          {
            title: '楼盘ID',
            key: 'user_id',
            align: 'center',
          },
          {
            title: '楼盘ID',
            key: 'pro_id',
            align: 'center',
          },
          {
            title: '楼盘名称',
            key: 'collect_names',
            align: 'center',
          },
          {
            title: '均价(¥)',
            key: 'collect_pirce',
            align: 'center',
          },
          {
            title: '类型',
            key: 'collect_status',
            align: 'center',
            render: (h, params) => {
              let sta;
              switch (params.row.collect_status) {
                case 0:
                  sta = '直卖';
                  break;
                case 1:
                  sta = '优质';
                  break;
                case 2:
                  sta = '中介';
                  break;
                case 3:
                  sta = '个人';
                  break;
              }
              return h('div', [
                h('p',sta)
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
        v.Axios.post('/index.php/admin/collect/index', v.Qs.stringify({
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
