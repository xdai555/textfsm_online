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
  <div style="display: inline;margin-right: 10px;"><i class="el-icon-info"></i></div>
</el-tooltip>

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
  <el-button size="small" type="info" plain @click="horizontal = !horizontal">切换显示方向</el-button>
  <el-input-number v-model="fontSize" :min="12" :max="50" size="small"></el-input-number>
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
  Copyright © <a href="https://github.com/xdai555/" target="_blank">@xdai555</a>
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
  methods: {
    textFSMParser () {
      // 这里上线的时候需要改一下，防止跨域问题
      axios.post('/api/parser', {
      // axios.post('http://api.xdai.vip:9999/api/parser', {
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
      axios.get('/api/getSourceList')
      // axios.get('http://api.xdai.vip:9999/api/getSourceList')
        .then(response => {
          this.source_options = response.data.data.source_list
        })
        .catch((error) => {
          console.log('Loding source failed: ', error)
        })
    },
    getPlatformList () {
      const source = this.source_value
      axios.get('/api/getPlatformList', {
      // axios.get('http://api.xdai.vip:9999/api/getPlatformList', {
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
      axios.get('/api/getTemplateList', {
      // axios.get('http://api.xdai.vip:9999/api/getTemplateList', {
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
      axios.get('/api/loadTemplate', {
      // axios.get('http://api.xdai.vip:9999/api/loadTemplate', {
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
