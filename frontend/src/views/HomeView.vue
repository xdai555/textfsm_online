<template>
<el-container :class="{ darkMode: isDark}">
  <div style="padding-top: 5px;text-align:center;display: inline;">

  <!-- <span>加载已有模板：</span> -->
  <el-tooltip placement="top" effect="light">
  <div slot="content">
    ntc-templates: 由 <a href="https://github.com/networktocode/ntc-templates" target="_blank">@networktocode</a>主导的网络设备TextFSM开源模板库<br/>
    Elinpf: ntc-templates 的分支仓库，由 <a href="https://github.com/Elinpf/ntc-templates" target="_blank">@Elinpf</a>更新的国内主流厂商TextFSM模板<br/>
    <br/>
    两者在支持的模板数量、具体的模板内容上会有差异，请根据实际情况使用或者修改<br/>
  </div>
  <div style="display: inline;margin-right: 10px;"><a><i class="el-icon-info"></i></a></div>
</el-tooltip>

    <!-- 弹窗提示 -->
    <el-dialog
      title="广而告之——书籍推荐《Python网络运维自动化》"
      :visible.sync="showWelcomeDialog"
      width="40%"
      :before-close="handleClose"
    >
      <div class="welcome-content">
        <p>💪公众号 @NetDevOps加油站 九净老师出品</p>
        <p>📢网络工程师升级必读</p>
        <p>🔥十余年 NetDevOps 实战经验全公开</p>
        <p>📖历时 4 轮迭代重构</p>
        <p>🤞浓缩 40 万字手稿精华</p>
        <p>✅零基础到实战</p>
        <p>💻文/图/代码三结合</p>
        <p>❗限时福利（至2025年3月底）</p>
        <p>
          🚀京东自营 6 折特惠（全渠道最低！）
          <a href="https://item.jd.com/14933970.html" target="_blank">点击购买</a>
        </p>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleClose">知道了，这就去下单</el-button>
      </span>
    </el-dialog>
  <el-select
    style="width:15%;"
    v-model="source_value"
    filterable placeholder="选择 Source"
    @focus="getSourceList()"
    size="small"
    >
    <el-option
      v-for="item in source_options"
      :key="item"
      :label="item"
      :value="item"
    >
    </el-option>
  </el-select>

  <el-select
    style="width:15%;"
    v-model="platform_value"
    filterable placeholder="选择 Platform"
    size="small"
    @focus="getPlatformList()"
    >
    <el-option
      v-for="item in platform_options"
      :key="item"
      :label="item"
      :value="item"
    >
    </el-option>
  </el-select>
  <el-select style="width:20%;"
   v-model="template_value"
    filterable placeholder="选择 TextFSM 模板"
    @focus="getTemplateList()"
    no-data-text="请先选择 Platform"
    size="small"
    @change="loadTemplate()"
    >
    <el-option
      v-for="item in template_options"
      :key="item"
      :label="item"
      :value="item"
    >
    </el-option>
  </el-select>

<div style="display: inline;float: right;margin-right: 20px;">
  <!-- <div style="display: inline;margin-right: 10px;"> -->
  <el-tooltip placement="top" effect="light">
  <div slot="content">
    本站点支持本地部署，点击查看：<a href="https://github.com/xdai555/textfsm_online" target="_blank">GitHub</a>、<a href="https://gitee.com/xdai555/textfsm_online" target="_blank">Gitee</a><br/>
    有人知道三个文本输入窗口之间的分割条，一直以来是支持 <span style="color: red;">拖动</span> 和 <span style="color: red;">双击</span> 的吗？<br/>
  </div>
  <div style="display: inline;margin-right: 10px;"><a><i class="el-icon-info"></i></a></div>
  </el-tooltip>
  <el-button size="small" type="info" plain @click="showWelcomeDialog = true">书籍推荐</el-button>
  <el-button size="small" type="info" plain @click="horizontal = !horizontal">切换方向</el-button>
  <el-input-number v-model="fontSize" :min="12" :max="50" size="small"></el-input-number>
<!-- </div> -->
</div>

