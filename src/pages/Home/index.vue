<template>
  <div>
    <!-- 三级联动全局组件，三级联动已经注册为全局组件，因此不需要再进行引入 -->
    <TypeNav />
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor" />
    <Brand />
  </div>
</template>
<script>
//引入其余所有的组件
import ListContainer from "@/pages/Home/ListContainer/index.vue";
import Recommend from "@/pages/Home/Recommend/index.vue";
import Rank from "@/pages/Home/Rank/index.vue";
import Like from "@/pages/Home/Like/index.vue";
import Floor from "@/pages/Home/Floor/index.vue";
import Brand from "@/pages/Home/Brand/index.vue";
import { mapState } from "vuex";
export default {
  name: "",
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  mounted() {
    this.$store.dispatch("getFloorList");
  },
  computed: {
    ...mapState({
      floorList: (state) => state.home.floorList,
    }),
  },
};
</script>
<style scoped>
</style>