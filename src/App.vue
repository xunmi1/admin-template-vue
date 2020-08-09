<template>
  <div id="app">
    <AConfigProvider :locale="locale">
      <RouterView />
    </AConfigProvider>
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
      locale: Object.freeze(zh_CN),
    };
  },
};
</script>

<style lang="less">
@import './assets/style/index.less';
</style>
