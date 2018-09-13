<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>职位管理</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <Button @click="shoale()" type="primary" style="margin-bottom: 15px">
        <Icon type="md-add"></Icon>
        添加职位
      </Button>
      <Table :loading="loading2" :columns="columns1" :data="data1" height="568" border></Table>
    </Content>
    <div style="float: left;width: 100%;text-align: center;margin-top: 25px;">
      <Page :total="total" :page-size="11" @on-change="page"/>
    </div>

    <Modal
      v-model="modal1"
      title="请认真填写添加职位信息"
      :loading="loading1"
      @on-ok="handleSubmit('formValidate')"
      @on-cancel="cancel"
      :styles="{width: '600px'}">

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="职位名称" prop="name">
          <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="权限状态" prop="gender">
          <RadioGroup v-model="formValidate.gender">
            <Radio label="0">启用</Radio>
            <Radio label="1">禁用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="职位描述" prop="desc">
          <Input v-model="formValidate.desc" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="拥有权限" prop="interest" style="height: 400px;overflow-x: auto">
          <CheckboxGroup v-model="formValidate.interest">
            <div v-for="(item,index) in poist" style="margin-bottom: 15px;">
              <p style="color: #000;font-size: 13px">{{item.node_name}}</p>
              <Checkbox v-for="(items,indexs) in item.son" :key="indexs" :label="items.node_id+','+items.node_pid">
                {{items.node_name}}
              </Checkbox>
            </div>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
  </Layout>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        state:0,
        role_id:'',
        formValidate: {
          name: '',
          gender: '',
          desc: '',
          interest: [],
        },
        poist: [],
        ruleValidate: {
          name: [
            {required: true, message: 'The name cannot be empty', trigger: 'blur'}
          ],
          gender: [
            {required: true, message: 'Please select gender', trigger: 'change'}
          ],
          desc: [
            {required: true, message: 'The name cannot be empty', trigger: 'blur'}
          ],
          interest: [
            {required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change'},
            // {type: 'array', max: 1, message: 'Choose two hobbies at best', trigger: 'change'}
          ]
        },
        modal1: false,
        pag: 1,
        loading2: true,
        loading1: true,
        total: 0,
        columns1: [
          {
            title: 'ID',
            key: 'role_id'
          },
          {
            title: '职位名称',
            key: 'role_name'
          },
          {
            title: '角色状态',
            key: 'role_isshow',
            render: (h, params) => {
              if (params.row.role_isshow === 0) {
                return h('div', [
                  h('p', {}, '启用'),
                ]);
              } else {
                return h('div', [
                  h('p', {}, '禁用'),
                ]);
              }


            }
          },
          {
            title: '权限描述',
            key: 'role_desc'
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
                      v.state=1;
                      v.role_id=params.row.role_id
                      v.Axios.post('/index.php/admin/role/update1 ', v.Qs.stringify({
                        role_id: params.row.role_id
                      })).then((res, req) => {
                        let arr = res.data.data;
                        v.formValidate.interest=[];
                        for (let i = 0; i < arr.length; i++) {
                          v.formValidate.interest.push(String(arr[i].node_id + ',' + arr[i].node_pid))
                        }
                        v.formValidate.name = params.row.role_name;
                        v.formValidate.gender = String(params.row.role_isshow);
                        v.formValidate.desc = params.row.role_desc;
                        v.modal1 = true

                      });
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
                      v.Axios.post('/index.php/admin/role/del', v.Qs.stringify({
                        role_id: params.row.role_id
                      })).then((res, req) => {
                        if (res.data.error === 0) {
                          v.positList();
                          v.$refs['formValidate'].resetFields();
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

      //显示弹窗
      shoale() {

        this.state=0;
        this.modal1 = true;
        this.loading1 = true
      },

      //添加职位
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let v = this;
            console.log(v.formValidate.interest)
            let arr = String(v.formValidate.interest).split(',');
            let sptArr = [];
            for (let i = 0; i < arr.length; i++) {
              if (sptArr.indexOf(arr[i]) === -1) {
                sptArr.push(arr[i])
              }
            }
            // if(v.state===0){
              v.Axios.post('/index.php/admin/role/add', v.Qs.stringify({
                role_id:v.state===0?'':v.role_id,
                role_name: v.formValidate.name,
                role_isshow: v.formValidate.gender,
                role_desc: v.formValidate.desc,
                node_id: String(sptArr)
              })).then((res, req) => {
                if (res.data.error === 0) {
                  v.modal1 = false;
                  v.positList();
                  v.$refs['formValidate'].resetFields();
                } else {
                  v.$Message.error(res.data.errMsg)
                }

                v.$refs['formValidate'].resetFields();
              });
            // }else {
            //   v.Axios.post('/api/index.php/admin/role/add', v.Qs.stringify({
            //     role_id:,
            //     role_name: v.formValidate.name,
            //     role_isshow: v.formValidate.gender,
            //     role_desc: v.formValidate.desc,
            //     node_id: String(sptArr)
            //   })).then((res, req) => {
            //     if (res.data.error === 0) {
            //       v.modal1 = false;
            //       v.positList();
            //     } else {
            //       v.$Message.error(res.data.errMsg)
            //     }
            //     v.formValidate.interest=[]
            //     v.$refs['formValidate'].resetFields();
            //   });
            // }
          } else {
            this.$Message.error('Fail!');
            this.loading1 = false
          }
        })
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

      //职位列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/role/index', v.Qs.stringify({
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

        this.$refs['formValidate'].resetFields();
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
