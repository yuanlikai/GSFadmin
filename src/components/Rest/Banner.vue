<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>轮播图管理</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <Button @click="shoale()" type="primary" style="margin-bottom: 15px">
        <Icon type="md-add"></Icon>
        添加banner
      </Button>
      <Table :loading="loading2" :columns="columns1" :data="data1" height="568" border></Table>
    </Content>
    <div style="float: left;width: 100%;text-align: center;margin-top: 25px;">
      <Page :total="total" :page-size="11" @on-change="page"/>
    </div>

    <Modal
      v-model="modal2"
      title="轮播图图片"
      :styles="{textAlign:'center'}">
      <img style="max-width: 100%;" :src="imgSrc" alt="">
    </Modal>
    <Modal
      v-model="modal1"
      title="请认真填写banner"
      :loading="loading1"
      @on-ok="handleSubmit('formValidate')"
      @on-cancel="cancel"
      :styles="{width: '420px'}">

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="选择地区" prop="city">
          <Select v-model="formValidate.city" placeholder="Select your position">
            <Option v-for="(item,index) in positLi" :key="index" :value="String(item.areaId)">{{item.areaName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="图片上传" prop="img">
          <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.url)">{{item.name}}</Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"

            action="/publics/picture/imgouter"
            :data="{location:'slideshow'}"

            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>

      </Form>
    </Modal>


    <Modal title="View Image" v-model="visible"
           :styles="{textAlign:'center'}">
      <img :src="imgName" v-if="visible" style="max-width: 100%">
    </Modal>
  </Layout>
</template>

<script type="text/ecmascript-6">
  export default {

    data() {

      const validatePassCheck = (rule, value, callback) => {
        if (this.uploadList.length !== 1) {
          callback(new Error('请选择1张图片'));
        } else {
          callback();
        }
      };
      return {
        defaultList: [],
        imgName: '',
        visible: false,
        uploadList: [],
        state: 0,
        modal2: false,
        imgSrc: '',
        banner_id: '',

        positLi: [],
        formValidate: {
          city: '',
          img: ''
        },
        poist: [],
        ruleValidate: {
          city: [
            {required: true, message: '请选择地区!', trigger: 'change'}
          ],
          img: [
            {required: true, validator: validatePassCheck, trigger: 'change'}
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
            align: 'center',
            key: 'banner_id',
            width: 50
          },
          {
            title: '图片',
            align: 'center',
            key: 'banner_url',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: 'http://img.gsfzd.com/' + params.row.banner_url,
                  },
                  style: {
                    width: '30px',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.modal2 = true;
                      this.imgSrc = 'http://img.gsfzd.com/' + params.row.banner_url
                    }
                  }
                })
              ])
            }
          },
          {
            title: '显示地区',
            align: 'center',
            render: (h, params) => {
              if (params.row.city_id === 0) {
                return ('div', [
                  h('p', '全部显示')
                ])
              } else {
                return ('div', [
                  h('p', params.row.areaName)
                ])
              }
            }
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
                      v.shoale();
                      v.state = 1;
                      v.banner_id = params.row.banner_id;
                      v.formValidate.city = String(params.row.city_id);
                      v.defaultList = [
                        {
                          'name': 'bc7521e033abdd1e92222d733590f104',
                          'url': 'http://img.gsfzd.com/' + params.row.banner_url
                        }];

                      setTimeout(function () {
                        v.uploadList = v.$refs.upload.fileList;
                      }, 0)

                    }
                  }
                }, '修改'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '是否继续删除该banner?',
                  },
                  on: {
                    'on-ok': () => {
                      let v = this;
                      v.Axios.post('/index.php/admin/banner/del', v.Qs.stringify({
                        banner_id: params.row.banner_id
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
      handleView(name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove(file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(0, 1);
      },
      handleSuccess(res, file) {
        file.url = 'http://img.gsfzd.com/' + res;
        file.name = '7eb99afb9d5f317c912f08b5212fd69a';
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
      },
      handleBeforeUpload() {
        const check = this.uploadList.length < 1;
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          });
        }
        return check;
      },

      //显示添加修改管理员弹窗
      shoale() {
        this.$refs['formValidate'].resetFields();
        this.state = 0;
        this.modal1 = true;
        this.loading1 = true;
        this.city();
      },

      //添加管理员账号列表
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let v = this;
            v.Axios.post('/index.php/admin/banner/add', v.Qs.stringify({
              banner_id: v.state === 0 ? '' : v.banner_id,
              banner_url: v.uploadList[0].response,
              city_id: v.formValidate.city
            })).then((res, req) => {
              if (res.data.error === 0) {
                v.modal1 = false;
                v.positList();
                v.$refs['formValidate'].resetFields();
                v.$refs.upload.fileList.splice(0, 1);
              } else {
                v.$Message.error(res.data.errMsg);
                v.loading1 = false
              }
            });
          } else {
            this.$Message.error('添加banner失败!');
            this.loading1 = false
          }
        })
      },

      //地区列表
      city() {
        let v = this;
        v.Axios.post('/index.php/admin/banner/city').then((res, req) => {
          if (res.data.error === 0) {
            let a = [{areaId: 0, areaName: '全部显示'}];
            v.positLi = a.concat(res.data.data);
          } else {
            v.$Message.error(res.data.errMsg)
          }
        })
      },

      //banner列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/banner/index', v.Qs.stringify({
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

        this.$refs.upload.fileList.splice(0, 1);
      },
    },
    mounted() {
      this.uploadList = this.$refs.upload.fileList;
      this.quanx();
      this.positList()
    }
  }
</script>
<style lang="less">
  .demo-upload-list {
    position:relative;
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