</div>
<el-main>
<splitpanes class="default-theme" style="height: 100%" :horizontal="horizontal">
<pane min-size="10">
 <el-col id="box1">
    <div class="grid-content" :style="{ fontSize: fontSize + 'px' }">
      <codemirror v-model="raw_text" placeholder="请输入原始 CLI 内容" :options="cmOptions" @input="textFSMParser()"/>
    </div>
  </el-col>
</pane>
<pane min-size="10">
  <el-col id="box2">
    <div class="grid-content" :style="{ fontSize: fontSize + 'px' }">
      <codemirror v-model="template_text" placeholder="请输入 TextFSM 模板内容" :options="cmOptions" @input="textFSMParser()"/>
    </div>
  </el-col>
</pane>
<pane min-size="10">
  <el-col id="box3">
    <div class="grid-content">
      <codemirror :style="{ fontSize: fontSize + 'px' }" placeholder="尚未匹配到结果..." :value="result" :options="cmOptions"/>
    </div>
  </el-col>
</pane>
</splitpanes>
</el-main>
<el-footer>
  <el-switch style="padding:0 10px 0 10px;" active-color="#999" inactive-color="#1e1e1e" v-model="isDark" @change="changeTheme"></el-switch>
  <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2022010024号</a>
  <a href="https://github.com/xdai555/" target="_blank">Copyright © @xdai555</a>
  | <a href="https://mp.weixin.qq.com/s/ZA_CXNL2O4zSGEpr26KV5A" target="_blank">@NetDevOps加油站：深入浅出TextFSM 终极版教程</a>
  | <a href="https://netaxe.github.io/" target="_blank">@iflytek/NetAxe：国产网络自动化领域解决方案框架</a>
  | <a href="https://support.qq.com/products/447487/" target="_blank">意见反馈</a>

</el-footer>
</el-container>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes'
import axios from 'axios'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/display/placeholder.js'
import 'codemirror/theme/idea.css'
import 'codemirror/theme/darcula.css'
import 'splitpanes/dist/splitpanes.css'
// import FilterableSelect from '../components/FilterableSelect.vue'

export default {
  data () {
    return {
      showWelcomeDialog: false, // 控制弹窗显示
      fontSize: 13,
      raw_text: '',
      template_text: '',
      result: '',
      isDark: false,
      cmOptions: {
        theme: 'idea',
        mode: 'javascript',
        lineNumbers: true,
        line: true
      },
      source_options: [],
      source_value: '',
      platform_options: [],
      platform_value: '',
      template_options: [],
      template_value: '',
      horizontal: false
    }
  },
  created () { this.getSourceList() },
  mounted() {
    this.checkFirstVisit();
  },
  methods: {
    // 检查是否是第一次访问
    checkFirstVisit() {
      const hasVisited = localStorage.getItem('hasVisited');
      if (!hasVisited) {
        this.showWelcomeDialog = true; // 显示弹窗
        localStorage.setItem('hasVisited', 'true'); // 设置标记
      }
    },
    // 关闭弹窗
    handleClose() {
      this.showWelcomeDialog = false;
    },
    textFSMParser () {
      // 这里上线的时候需要改一下，防止跨域问题
      // axios.post('/api/parser', {
      axios.post('http://api.xdai.vip:9999/api/parser', {
        raw_text: this.raw_text,
        template_text: this.template_text
      })
        .then(response => {
          this.result = this.jsonFormat(JSON.stringify(response.data))
        })
        .catch(error => {
          this.result = this.jsonFormat(JSON.stringify(error))
        })
    },
    getSourceList () {
      // axios.get('/api/getSourceList')
      axios.get('http://api.xdai.vip:9999/api/getSourceList')
        .then(response => {
          this.source_options = response.data.data.source_list
        })
        .catch((error) => {
          console.log('Loding source failed: ', error)
        })
    },
    getPlatformList () {
      const source = this.source_value
      // axios.get('/api/getPlatformList', {
      axios.get('http://api.xdai.vip:9999/api/getPlatformList', {
        params: {
          source: source
        }
      })
        .then(response => {
          this.platform_options = response.data.data.platform_list
        })
        .catch((error) => {
          console.log('Loding platform failed: ', error)
        })
    },
    getTemplateList () {
      const platform = this.platform_value
      const source = this.source_value
      // axios.get('/api/getTemplateList', {
      axios.get('http://api.xdai.vip:9999/api/getTemplateList', {
        params: {
          platform: platform,
          source: source
        }
      })
        .then(response => {
          this.template_options = response.data.data.template_list
        })
        .catch((error) => {
          console.log('Loding template failed: ', error)
        })
    },
    loadTemplate () {
      const template = this.template_value
      const source = this.source_value
      // axios.get('/api/loadTemplate', {
      axios.get('http://api.xdai.vip:9999/api/loadTemplate', {
        params: {
          template: template,
          source: source
        }
      })
        .then(response => {
          this.template_text = response.data.data.content
        })
        .catch((error) => {
          console.log('Loding template centent failed: ', error)
        })
    },
    jsonFormat (jsonStr) {
      const beautifyJS = require('js-beautify').js_beautify
      const formattedJSON = beautifyJS(jsonStr, { indent_size: 2, brace_style: 'expand' })
      return formattedJSON
    },
    changeTheme () {
      if (this.isDark === true) {
        this.cmOptions.theme = 'darcula'
      } else { this.cmOptions.theme = 'idea' }
    }
  },
  components: {
    Splitpanes, Pane
  }
}
</script>

