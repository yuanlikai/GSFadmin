<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
            <FormItem prop="user" style="width: 268px">
              <Input type="text" v-model="formInline.user" placeholder="Username">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password" style="width: 268px">
              <Input type="password" v-model="formInline.password" placeholder="Password">
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Button style="width: 268px" type="primary" :loading="loading" @click="handleSubmit('formInline')">
                <span v-if="!loading">Submit!</span>
                <span v-else>Loading...</span>
              </Button>
            </FormItem>
          </Form>
          <p class="login-tip">输入管理员用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        loading: false,
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [
            {required: true, message: 'Please fill in the user name', trigger: 'blur'}
          ],
          password: [
            {required: true, message: 'Please fill in the password.', trigger: 'blur'},
            {type: 'string', min: 3, message: 'The password length cannot be less than 6 bits', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        let v = this;
        v.loading = true;
        v.$refs[name].validate((valid) => {
          if (valid) {

            setTimeout(function () {
              v.Axios.post('/index.php/admin/login/login', v.Qs.stringify({
                admin_name: v.formInline.user,
                admin_pwd: v.formInline.password
              })).then((res, req) => {
                if (res.data.error === 0) {
                  window.sessionStorage.setItem('sele','1-1');
                  window.sessionStorage.setItem('user',v.formInline.user);
                  v.$Message.success(res.data.errMsg);
                  v.$router.push('Admin')
                } else {
                  v.$Message.error(res.data.errMsg)
                }
                v.loading = false;
              })
            }, 100)

          } else {
            v.$Message.error('Fail!');
            v.loading = false;
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .login {
    width: 100%;
    height: 100%;
    background-image: url('https://file.iviewui.com/admin-dist/img/login-bg.0899ffa6.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
    &-con {
      position: absolute;
      right: 160px;
      top: 50%;
      transform: translateY(-60%);
      width: 300px;
      &-header {
        font-size: 16px;
        font-weight: 300;
        text-align: center;
        padding: 30px 0;
      }
      .form-con {
        padding: 10px 0 0;
      }
      .login-tip {
        font-size: 10px;
        text-align: center;
        color: #c3c3c3;
      }
    }
  }
</style>
