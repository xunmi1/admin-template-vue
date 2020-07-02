import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const isProduction = process.env.NODE_ENV === 'production';

// directory: 说明需要检索的目录
// useSubdirectories: 是否检索子目录
// regExp: 匹配文件的正则表达式
const files = require.context('./modules', false, /\.js$/);

const modules = files.keys().reduce((values, key) => {
  const name = key.replace(/^\.\/|\.[tj]s$/g, '');
  values[name] = files(key).default;
  return values;
}, {});

const plugins = [];
if (!isProduction) {
  const logger = Vuex.createLogger({ filter: ({ type }) => type !== 'app/addAlive' });
  plugins.push(logger);
}

const store = new Vuex.Store({ strict: !isProduction, modules, plugins });

export default store;
