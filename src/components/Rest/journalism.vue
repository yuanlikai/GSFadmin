<template>
  <Layout :style="{padding: '0 24px 24px'}">
    <Breadcrumb :style="{margin: '24px 0'}">
      <BreadcrumbItem>新闻管理</BreadcrumbItem>
    </Breadcrumb>

    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">

      <Button @click="shoale()" type="primary" style="margin-bottom: 15px">
        <Icon type="md-add"></Icon>
        添加新闻
      </Button>
      <Table :loading="loading2" :columns="columns1" :data="data1" height="568" border></Table>
    </Content>
    <div style="float: left;width: 100%;text-align: center;margin-top: 25px;">
      <Page :total="total" :page-size="11" @on-change="page"/>
    </div>
    <Modal
      v-model="modal1"
      title="请认真填写新闻信息"
      :loading="loading1"
      @on-ok="handleSubmit('formValidate')"
      @on-cancel="cancel"
      :styles="{width: '420px'}">

      <Modal
        v-model="modal2"
        title="活动主图"
        :styles="{textAlign:'center'}">
        <img style="max-width: 100%;" :src="imgSrc" alt="">
      </Modal>

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">

        <FormItem label="新闻标题" prop="news_headline">
          <Input v-model="formValidate.news_headline" placeholder="请填写新闻标题"></Input>
        </FormItem>

        <FormItem label="封面图片" prop="news_cover">
          <unload ref="unload1"></unload>
        </FormItem>

        <FormItem label="状态" prop="news_ishot">
          <RadioGroup v-model="formValidate.news_ishot">
            <Radio label="0">不推荐</Radio>
            <Radio label="1">推荐</Radio>
          </RadioGroup>
        </FormItem>


        <FormItem label="新闻内容" prop="news_content1">
          <Input v-model="formValidate.news_content1" type="textarea" :rows="3" placeholder="Enter something..."/>
        </FormItem>


        <FormItem label="内容图片" prop="news_content2">
          <unload ref="unload2"></unload>
        </FormItem>

        <FormItem label="新闻内容" prop="news_content3">
          <Input v-model="formValidate.news_content3" type="textarea" :rows="3" placeholder="Enter something..."/>
        </FormItem>


        <FormItem label="内容图片" prop="news_content4">
          <unload ref="unload3"></unload>
        </FormItem>

        <FormItem label="新闻内容" prop="news_content5">
          <Input v-model="formValidate.news_content5" type="textarea" :rows="3" placeholder="Enter something..."/>
        </FormItem>
      </Form>
    </Modal>

  </Layout>
</template>

<script type="text/ecmascript-6">
  import unload from '../comm/unload'

  export default {

    components: {
      unload
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (this.$refs.unload1.uploadList.length !== 1) {
          callback(new Error('请上传一张图片'));

        } else {
          callback();
        }
      };
      const validatePass1 = (rule, value, callback) => {
        if (this.$refs.unload2.uploadList.length !== 1) {
          callback(new Error('请上传一张图片'));

        } else {
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (this.$refs.unload3.uploadList.length !== 1) {
          callback(new Error('请上传一张图片'));

        } else {
          callback();
        }
      };
      return {
        state: 0,
        modal2: false,
        news_id: '',
        imgSrc: '',
        positLi: [],
        formValidate: {
          news_headline: '',
          news_cover: '',
          news_content: [],
          news_ishot: '0',
          news_content1: '',
          news_content3: '',
          news_content4: '',
        },
        poist: [],
        ruleValidate: {
          news_headline: [
            {required: true, message: '请填写活动标题', trigger: 'blur'}
          ],
          news_cover: [
            {required: true, validator: validatePass, trigger: 'change'}
          ],
          news_ishot: [
            {required: true, message: '请选择状态', trigger: 'change'}
          ],
          news_content1: [
            {required: true, message: '请填写活动内容', trigger: 'blur'}
          ],
          news_content2: [
            {required: true, validator: validatePass1, trigger: 'change'}
          ],
          news_content3: [
            {required: true, message: '请填写活动内容', trigger: 'blur'}
          ],
          news_content4: [
            {required: true, validator: validatePass2, trigger: 'change'}
          ],
          news_content5: [
            {required: true, message: '请填写活动内容', trigger: 'blur'}
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
            key: 'news_id',
            width: 50
          },
          {
            title: '发布人',
            key: 'admin_name',
          },
          {
            title: '新闻标题',
            key: 'news_headline',
          },
          {
            title: '封面图',
            align: 'center',
            key: 'news_cover',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs: {
                    src: 'http://img.gsfzd.com/' + params.row.news_cover,
                  },
                  style: {
                    width: '30px',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.modal2 = true;
                      this.imgSrc = 'http://img.gsfzd.com/' + params.row.news_cover
                    }
                  }
                })
              ])
            }
          },
          {
            title: '状态',
            align: 'center',
            key: 'news_ishot',
            render: (h, params) => {
              if (params.row.news_ishot === 0) {
                return h('div', [
                  h('p', '不推荐')
                ])
              } else {
                return h('div', [
                  h('p', '推荐')
                ])
              }
            }
          },
          {
            title: '点击量',
            align: 'center',
            key: 'news_hits'
          },
          {
            title: '开始时间',
            key: 'news_addtime',
            render: (h, params) => {
              return h('div', [
                h('p', this.timestampToTime(params.row.news_addtime))
              ])
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
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      let v = this;
                      let data=JSON.parse(params.row.news_content);
                      v.shoale();
                      v.state = 1;
                      v.news_id = params.row.news_id;
                      v.formValidate.news_headline= params.row.news_headline;
                      v.$refs.unload1.imgS(params.row.news_cover);
                      v.formValidate.news_ishot=String(params.row.news_ishot);
                      v.formValidate.news_content1=data.news_content1;
                      v.$refs.unload2.imgS(data.news_content2);
                      v.formValidate.news_content3=data.news_content3;
                      v.$refs.unload3.imgS(data.news_content4);
                      v.formValidate.news_content5=data.news_content5;
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
                      v.Axios.post('/index.php/admin/news/del', v.Qs.stringify({
                        news_id: params.row.news_id
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
            let data = JSON.stringify({
              news_content1: v.formValidate.news_content1,
              news_content2: v.$refs.unload2.uploadList[0].response,
              news_content3: v.formValidate.news_content3,
              news_content4: v.$refs.unload3.uploadList[0].response,
              news_content5: v.formValidate.news_content5,
            });
            v.Axios.post('/index.php/admin/news/add', v.Qs.stringify({
              news_id: v.state===1?v.news_id:'',
              news_headline: v.formValidate.news_headline,
              news_cover: v.$refs.unload1.uploadList[0].response,
              news_content: data,
              news_ishot: v.formValidate.news_ishot,
            })).then((res, req) => {
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
            this.$Message.error('添加新闻失败!');
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

      //新闻列表
      positList() {
        let v = this;
        v.loading2 = true;
        v.Axios.post('/index.php/admin/news/index', v.Qs.stringify({
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
  .demo-upload-list {
    position: relative;
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
