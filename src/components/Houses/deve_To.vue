<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>开发商未审核楼盘</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <Row>
        <Col span="24">
        <Input style="width: 300px;float: right;margin-bottom: 15px;" @on-search="search()" v-model="value123" search enter-button placeholder="Enter something..."/>
        </Col>
      </Row>

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
        value123:'',
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
            key: 'hou_id',
            align: 'center',
            width: 50,
          },
          {
            title: '用户ID',
            key: 'user_id',
            align: 'center',
          },
          {
            title: '楼盘名称',
            key: 'hou_names',
            align: 'center',
          },
          {
            title: '楼盘地址',
            key: 'hou_address',
          },
          {
            title: '均价',
            align:'center',
            render:(h,params)=>{
              return h('div',[
                h('p',params.row.hou_pirce+'/m²')
              ])
            }
          },
          {
            title: '装修',
            align: 'center',
            key: 'hou_br',
            render:(h,params)=>{
              let sta;
              switch (params.row.hou_br){
                case 0:
                  sta='毛坯';
                  break;
                case 1:
                  sta='简装';
                  break;
                case 2:
                  sta='中等装';
                  break;
                case 3:
                  sta='精装';
                  break;
                case 4:
                  sta='豪华装';
                  break;
                default:
                  sta='暂无';
              }
              return h('div',[
                h('div',sta)
              ])
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 250,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style:{
                    marginRight:'5px'
                  },
                  on:{
                    click:()=>{
                      this.$router.push({
                        name:'superiorAdd',
                        query:{
                          hou_id:params.row.hou_id
                        }
                      })
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style:{
                    marginRight:'5px'
                  },
                  on:{
                    click:()=>{
                      this.$router.push({
                        name:'deveType',
                        query:{
                          hou_id:params.row.hou_id,
                          hou_names:params.row.hou_names,
                          hou_isadout:params.row.hou_isadout
                        }
                      })
                    }
                  }
                }, '户型'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '是否继续审核该楼盘?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/hou/shen1', v.Qs.stringify({
                        hou_id: params.row.hou_id,
                        hou_isadout:0,
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
                    title: '是否继续删除该职位?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/hou/del', v.Qs.stringify({
                        hou_id: params.row.hou_id,
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

      //开发商房源列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/hou/index1', v.Qs.stringify({
          hou_names:v.value123,
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
      search(){
        this.positList();
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
