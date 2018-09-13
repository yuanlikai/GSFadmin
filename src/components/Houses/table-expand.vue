<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="4">
      <span class="expand-key">面积: </span>
      <span class="expand-value">{{ row.user_post_area }}m²</span>
      </Col>
      <Col span="3">
      <span class="expand-key">装修: </span>
      <span class="expand-value">{{ row.user_post_adron }}</span>
      </Col>
      <Col span="3">
      <span class="expand-key">朝向: </span>
      <span class="expand-value">{{ row.user_post_aspect }}</span>
      </Col>
      <Col span="4">
      <span class="expand-key">建筑年代: </span>
      <span class="expand-value">{{ row.user_post_year }}年</span>
      </Col>
      <Col span="3">
      <span class="expand-key">楼层: </span>
      <span class="expand-value">{{ row.user_post_floor }} / {{ row.user_post_floors }}</span>
      </Col>
      <Col span="4">
      <span class="expand-key">产权年限: </span>
      <span class="expand-value">{{ row.user_post_right }}年</span>
      </Col>
      <Col span="3">
      <span class="expand-key">状态: </span>
      <span class="expand-value">{{ row.user_post_audit===0?'已审核':'未审核' }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="24">
      <span class="expand-key">房源相册: </span>
      <img style="height: 20px;margin-right: 6px;cursor: pointer;" v-for="(item,index) in JSON.parse(row.user_pics)" :key="index" :src="item.url" @click="imgUrl(item.url)" alt="">
      </Col>
    </Row>
    <Row>
      <Col span="24">
      <span class="expand-key">详情介绍: </span>
      <span class="expand-value">{{ row.user_post_content }}</span>
      </Col>
    </Row>
    <Modal
      v-model="modal1"
      title="个人房源相册详情"
      :styles="{textAlign:'center'}"
    >
      <img :src="img" alt="" style="max-width: 100%;">
    </Modal>
  </div>
</template>
<script>
  export default {
    props: {
      row: Object
    },
    data(){
      return{
        modal1: false,
        img:''
      }
    },
    methods:{
      imgUrl(index){
        this.modal1=true;
        this.img=index
      }
    }
  };
</script>
