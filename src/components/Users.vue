<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <el-button type="success" plain>添加用户</el-button>
    <!-- 表格 -->
    <!--
      el-table: 表格组件
        data： 表示表格需要显示的数据 会根据传进去的data自动遍历

        el-table-column: 定义表格的一列
        label： 定义这一列的标题  表头
        prop：  表示这一列需要显示的数据的属性名
        width:  设置列的宽度  不能用百分比

      自定义列模版： 如果需要自己去定义表格某一列的显示效果，需要使用自定义列模板
    1. 需要使用 <template slot-scope="scope"></template> 作用域插槽
    2. 如何获取到当前列的数据 scrope.row.xxx
    -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column label="姓名" prop="username" width="200"></el-table-column>
      <el-table-column label="邮箱" prop="email" width="200"></el-table-column>
      <el-table-column label="电话" prop="mobile" width="200"></el-table-column>
      <el-table-column label="状态" prop="mg_state" width="200">
        <!-- 自定义列模版 -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            circle
            @click="delUser(scope.row.id)"
          ></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain round>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--
      分页
       size-change: 每页的条数发生了改变，会触发
       current-change: 当前页发生了改变，会触发
       current-page： 当前页
       page-size: 每页的条数
       total: 总条数
       page-sizes="[2, 4, 6, 8]： 设置修改每页条数的选项
       layout: 控制分页的布局
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
// 引入axios
// import axios from 'axios'
export default {
  data() {
    return {
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      baseUrl: 'http://localhost:8888/api/private/v1/'
    }
  },
  created() {
    this.getUserList()

    /* 发送ajax请求，获取用户列表数据
        1. 引入axios
        2. 根据接口文档发送请求

        注意1： 如果axios发送的是post put patch请求，参数写在data中
        如果是get，delete请求，参数写在 params中

        注意2： 除了登录请求，其余所有的请求都必须携带token, 设置在请求头： Authorization
   */
  },
  methods: {
    getUserList() {
      this.axios({
        methods: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        // 请求头中设置 Authorization
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users
          this.total = res.data.data.total
        }
      })
    },
    handleSizeChange(val) {
      // 修改pageSize
      this.pageSize = val
      // 重新渲染
      this.getUserList()
    },
    handleCurrentChange(val) {
      // 修改 currentPage
      this.currentPage = val
      // 重新渲染
      this.getUserList()
    },
    searchUser() {
      // 如果是搜索，应该让当前从第1页开始
      this.currentPage = 1
      this.getUserList()
    },
    delUser(id) {
      // 弹出一个确认框
      this.$confirm('你确定要删除该用户吗?', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          // 发送ajax请求
          this.axios({
            method: 'delete',
            url: `users/${id}`,
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {
            if (res.data.meta.status === 200) {
              // 如果当前就剩一条，还渲染当前，就会有问题，当前页没有数据了
              if (this.userList.length <= 1 && this.currentPage > 1) {
                this.currentPage--
              }
              this.getUserList()
              this.$message.success('删除成功')
            } else {
              this.$message.error('删除失败')
            }
          })
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
    changeState(user) {
      // 发送ajax请求
      this.axios({
        method: 'put',
        url: `users/${user.id}/state/${user.mg_state}`,
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        if (res.data.meta.status === 200) {
          console.log(res)
          this.$message.success('修改成功')
          // 重新渲染
          this.getUserList()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 40px;
  line-height: 40px;
}
.el-input {
  width: 300px;
  margin-bottom: 5px;
}
</style>
