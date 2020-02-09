<template>
  <ALayout class="container">
    <ALayoutContent>
      <RouterView />
    </ALayoutContent>
    <Footer />
  </ALayout>
</template>

<script>
import Footer from './components/Footer';
import themeMixin from './mixins/themeMixin';

export default {
  name: 'UserLayout',
  components: {
    Footer,
  },
  mixins: [themeMixin],
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: rgb(240, 242, 245) url(../../assets/svg/background.svg) no-repeat center;
  background-size: 100% 100%;
}

.container >>> .ant-layout-footer {
  background: transparent;
}
</style>
