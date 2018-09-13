<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>楼盘管理</BreadcrumbItem>
      <BreadcrumbItem>规格列表</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <Button @click="shoale()" type="primary" style="margin-bottom: 15px">
        <Icon type="md-add"></Icon>
        添加规格
      </Button>
      <Table :loading="loading2" :columns="columns1" :data="data1" height="568" border></Table>
    </Content>
    <div style="float: left;width: 100%;text-align: center;margin-top: 25px;">
      <Page :total="total" :page-size="11" @on-change="page"/>
    </div>

    <Modal
      v-model="modal1"
      title="请认真填写楼盘规格"
      :loading="loading1"
      @on-ok="handleSubmit('formValidate')"
      @on-cancel="cancel"
      :styles="{width: '420px'}">

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="类型名称" prop="name">
          <Input :maxlength="18" v-model="formValidate.name" placeholder="示例：一室两厅"></Input>
        </FormItem>
      </Form>
    </Modal>
  </Layout>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        state: 0,
        hou_size_id: '',
        formValidate: {
          name: '',
        },
        poist: [],
        ruleValidate: {
          name: [
            {required: true, message: '请输入楼盘类型名称!', trigger: 'blur'}
          ],
        },
        modal1: false,
        pag: 1,
        loading2: true,
        loading1: true,
        total: 0,
        columns1: [
          {
            title: 'ID',
            key: 'hou_size_id'
          },
          {
            title: '类型名称',
            key: 'hou_size_info'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
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
                      let v = this;
                      v.state = 1;
                      v.modal1 = true;
                      v.loading1 = true;
                      v.hou_size_id = params.row.hou_size_id;
                      v.formValidate.name = params.row.hou_size_info;
                    }
                  }
                }, '修改'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '是否继续删除该规格?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/hou_size/del', v.Qs.stringify({
                        hou_size_id: params.row.hou_size_id
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
        data1: []
      }
    },
    methods: {

      //显示添加修改管理员弹窗
      shoale() {
        this.$refs['formValidate'].resetFields();
        this.state = 0;
        this.modal1 = true;
        this.loading1 = true;
        console.log(1)
      },


      //添加规格
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let v = this;
            let data={};
            if(v.state===0){
              data={
                hou_size_id:'',
                hou_size_info: v.formValidate.name,
              }
            }else {
              data={
                hou_size_id:v.hou_size_id,
                hou_size_info: v.formValidate.name,
              }
            }
            v.Axios.post('/index.php/admin/hou_size/add', v.Qs.stringify(data)).then((res, req) => {
              if (res.data.error === 0) {
                v.modal1 = false;
                v.positList();
                v.$refs['formValidate'].resetFields();
              } else {
                v.$Message.error(res.data.errMsg);
                v.loading1 = false
              }
            });
          } else {
            this.$Message.error('添加管理员账号失败!');
            this.loading1 = false
          }
        })
      },

      //规格列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/hou_size/index', v.Qs.stringify({
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


      //权限LIST
      quanx() {
        let v = this;
        v.Axios.post('/index.php/admin/role/index1').then((res, req) => {
          if (res.data.error === 0) {
            v.poist = res.data.data;
          } else {
            v.$Message.error(res.data.errMsg);
          }
        })
      },

      cancel() {
        this.$Message.info('你点击了取消');
      },
    },
    mounted() {
      this.quanx();
      this.positList()
    }
  }
</script>

<style lang="less">
</style>
