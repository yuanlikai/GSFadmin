<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>活动管理</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <Button @click="shoale()" type="primary" style="margin-bottom: 15px">
        <Icon type="md-add"></Icon>
        添加活动
      </Button>
      <Table :loading="loading2" :columns="columns1" :data="data1" height="568" border></Table>
    </Content>
    <div style="float: left;width: 100%;text-align: center;margin-top: 25px;">
      <Page :total="total" :page-size="11" @on-change="page"/>
    </div>

    <Modal
      v-model="modal2"
      title="活动主图"
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
        <FormItem label="活动标题" prop="name">
          <Input v-model="formValidate.name" placeholder="请填写活动标题"></Input>
        </FormItem>
        <FormItem label="活动位置" prop="city">
          <Select v-model="formValidate.city" placeholder="选择活动位置">
            <Option value="主页">主页</Option>
          </Select>
        </FormItem>


        <FormItem label="活动时间" prop="time">
          <DatePicker v-model="formValidate.time" placement="bottom-end" placeholder="Select date" format="yyyy/MM/dd"
                      :editable="false" type="daterange"></DatePicker>
        </FormItem>

        <FormItem label="图片上传（第1次张为主图，其余为详情）" prop="img">
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
            :data="{location:'ad'}"

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
        if (this.uploadList.length > 6) {
          callback(new Error('最多选择6张图片'));
        } else if(this.uploadList.length < 1) {
          callback(new Error('请上传图片'));
        } else {
          callback();
        }
      };
      const validateTime = (rule, value, callback) => {
        if (this.formValidate.time[0].length < 1) {
          callback(new Error('请选择日期'));
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
        ad_id: '',

        positLi: [],
        formValidate: {
          name: '',
          city: '',
          time: [],
          img: '',
        },
        poist: [],
        ruleValidate: {
          name: [
            {required: true, message: '请填写活动标题!', trigger: 'blur'}
          ],
          city: [
            {required: true, message: '请选择活动位置!', trigger: 'change'}
          ],
          time: [
            {required: true, validator: validateTime, trigger: 'change'}
          ],
          img: [
            {required: true, validator: validatePassCheck, trigger: 'change'}
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
            align: 'center',
            key: 'ad_id',
            width: 50
          },
          {
            title: '活动标题',
            align: 'center',
            key: 'ad_name',
          },
          {
            title: '活动主图',
            align: 'center',
            key: 'banner_url',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: 'http://img.gsfzd.com/' + JSON.parse(params.row.ad_pic)[0].response,
                  },
                  style: {
                    width: '30px',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.modal2 = true;
                      this.imgSrc = 'http://img.gsfzd.com/' + JSON.parse(params.row.ad_pic)[0].response
                    }
                  }
                })
              ])
            }
          },
          {
            title: '活动位置',
            align: 'center',
            key: 'ad_seat'
          },
          {
            title: '开始时间',
            align: 'center',
            key: 'ad_addtime',
            render: (h, params) => {
              return h('div', [
                h('p', this.timestampToTime(params.row.ad_addtime).split(' ')[0])
              ])
            }
          },
          {
            title: '结束时间',
            align: 'center',
            key: 'ad_endtime',
            render: (h, params) => {
              return h('div', [
                h('p', this.timestampToTime(params.row.ad_endtime).split(' ')[0])
              ])
            }
          },
          {
            title: '活动状态',
            align: 'center',
            render:(h,params)=>{
              if(params.row.ad_endtime+86400<Date.parse(new Date())/1000){
                return h('div', [
                  h('del', {
                  },'已结束')
                ])
              }else if(params.row.ad_addtime>Date.parse(new Date())/1000){
                return h('div', [
                  h('p', {
                    style:{
                      color:'#19be6b'
                    }
                  },'未开始')
                ])
              } else{
                return h('div', [
                  h('p',{
                    style:{
                      color:'#2d8cf0 '
                    }
                  }, '进行中')
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

                      v.ad_id = params.row.ad_id;
                      v.formValidate.name = params.row.ad_name;
                      v.formValidate.city = params.row.ad_seat;
                      v.defaultList = JSON.parse(params.row.ad_pic);

                      v.formValidate.time = [];
                      v.formValidate.time.push(String(v.timestampToTime(params.row.ad_addtime).split(' ')[0]))
                      v.formValidate.time.push(String(v.timestampToTime(params.row.ad_endtime).split(' ')[0]))

                      v.imgS()
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
                      v.Axios.post('/index.php/admin/ad/del', v.Qs.stringify({
                        ad_id: params.row.ad_id
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
        this.city();
      },

      //添加管理员账号列表
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let v = this;
            let star = new Date(this.formValidate.time[0]).getTime() / 1000;
            let end = new Date(this.formValidate.time[1]).getTime() / 1000;
            v.Axios.post('/index.php/admin/ad/add', v.Qs.stringify({
              ad_id: v.state === 0 ? '' : v.ad_id,
              ad_name: v.formValidate.name,
              ad_seat: v.formValidate.city,
              ad_pic: String(JSON.stringify(v.uploadList)),
              ad_addtime: star,
              ad_endtime: end,
            })).then((res, req) => {
              if (res.data.error === 0) {
                v.modal1 = false;
                v.positList();
                v.$refs['formValidate'].resetFields();
                v.$refs.upload.fileList.splice(0, 6);
              } else {
                v.$Message.error(res.data.errMsg);
                v.loading1 = false
              }
            });
          } else {
            this.$Message.error('添加活动失败!');
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
        v.Axios.post('/index.php/admin/ad/index', v.Qs.stringify({
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

      handleView(name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove(file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
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
        const check = this.uploadList.length < 6;
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          });
        }
        return check;
      },

      cancel() {
        this.$Message.info('你点击了取消');

        this.$refs.upload.fileList.splice(0, 6);
      },

      imgS() {
        let v = this;
        setTimeout(function () {
          v.uploadList = v.$refs.upload.fileList;
        }, 0)
      }
    },
    mounted() {
      this.imgS();
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
