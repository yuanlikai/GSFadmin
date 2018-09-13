<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>优质房源</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <Button @click="$router.push('superiorAdd')" type="primary" style="margin-bottom: 15px">
        <Icon type="md-add"></Icon>
        添加优质房源
      </Button>

      <Input style="width: 300px;float: right;" @on-search="search()" v-model="value123" search enter-button placeholder="Enter something..."/>

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
            key: 'quality_id',
            align: 'center',
            width: 50,
          },
          {
            title: '管理员',
            key: 'admin_name',
            align: 'center',
          },
          {
            title: '楼盘名称',
            key: 'quality_names',
            align: 'center',
          },
          {
            title: '楼盘地址',
            key: 'quality_address',
          },
          {
            title: '均价',
            align:'center',
            render:(h,params)=>{
              return h('div',[
                h('p',params.row.quality_pirce+'/m²')
              ])
            }
          },
          {
            title: '装修',
            align: 'center',
            render:(h,params)=>{
              let sta;
              switch (params.row.quality_br){
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
            title: '属性',
            align:'center',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('ButtonGroup', [
                  h('Button', {
                    props: {
                      icon: 'md-arrow-round-up',
                      size: 'small'
                    },
                    style: {
                      color: params.row.quality_istop === 0 ? '#17233d' : '#e0e0e0'
                    },
                    on: {
                      click: () => {
                        let v = this;
                        v.Axios.post('/index.php/admin/quality/isShow', v.Qs.stringify({
                          quality_id: params.row.quality_id,
                          quality_istop: params.row.quality_istop === 0 ? 1 : 0,
                        })).then((res, req) => {
                          if (res.data.error === 0) {
                            v.positList()
                          } else {
                            v.$Message.error(res.data.errMsg)
                          }
                        })
                      }
                    }
                  }),
                  h('Button', {
                    props: {
                      icon: 'md-flame',
                      size: 'small'
                    },
                    style: {
                      color: params.row.quality_ishot === 0 ? '#17233d' : '#e0e0e0'
                    },
                    on: {
                      click: () => {
                        let v = this;
                        v.Axios.post('/index.php/admin/quality/isHot', v.Qs.stringify({
                          quality_id: params.row.quality_id,
                          quality_ishot: params.row.quality_ishot === 0 ? 1 : 0,
                        })).then((res, req) => {
                          console.log(res.data)
                          if (res.data.error === 0) {
                            v.positList()
                          } else {
                            v.$Message.error(res.data.errMsg)
                          }
                        })
                      }
                    }
                  })
                ])
              ]);
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 150,
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
                          quality_id:params.row.quality_id
                        }
                      })
                    }
                  }
                }, '详情'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '是否继续删除该职位?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/quality/del', v.Qs.stringify({
                        quality_id: params.row.quality_id,
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
        v.Axios.post('/index.php/admin/quality/index', v.Qs.stringify({
          quality_names:v.value123,
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
      search(){
        console.log('1')
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
