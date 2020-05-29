<template>
  <ALayout class="user-layout">
    <ALayoutContent>
      <RouterView />
    </ALayoutContent>
    <Footer />
  </ALayout>
</template>

<script>
import Footer from './components/Footer';

export default {
  name: 'UserLayout',
  components: {
    Footer,
  },
};
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  background: rgb(240, 242, 245) url(../../assets/svg/background.svg) no-repeat center;
  background-size: 100% 100%;
}
</style>
