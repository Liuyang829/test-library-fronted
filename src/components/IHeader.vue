<template>
  <Row class-name="Row" type="flex" justify="space-between" align="middle" class="code-row-bg">
    <Col class-name="col-left" span="8">
      <div align="left">
        <Select v-model="search_value" @on-open-change="getprojectlist" @on-change="toDetail" style="width:50%" filterable>
                <Option v-for="item in project_names" :value="item.id" :key="item.name">{{ item.name }}</Option>
        </Select>
      </div>
    </Col>
    <Col class-name="col-center" span="8">
      <div align="center">
        <Button ghost type="text" size="large" @click="backhome()">
          <h3 style="color:#2d8cf0">TeamToDo</h3>
        </Button>
      </div>
    </Col>
    <Col class-name="col-right" span="8">
      <div align="right">
        <Poptip trigger="hover" placement="bottom-end">
          <img slot="content" src="../assets/QR.jpeg">
          <Button type="text" shape="circle" custom-icon="iconfont icon-QR" size="small" @click="showQR"></Button>
        </Poptip>
        <a href="javascript:" class="btn" @click="calendar">日历</a>
        <Badge dot :count="count1" class="demo-badge">
          <Button
            type="text"
            shape="circle"
            icon="md-notifications"
            size="small"
            @click="modal1 = true"
          ></Button>
        </Badge>&nbsp;
        <Tooltip placement="bottom-end" offset=-10>
          <Button ghost type="text" size="small">
          <Avatar
          class="avatar"
          src="https://i.loli.net/2017/08/21/599a521472424.jpg"
          @click="show_personal_detail()"
        />
          </Button>
          <div slot="content">
            <h3>用户名：{{ userInfo.name }}</h3>
            <p>邮箱：{{ userInfo.email }}</p>
          </div>
        </Tooltip>

        
        <!-- <Button type="primary" shape="circle">{{userInfo.name}}</Button> -->
      </div>
    </Col>
    <Modal v-model="modal1" title="项目邀请信息">
      <li type="none">
        <h5>具体信息：</h5>
      </li>
      <Scroll>
        <li
          class="invite-item"
          v-for="(invitationitem,index) in invitationList"
          data-index="index"
          :key="index"
          type="none"
        >
          <div>
            <Card v-if="card[index]" long>
              <ul>
                <li>项目名称：{{invitationitem.project_name}}</li>
                <Divider class="div"/>
                <li>发起人：{{invitationitem.inviter}}</li>
                <Divider class="div"/>
                <div align="right">
                  <Button type="success" @click="accept(invitationitem.id,index)">接受</Button>
                  <Button type="error" @click="refuse(invitationitem.id,index)">拒绝</Button>
                </div>
              </ul>
            </Card>
          </div>
        </li>
      </Scroll>
    </Modal>
  </Row>
</template>

<script>
import qs from "qs";
export default {
  name: "IHeader",
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      modal1: false,
      count1: 0,
      count2: 0,
      card: [],
      invitationList: "",
      timer: null,
      search_value: "",
      project_names: "",
      project_id: ""
    };
  },
  created: function() {
    // this.getFamilyBase_info();
    clearInterval(this.timer);
    this.timer = null;
    this.setTimer();
    console.log("123456", "this is header");
    this.getList();
  },
  destroyed: function() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    getList() {
      this.axios
        .get("http://localhost:8090/invitations/received")
        .then(res => {
          if (res.data.code == 200) {
            this.invitationList = res.data.data;
            console.log(this.invitationList.length);
            this.count1 = 0;
            this.count1 += res.data.data.length;
            console.log(this.count1);
            this.card = [];
            var i = 0;
            for (i = 0; i < this.invitationList.length; i++) {
              this.card.push(true);
            }
            
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    setTimer() {
      if (this.timer == null) {
        this.timer = setInterval(() => {
          console.log("this is timer", "定时发生（10s)");
          this.getList();
          console.log("count1", this.count1);
        }, 10000);
      }
    },
    //接受邀请
    accept(invitation_id, index) {
      console.log("this is index", index);

      let data = {
        invitation_id: parseInt(invitation_id)
      };
      this.axios
        .post("http://localhost:8090/invitations/received", qs.stringify(data))
        .then(response => {
          console.log(response);
          if (response.data.code == 200) {
            this.$Message.success("接受成功");
            this.count1 -= 1;
            console.log("count1:", this.count1);

            this.card[index] = false;
          } else {
            this.$Message.error("接受失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //拒绝邀请
    refuse(invitation_id, index) {
        this.axios
        .delete("http://localhost:8090/invitations/received", {
          params: { invitation_id: invitation_id }
        })
        .then(response => {
          console.log(response);
          if (response.data.code == 200) {
            this.$Message.success("拒绝成功");
            this.count1 -= 1;
            console.log("count1:", this.count1);

            this.card[index] = false;
          } else {
            this.$Message.error("拒绝失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    calendar() {
      this.$router.push("calendar");
    },
    toDetail(value) {
      this.$router.push({
                path: "/projectdetail",
                query: { projectId: String(value) }
              });



      // this.axios
      //   .get("http://localhost:8090/projects/")
      //   .then(response => {
      //     console.log(response.data.data);
      //     var flag = 0;
      //     for (var i = 0; i < response.data.data.length; i++) {
      //       if (this.search_value == response.data.data[i].name) {
      //         // console.log(this.project_names[i].name);
      //         this.project_id = response.data.data[i].id;
      //         this.$router.push({
      //           path: "/projectdetail",
      //           query: { projectId: String(this.project_id) }
      //         });
      //         flag = 1;
      //         break;
      //       }
      //     }
      //     if (flag == 0) {
      //       this.$Message.error("没有找到您搜索的项目，请重新选择");
      //     }
      //     console.log("123456", this.project_id);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
    },
    filter_project(value) {
      console.log("this is value", value);
      // console.log("this is option",option);
      var option = [];
      for (var i = 0; i < this.project_names.length; i++) {
        option.push(this.project_names[i].name);
      }
      return option.indexOf(value) !== -1;
    },
    getprojectlist() {
      this.axios
        .get("http://localhost:8090/projects/")
        .then(response => {
          console.log(response.data.data);
          // for(var i=0;i<response.data.data.length;i++){
          //   this.project_names.push(response.data.data[i].name);
          // }
          this.project_names = response.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    delprojectlist() {
      this.project_names = [];
    },
    set_id(value) {
      this.set_project_id = value;
      console.log(this.set_project_id);
    },
    backhome() {
      this.$router.push("home");
    },
    show_personal_detail() {
      this.$Message.success("okkkkkkkk");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.Row {
  height: 50px;
  background: #fff;
  .col-left {
    padding: 5px;
  }

  .col-center {
    font-size: 20px;
    color: black;
  }

  .col-right {
    padding: 5px;
    font-size: 14px;
    color: gray;

    a {
      margin: 0 10px;
    }
    i {
      margin: 0 10px;
      font-size: 18px;
    }
    .avatar {
      margin: 0px 10px;
    }
  }
}
</style>
