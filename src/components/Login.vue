<template>
  <div class="login">
    <!-- status-icon 对错小图标-->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
      <img src="@/assets/avatar.jpg" alt>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入axios
// import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      // 表单的校验规则
      rules: {
        // 配置username的校验规则，可以有多个
        username: [
          // 必填的 trigger:blur 失去焦点的时候触发
          // trigger: change 改变的时候触发
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 重置表单功能
    reset() {
      this.$refs.form.resetFields()
    },
    async login() {
      try {
        // 等待表单校验成功
        await this.$refs.form.validate()
        // 成功 发送ajax请求
        let res = await this.axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        // console.log(res.data)
        if (res.meta.status === 200) {
          this.$message.success('登录成功')
          // 把token给存储起来
          localStorage.setItem('token', res.data.token)
          // 转到首页组件
          this.$router.push('/home')
        } else {
          this.$message.error(res.meta.msg)
        }
      } catch (e) {
        // 失败
        return false
      }
    }
  }
}
</script>

<style  lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;

  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px;
    position: relative;
    border-radius: 10px;

    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -70px;
      border-radius: 50%;
      border: 10px solid #fff;

      .el-button ~ .el-button {
        margin-left: 80px;
      }
    }
  }
}
</style>
