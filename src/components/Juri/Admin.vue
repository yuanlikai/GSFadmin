<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>管理员列表</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <Button @click="shoale()" type="primary" style="margin-bottom: 15px">
        <Icon type="md-add"></Icon>
        添加管理员
      </Button>
      <Table :loading="loading2" :columns="columns1" :data="data1" height="568" border></Table>
    </Content>
    <div style="float: left;width: 100%;text-align: center;margin-top: 25px;">
      <Page :total="total" :page-size="11" @on-change="page"/>
    </div>

    <Modal
      v-model="modal1"
      title="请认真填写添加管理员信息"
      :loading="loading1"
      @on-ok="handleSubmit('formValidate')"
      @on-cancel="cancel"
      :styles="{width: '420px'}">

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="管理账号" prop="name">
          <Input :disabled="disabled" :maxlength="18" v-model="formValidate.name" placeholder="Enter your username"></Input>
        </FormItem>
        <template v-if="state!==1">
          <FormItem label="账号密码" prop="passwd">
            <Input type="password" v-model="formValidate.passwd" placeholder="Enter your password"></Input>
          </FormItem>
          <FormItem label="确认密码" prop="passwdCheck">
            <Input type="password" v-model="formValidate.passwdCheck" placeholder="Enter your password"></Input>
          </FormItem>
        </template>
        <FormItem label="选择职位" prop="city">
          <Select v-model="formValidate.city" placeholder="Select your position">
            <Option v-for="(item,index) in positLi" :key="index" :value="String(item.role_id)">{{item.role_name}}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </Layout>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {

      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码！'));
        } else {
          if (this.formValidate.passwdCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs.formValidate.validateField('passwdCheck');
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认密码!'));
        } else if (value !== this.formValidate.passwd) {
          callback(new Error('两次密码输入不一致!'));
        } else {
          callback();
        }
      };
      return {
        state: 0,
        admin_id: '',
        disabled:false,
        positLi: [],
        formValidate: {
          name: '',
          passwd: '',
          passwdCheck: '',
          city: '',
        },
        poist: [],
        ruleValidate: {
          name: [
            {required: true, message: '请输入管理员账号!', trigger: 'blur'}
          ],
          passwd: [
            {required: true, validator: validatePass, trigger: 'blur'}
          ],
          passwdCheck: [
            {required: true, validator: validatePassCheck, trigger: 'blur'}
          ],
          city: [
            {required: true, message: '请选择管理员职位!', trigger: 'change'}
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
            key: 'admin_id'
          },
          {
            title: '用户名',
            key: 'admin_name'
          },
          {
            title: '职位名称',
            key: 'role_name'
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
                      v.disabled=true;
                      v.admin_id = params.row.admin_id;
                      v.position();
                      v.formValidate.name = params.row.admin_name;
                      v.formValidate.city = String(params.row.role_id);
                    }
                  }
                }, '修改'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '是否继续删除该职位?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/admin/del', v.Qs.stringify({
                        admin_id: params.row.admin_id
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
        this.disabled=false;
        this.position();
      },

      //职位列表
      position(){
        let v = this;
        v.Axios.post('/index.php/admin/role/index', v.Qs.stringify({
          pag: 1,
          num: -1
        })).then((res, req) => {
          if (res.data.error === 0) {
            v.positLi = res.data.data.info
          } else {
            v.$Message.success(res.data.errMsg)
          }
        })
      },

      //添加管理员账号列表
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let v = this;
            let data={};
            if(v.state===0){
              data={
                admin_id:'',
                admin_name: v.formValidate.name,
                admin_pwd: v.formValidate.passwd,
                role_id: v.formValidate.city,
              }
            }else {
              data={
                admin_id:v.admin_id,
                role_id: v.formValidate.city,
            }
            }
            v.Axios.post('/index.php/admin/admin/add', v.Qs.stringify(data)).then((res, req) => {
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

      //管理员列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/admin/admin/index', v.Qs.stringify({
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
      this.positList();
    }
  }
</script>

<style lang="less">
</style>
