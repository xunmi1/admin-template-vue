(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Login"],{"0866":function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("header",{staticClass:"header v-center"},[e.$app.logoPath?e._m(0):e._e(),r("h1",{staticClass:"header-title v-to-zero"},[e._v(e._s(e.title))])]),r("main",[r("AForm",{staticClass:"login-form",attrs:{form:e.loginForm},on:{submit:function(t){return t.preventDefault(),e.login(t)}}},[r("AFormItem",[r("AInput",{directives:[{name:"decorator",rawName:"v-decorator",value:e.getRules("username"),expression:"getRules('username')"}],attrs:{placeholder:"用户名:",size:"large"},on:{pressEnter:function(t){return t.preventDefault(),e.setPasswordFocus(!0)},focus:function(t){return e.setPasswordFocus(!1)}}},[r("AIcon",{staticClass:"login-form-icon",attrs:{slot:"prefix",type:"user"},slot:"prefix"})],1)],1),r("AFormItem",[r("AInput",{directives:[{name:"decorator",rawName:"v-decorator",value:e.getRules("password"),expression:"getRules('password')"},{name:"focus",rawName:"v-focus",value:e.passwordFocus,expression:"passwordFocus"}],attrs:{type:"password",size:"large",placeholder:"密码:"}},[r("AIcon",{staticClass:"login-form-icon",attrs:{slot:"prefix",type:"lock"},slot:"prefix"})],1)],1),r("AFormItem",[r("ACheckbox",{directives:[{name:"decorator",rawName:"v-decorator",value:e.getRules("remember"),expression:"getRules('remember')"}]},[e._v("自动登录")]),r("a",{staticClass:"login-form-forgot",attrs:{href:""}},[e._v("忘记密码")]),r("AButton",{attrs:{loading:e.loading,size:"large",type:"primary","html-type":"submit",block:""}},[e._v("登录")])],1)],1)],1)])},s=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("img",{staticClass:"header-logo",attrs:{src:e.publicPath+e.$app.logoPath,alt:"logo",height:"46"}})}],o=(r("7db0"),r("d3b7"),r("25f0"),r("498a"),r("5530")),i=r("2f62"),n=r("ba41"),l=r("fd4e"),u={name:"Login",directives:{focus:function(e,t){var r=t.value;if(r){var a=Array.prototype.find,s=a.call(e.childNodes,(function(e){return"input"===e.localName}));s&&s.focus()}}},data:function(){return{title:this.$app.title.main,publicPath:"",loading:!1,passwordFocus:!1}},beforeCreate:function(){this.loginForm=this.$form.createForm(this)},created:function(){this.login=Object(l["d"])(this.login,360),this.setRules()},methods:Object(o["a"])(Object(o["a"])({},Object(i["b"])("user",["handleLogin"])),{},{login:function(){var e=this;this.loginForm.validateFieldsAndScroll((function(t,r){t||(e.loading=!0,e.clearDB(),e.handleLogin(r).then((function(){e.$router.push({name:e.$app.mainName}),e.loading=!1})).catch((function(t){e.loading=!1,e.$message.error(t.msg)})))}))},setRules:function(){this.rulesForm={username:{initialValue:"admin",validateFirst:!0,normalize:function(e){return e?e.toString().trim():null},rules:[{required:!0,whitespace:!0,message:"请输入你的用户名!"},{min:4,message:"不少于4个字符"},{max:30,message:"不超过30个字符"},{validator:this.validateToPassword}]},password:{initialValue:"admin-template",validateFirst:!0,normalize:function(e){return e?e.toString().trim():null},rules:[{required:!0,whitespace:!0,message:"请输入你的密码!"},{min:5,message:"不少于5个字符"},{max:45,message:"不超过45个字符"},{validator:this.compareToUsername}]},remember:{valuePropName:"checked",initialValue:!0}}},getRules:function(e){return[e,this.rulesForm[e]]},setPasswordFocus:function(e){this.passwordFocus=e},compareToUsername:function(e,t,r){if(t===this.loginForm.getFieldValue("username"))return r(new Error("密码不能和用户名重复"));r()},validateToPassword:function(e,t,r){t&&this.loginForm.getFieldValue("password")&&this.loginForm.validateFields(["password"],{force:!0}),r()},clearDB:function(e){this.isClearDB||n["b"].get(n["a"].USER_INFO,{}).username===e||(n["b"].clear(),this.isClearDB=!0)}})},c=u,m=(r("7058"),r("2877")),d=Object(m["a"])(c,a,s,!1,null,"79056ee0",null);t["default"]=d.exports},"498a":function(e,t,r){"use strict";var a=r("23e7"),s=r("58a8").trim,o=r("c8d2");a({target:"String",proto:!0,forced:o("trim")},{trim:function(){return s(this)}})},7058:function(e,t,r){"use strict";var a=r("c8eb"),s=r.n(a);s.a},"7db0":function(e,t,r){"use strict";var a=r("23e7"),s=r("b727").find,o=r("44d2"),i=r("ae40"),n="find",l=!0,u=i(n);n in[]&&Array(1)[n]((function(){l=!1})),a({target:"Array",proto:!0,forced:l||!u},{find:function(e){return s(this,e,arguments.length>1?arguments[1]:void 0)}}),o(n)},c8d2:function(e,t,r){var a=r("d039"),s=r("5899"),o="​᠎";e.exports=function(e){return a((function(){return!!s[e]()||o[e]()!=o||s[e].name!==e}))}},c8eb:function(e,t,r){}}]);