<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>开发商已审核楼盘</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <!--<Button @click="$router.push('superiorAdd')" type="primary" style="margin-bottom: 15px">-->
      <!--<Icon type="md-add"></Icon>-->
      <!--添加优质房源-->
      <!--</Button>-->
      <Button @click="$router.push({name:'superiorAdd',query:{deve:'true'}})" type="primary"
              style="margin-bottom: 15px">
        <Icon type="md-add"></Icon>
        添加开发商楼盘
      </Button>

      <Input style="width: 300px;float: right;margin-bottom: 15px;" @on-search="search()" v-model="value123" search enter-button placeholder="Enter something..."/>

      <!--<Input v-model="value123" @input="search()" placeholder="Enter something..." style="width: 300px;float: right;" />-->


      <Table :loading="loading2" :columns="columns1" :data="data1" height="568" border></Table>
    </Content>
    <div style="float: left;width: 100%;text-align: center;margin-top: 25px;">
      <Page :total="total" :page-size="11" @on-change="page"/>
    </div>

    <Modal
      v-model="modal1"
      title="请认真填写优惠时间"
      :loading="loading1"
      @on-ok="handleSubmit('formValidate')"
      @on-cancel="cancel"
      :styles="{width: '420px'}">

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="优惠状态" prop="name">
          <RadioGroup v-model="formValidate.name">
            <Radio label="0">展示</Radio>
            <Radio label="1">不展示</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="优惠时间" prop="time">
          <DatePicker v-model="formValidate.time" placement="bottom-end" placeholder="Select date" format="yyyy/MM/dd"
                      :editable="false" type="daterange"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
  </Layout>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      const validateTime = (rule, value, callback) => {
        console.log(this.formValidate.time[0].length)
        if (this.formValidate.time[0] < 1) {
          callback(new Error('请选择日期'));
        } else {
          callback();
        }
      };
      return {
        value123:'',
        hou_id:'',
        hou_count_id:'',
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
        formValidate: {
          name: '0',
          time: [],
        },
        ruleValidate: {
          name: [
            {required: true, message: '请填写活动标题!', trigger: 'blur'}
          ],
          time: [
            {required: true, validator: validateTime, trigger: 'change'}
          ],
        },
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
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('p', params.row.hou_pirce + '/m²')
              ])
            }
          },
          {
            title: '装修',
            align: 'center',
            key: 'hou_br',
            render: (h, params) => {
              let sta;
              switch (params.row.hou_br) {
                case 0:
                  sta = '毛坯';
                  break;
                case 1:
                  sta = '简装';
                  break;
                case 2:
                  sta = '中等装';
                  break;
                case 3:
                  sta = '精装';
                  break;
                case 4:
                  sta = '豪华装';
                  break;
                default:
                  sta = '暂无';
              }
              return h('div', [
                h('div', sta)
              ])
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 240,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      let v = this;
                      v.hou_id=params.row.hou_id;
                      v.modal1 = true;
                      v.formValidate.time = [];
                      v.formValidate.name='0';
                      v.Axios.post('/index.php/admin/hou/cIndex', v.Qs.stringify({
                        hou_id: params.row.hou_id
                      })).then((res, req) => {
                        if(res.data.error===0){
                          if(res.data.data.length===0){
                            v.hou_count_id=''
                          }else {
                            v.hou_count_id=res.data.data[0].hou_count_id;
                            v.formValidate.name=String(res.data.data[0].hou_count_show);
                            v.formValidate.time = [];
                            v.formValidate.time.push(String(v.timestampToTime(res.data.data[0].hou_count_addtime)))
                            v.formValidate.time.push(String(v.timestampToTime(res.data.data[0].hou_count_endtime)))
                          }
                        }else{
                          v.$Message.error(res.data.errMsg)
                        }
                      })
                    }
                  }
                }, '优惠'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'superiorAdd',
                        query: {
                          hou_id: params.row.hou_id
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
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'deveType',
                        query: {
                          hou_id: params.row.hou_id,
                          hou_names: params.row.hou_names,
                          hou_isadout: params.row.hou_isadout
                        }
                      })
                    }
                  }
                }, '户型'),
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

      //添加管理员账号列表
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let v = this;
            let star = new Date(v.formValidate.time[0]).getTime() / 1000;
            let end = new Date(v.formValidate.time[1]).getTime() / 1000;
            v.Axios.post('/index.php/admin/hou/cdd', v.Qs.stringify({
              hou_id: v.hou_id,
              hou_count_id: v.hou_count_id,
              hou_count_addtime: star,
              hou_count_endtime: end,
              hou_count_show: v.formValidate.name,
            })).then((res, req) => {
              if(res.data.error===0){
                v.modal1 = false;
                v.$Message.success(res.data.errMsg)
              }else {
                v.$Message.error(res.data.errMsg)
                v.loading1 = false
              }
            })
          } else {
            this.$Message.error('添加活动失败!');
            this.loading1 = false
          }
        })
      },

      //开发商房源列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/hou/index', v.Qs.stringify({
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
