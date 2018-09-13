<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>权限管理</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <Button type="primary" @click="showAlert()">
        <Icon type="md-add"></Icon>
        添加权限
      </Button>
      <Table style="margin-top: 15px" :loading="loading" border :columns="columns1" :data="data1" height="568"></Table>
    </Content>

    <div style="float: left;width: 100%;text-align: center;margin-top: 25px;">
      <Page :total="total" :page-size="11" @on-change="page"/>
    </div>
    <Modal
      v-model="modal1"
      title="请认真填写添加权限信息"
      :loading="loading1"
      @on-ok="handleSubmit('formValidate')"
      @on-cancel="cancel"
      :styles="{width: '400px'}">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="权限名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入权限名称"></Input>
        </FormItem>

        <FormItem label="商品分类" prop="city">
          <Select v-model="formValidate.city" placeholder="请输入选择商品分类">
            <Option value="0">顶级分类</Option>
            <Option v-for="(item,index) in formValidate.cityList" :key="index" :value="String(item.node_id)">
              {{item.node_name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="控制器名" prop="kzq">
          <Input v-model="formValidate.kzq" placeholder="请输入控制器名称"></Input>
        </FormItem>
        <FormItem label="方法名称" prop="fangf">
          <Input v-model="formValidate.fangf" placeholder="请输入方法名称"></Input>
        </FormItem>
      </Form>
    </Modal>
  </Layout>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        modal1: false,
        loading1: true,
        sta:2,
        formValidate: {
          name: '',
          city: '',
          cityList: [],
          kzq: '',
          fangf: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入控制器名称', trigger: 'blur'}
          ],
          city: [
            {required: true, message: '请输入选择商品分类', trigger: 'change'}
          ],
          fangf: [
            {required: true, message: '请输入方法名称', trigger: 'blur'}
          ],
          kzq: [
            {required: true, message: '请输入控制器名称', trigger: 'blur'}
          ],
        },
        total: 1,
        pag: 1,
        loading: true,

        columns1: [
          {
            title: 'ID',
            key: 'node_id'
          },
          {
            title: 'parent ID',
            key: 'node_pid'
          },
          {
            title: '权限名称',
            key: 'node_name'
          },
          {
            title: '控制器名称',
            key: 'node_controller'
          },
          {
            title: '方法名称',
            key: 'node_action'
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
                      this.showAlert(params.row)
                    }
                  }
                }, '修改'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '是否继续删除该权限?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/node/del', v.Qs.stringify({
                        node_id: params.row.node_id
                      })).then((res, req) => {
                        if (res.data.error === 0) {
                          v.list();
                          v.$Message.success('删除权限成功!')
                        } else {
                          v.$Message.success(res.data.errMsg)
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
        data1: [],
      }
    },
    methods: {

      //获取权限列表
      list() {
        let v = this;
        v.loading = true;
        v.Axios.post('/index.php/admin/node/index', v.Qs.stringify({
          pag: v.pag,
          num: '11',
        })).then((res, req) => {

          if (res.data.error === 0) {
            v.total = res.data.data.nodes;
            v.data1 = res.data.data.info;
          } else {
            v.$Message.error(res.data.errMsg)
          }
          v.loading = false;
        })
      },

      //获取添加全选下拉列表
      showAlert(i) {
        let v = this;
        i?v.sta=1:v.sta=2;
        v.loading1 = true;
        v.modal1 = true;
        v.Axios.post('/index.php/admin/node/index1').then((res, req) => {
          if (res.data.error === 0) {
            if(v.sta===1){
              v.formValidate= {
                id:i.node_id,
                name: i.node_name,
                kzq: i.node_controller,
                city:String(i.node_pid),
                cityList : res.data.data,
                fangf: i.node_action
              }
            }else{
              v.formValidate.cityList=res.data.data
            }
          } else {
            v.$Message.error(res.data.errMsg);
          }
        })
      },

      //添加新权限
      handleSubmit(name) {
        let v = this;
        v.$refs[name].validate((valid) => {
          if (valid) {
            if(v.sta===1){
              v.Axios.post('/index.php/admin/node/update',v.Qs.stringify({
                node_id:v.formValidate.id,
                node_name:v.formValidate.name,
                node_controller:v.formValidate.kzq,
                node_action:v.formValidate.fangf,
                node_pid:v.formValidate.city,
              })).then((res,req)=>{
                if (res.data.error === 0) {
                  v.list();
                  v.$refs['formValidate'].resetFields();
                  v.modal1 = false;
                  v.$Message.success('修改成功!');
                } else {
                  v.$Message.error(res.data.errMsg);
                  v.loading1 = false
                }

              })
            }else {
              v.Axios.post('/index.php/admin/node/add', v.Qs.stringify({
                node_name: v.formValidate.name,
                node_controller: v.formValidate.kzq,
                node_action: v.formValidate.fangf,
                node_pid: v.formValidate.city
              })).then((res, req) => {
                if (res.data.error === 0) {
                  v.list();
                  v.$refs['formValidate'].resetFields();
                  v.modal1 = false;
                  v.$Message.success('添加成功!');
                } else {
                  v.$Message.error(res.data.errMsg);
                  v.loading1 = false
                }
              });
            }
          } else {
            v.loading1 = false
            v.$Message.error('Fail!');
          }
        })
      },

      //分页
      page(i) {
        this.pag = i;
        this.list()
      },

      cancel() {
        this.$Message.info('你点击了取消');
        this.$refs['formValidate'].resetFields();
      },
    },
    mounted() {
      this.list()
    }
  }
</script>

<style lang="less">
</style>
