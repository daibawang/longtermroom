<template>
  <div style="margin-top: 50px">
    <el-card class="boxcard" style="width: 40%;margin: 0 auto">
      <el-form
        :model="ruleForm2"
        status-icon
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model.number="ruleForm2.username" autocomplete></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm2.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')"
            >登录</el-button
          >
          <el-button @click="resetForm('ruleForm2')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { login } from "@/api/api.js";
import { messages } from "@/assets/js/common.js";
import { getCookie } from "@/assets/js/cookie.js";
// import { mapState } from 'vuex';
export default {
  name: "login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        username: "",
        password: ""
      },
      rules2: {
        password: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: validateName, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      // console.log(process.env.BASE_URL);
      this.$refs[formName].validate(valid => {
        if (valid) {
          login(this.ruleForm2)
            .then(res => {
              // console.log(res);
              //提交数据到vuex
              var jwt=getCookie('jwt')
              this.$store.commit("commitToken", jwt);
              this.$store.commit("commitInfo", res.user);
              if(res.user.role=='user'){
                this.$router.push({
                  path: "/403"
                });
              }
              this.$message('success',res.message)
              this.$router.push({
                path: "/"
              });
            })
            .catch(err => {
              this.$store.commit("removeToken");
              // this.$message("error", err.message);
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
// Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiYWRtaW4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTU1Nzc1MDg5MSwiZXhwIjoxNTU4MzU1NjkxfQ.wwinrjJMzejR-kk299hj9eDnETUGuUao1YnEo50EYBYkHeseCM8GGjW9n-oaW2MShrrQ_H78i14_3cJ9r5dz8g
</script>
<style lang="less" scoped></style>
