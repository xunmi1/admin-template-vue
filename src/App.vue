<template>
  <div id="app">
    <ALocaleProvider :locale="locale">
      <RouterView />
    </ALocaleProvider>
  </div>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
export default {
  name: 'App',
  data() {
    return {
      locale: zh_CN,
    };
  },
};
</script>

<style lang="less">
@import './assets/style/index.less';
</style>