<style>
/* 新增样式：使关闭按钮居中 */
.dialog-footer {
  display: flex;
  justify-content: center; /* 水平居中 */
}

.welcome-content {
  line-height: 1.8; /* 调整行高 */
}

.welcome-content p {
  margin: 0; /* 去除默认段落间距 */
}

.welcome-content a {
  color: #409eff; /* Element UI 主题色 */
  text-decoration: none; /* 去除下划线 */
}

.welcome-content a:hover {
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
}
  .darkMode {
    background: #1e1e1e;
  }
  .darkMode svg path {
      stroke: #999;
  }
  .darkMode a {
      color: #999;
  }
  .darkMode span {
      color: #999;
  }
  .darkMode .el-select .el-input__inner {
      background-color: #1e1e1e;
  }
  .darkMode .grid-content {
      background-color: #1e1e1e !important;
  }
  .darkMode .el-button {
      background-color: #1e1e1e !important;
  }
  .darkMode .el-input__inner {
      background-color: #1e1e1e !important;
  }
  .darkMode .el-input-number__decrease {
      background-color: #1e1e1e !important;
  }
  .darkMode .el-input-number__increase {
      background-color: #1e1e1e !important;
  }
  .darkMode .el-select > .el-scrollbar {
      background-color: #1e1e1e !important;
  }
  .darkMode .splitpanes__splitter {
    background-color: #333 !important
  }

  a {
    color: #1e1e1e;
    margin-right: 5px
  }
  svg path {
      stroke: #333;
  }
  .el-main {
    padding: 10px !important;
  }
  .el-container {
    height: 100%;
  }
  .el-footer {
    height: 23px !important;
    text-align: center;
    font-size: 85%;
    margin-bottom: 3px
  }
  .el-col {
    border-radius: 1px;
    height: 100%;
  }
  .grid-content {
    border-radius: 1px;
    height: 100%;
  }
  .CodeMirror {
      border-radius: 1px;
      /* padding-left: 2.5px;
      padding-right: 2.5px; */
      height: 99.8%; /* viewport height */
      width: calc(100%-2px)
  }
  .vue-codemirror {
    height: 100%;
  }
  .CodeMirror-scroll {
    height: 100%;
  }
  .el-select{
    margin-right: 15px;
  }
  .splitpanes--horizontal > .splitpanes__splitter {
    /* background-color: #ccc !important; */
    width: 100% !important;
    align-self: center
  }
  .splitpanes--vertical > .splitpanes__splitter {
    /* background-color: #ccc !important; */
    height: 100%;
    align-self: center
  }
  .splitpanes__splitter:hover {
      background-color: #999 !important;
    }
  .splitpanes__pane {
    display: block;
  }

</style>
