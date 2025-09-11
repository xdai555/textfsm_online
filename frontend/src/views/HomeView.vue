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
      title="广而告之——书籍推荐"
      :visible.sync="showWelcomeDialog"
      width="50%"
      :before-close="handleClose"
    >
      <div class="welcome-content">
        <div style="display: flex; gap: 20px;">
          <!-- 第一栏：Python网络运维自动化 -->
          <div style="flex: 1; border-right: 1px solid #eee; padding-right: 20px;">
            <h3 style="color: #409eff; margin-top: 0;">《Python网络运维自动化》</h3>
            <p>💪公众号 @NetDevOps加油站 九净老师出品</p>
            <p>📢网络工程师升级必读</p>
            <p>🔥十余年 NetDevOps 实战经验全公开</p>
            <p>📖历时 4 轮迭代重构</p>
            <p>🤞浓缩 40 万字手稿精华</p>
            <p>✅零基础到实战</p>
            <p>💻文/图/代码三结合</p>
            <p>
              🚀京东自营，特惠购买，赶快下单吧！
              <a href="https://item.jd.com/14933970.html" target="_blank">点击购买</a>
            </p>
          </div>
          
          <!-- 第二栏：网络工程师的AI之路 -->
          <div style="flex: 1; padding-left: 20px;">
            <h3 style="color: #67c23a; margin-top: 0;">《网络工程师的AI之路：基于大语言模型的运维实战》</h3>
            <p>🚀首部LLM网络运维实战指南，让AI从"黑科技"变成工程师的高效工具！</p>
            <p>🔧详解LangChain模块，教你集成LLM构建智能运维工具链</p>
            <p>🌐支持云端ChatGPT与本地LLaMA/DeepSeek等模型，满足不同需求</p>
            <p>📚采用RAG技术，通过外部知识库提升LLM应答准确性</p>
            <p>🛠️运用MCP策略实现多模型协作，优化复杂问题处理流程</p>
            <p>💡真实案例覆盖配置生成、日志分析等场景，提供可复现代码</p>
            <p>
              🚀京东自营，特惠购买，赶快下单吧！
              <a href="https://u.jd.com/YDwsheV" target="_blank">点击购买</a>
            </p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleClose">知道了，这就去下单</el-button>
      </span>
    </el-dialog>
    
    <!-- 分享链接弹窗 -->
    <el-dialog
      :title="shareDialogTitle"
      :visible.sync="showShareDialog"
      width="50%"
      :before-close="handleShareClose"
      :closeOnClickModal="false"
      :closeOnPressEscape="false"
    >
      <div class="share-content" v-if="!showShareOption">
        <p>以下是您的分享链接，请复制并保存</p>
        <el-input v-model="shareLink" readonly style="width: 70%;">
          <template slot="append">
            <el-button type="primary" @click="copyShareLink">复制链接</el-button>
          </template>
        </el-input>
        <pre style="margin-top: 15px;">
          创建时间 <el-tag size="small" type="success">{{ formatLocalTime(createdAt) }}</el-tag>，过期时间 <el-tag size="small" type="danger">{{ formatLocalTime(expiresAt) }}</el-tag>。
        </pre>
        <pre style="margin-top: 5px; font-size: 12px; font-style: italic; position: relative; top: 10px;">
⚠️ 当前分享链接仅用于临时存储，可访问分享链接的所有人都可查看或更新内容，请勿将链接分享给非信任用户，否则可能导致数据泄露或损坏！
        </pre>
      </div>
      
      <!-- 分享选项界面 -->
      <div class="share-option-content" v-else>
        <p>您正在查看一个分享链接，可以选择以下操作：</p>
        <div style="text-align: center; margin-top: 20px;">
          <el-button type="primary" size="small" @click="updateCurrentShare">更新当前链接</el-button>
          <el-button type="success" size="small" @click="createNewShare">创建新链接</el-button>
        </div>
        <pre style="margin-top: 5px; font-size: 14px; color: red; position: relative; top: 10px;">
更新当前链接：覆盖原有内容并更新有效期（延长7天）
创建新链接: 生成一个新的分享链接
        </pre>
      </div>
      
      <span slot="footer" class="dialog-footer" v-if="!showShareOption">
        <el-button type="primary" size="small" @click="handleShareClose">确定</el-button>
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
  <el-button size="small" type="primary" plain @click="generateShareLink">生成分享链接</el-button>
  <el-button size="small" type="success" plain @click="showWelcomeDialog = true">书籍推荐</el-button>
  <el-button size="small" type="warning" plain @click="horizontal = !horizontal">切换方向</el-button>
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
import config from '@/utils/config'
import moment from 'moment'
// import FilterableSelect from '../components/FilterableSelect.vue'

export default {
  data () {
    return {
      showWelcomeDialog: false,  // 控制弹窗显示
      showShareDialog: false,    // 控制分享弹窗显示
      showShareOption: false,    // 控制是否显示分享选项界面
      shareDialogTitle: '分享链接', // 分享弹窗标题
      shareLink: '',             // 分享链接
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
      horizontal: false,
      shareId: null,  // 当前页面的分享ID（如果从分享链接打开）
      expiresAt: null, // 分享链接过期时间
      createdAt: null,  // 分享链接创建时间
      shareData: {
        raw_text: '',
        template_text: '',
        source_value: '',
        platform_value: '',
        template_value: ''
      }  // 临时存储分享数据
    }
  },
  created () { 
    this.getSourceList();
    this.checkShareId();  // 检查是否有分享ID
  },
  mounted() {
    this.checkFirstVisit();
  },
  methods: {
    // 检查URL中是否包含分享ID
    checkShareId() {
      const urlParams = new URLSearchParams(window.location.search);
      const shareId = urlParams.get('shareId');
      if (shareId) {
        this.shareId = shareId;
        this.loadShareData(shareId);
      }
    },
    
    // 加载分享数据
    loadShareData(shareId) {
      axios.get(`${config.API_BASE_URL}/api/getShare/${shareId}`)
        .then(response => {
          if (response.data.error) {
            console.error('分享链接不存在或已过期');
            this.$message.error('分享链接不存在或已过期');
            console.error('加载分享数据失败:', response.data.error);
            return;
          }
          
          this.raw_text = response.data.raw_text || '';
          this.template_text = response.data.template_text || '';
          this.source_value = response.data.source_value || '';
          this.platform_value = response.data.platform_value || '';
          this.template_value = response.data.template_value || '';
          // 直接使用后端返回的格式化过期时间
          this.expiresAt = response.data.expires_at;
          // 处理创建时间
          this.createdAt = response.data.created_at;
          
          // 如果有platform_value，获取对应的模板列表
          if (this.platform_value && this.source_value) {
            this.getTemplateList();
          }
          
          // 触发一次解析
          this.textFSMParser();
        })
        .catch(error => {
          this.$message.error('加载分享数据出错');
          console.error('加载分享数据出错:', error);
        });
    },
    
    // 生成分享链接
    generateShareLink() {
      // 准备分享数据
      this.shareData = {
        raw_text: this.raw_text,
        template_text: this.template_text,
        source_value: this.source_value,
        platform_value: this.platform_value,
        template_value: this.template_value
      };
      
      // 如果当前页面是通过分享链接访问的，显示选择界面；否则直接创建新链接
      if (this.shareId) {
        this.shareDialogTitle = '分享选项';
        this.showShareOption = true;
        this.showShareDialog = true;
      } else {
        this.createNewShare();
      }
    },
    
    // 更新当前分享链接
    updateCurrentShare() {
      this.showShareOption = false;
      this.shareDialogTitle = '分享链接';
      
      axios.post(`${config.API_BASE_URL}/api/updateShare/${this.shareId}`, this.shareData)
        .then(response => {
          if (response.data && response.data.share_id) {
            this.shareLink = `${window.location.origin}${window.location.pathname}?shareId=${this.shareId}`;
            // 直接使用后端返回的格式化过期时间
            this.expiresAt = response.data.expires_at;
            // 处理创建时间
            this.createdAt = response.data.created_at;
          } else {
            console.error('更新分享链接失败:', response.data);
            this.$message.error('更新分享链接失败，请重试！');
            this.showShareDialog = false;
          }
        })
        .catch(error => {
          this.$message.error('更新分享链接失败，请重试！');
          console.error('更新分享链接失败:', error);
          this.showShareDialog = false;
        });
    },
    
    // 创建新的分享链接
    createNewShare() {
      this.showShareOption = false;
      this.shareDialogTitle = '分享链接';
      
      axios.post(`${config.API_BASE_URL}/api/createShare`, this.shareData)
        .then(response => {
          if (response.data && response.data.share_id) {
            const shareId = response.data.share_id;
            this.shareLink = `${window.location.origin}${window.location.pathname}?shareId=${shareId}`;
            // 直接使用后端返回的格式化过期时间
            this.expiresAt = response.data.expires_at;
            // 处理创建时间
            this.createdAt = response.data.created_at;
          } else {
            console.error('生成分享链接失败:', response.data);
            this.$message.error('生成分享链接失败，请重试！');
            this.showShareDialog = false;
            return;
          }
        })
        .catch(error => {
          this.$message.error('生成分享链接失败，请重试！');
          console.error('生成分享链接失败:', error);
          this.showShareDialog = false;
          return;
        });
    },
    
    // 复制分享链接到剪贴板
    copyShareLink() {
      navigator.clipboard.writeText(this.shareLink).then(() => {
        this.$message.success('复制成功，请手动关闭弹窗');
        console.log('复制成功:', this.shareLink);
      }).catch(() => {
        this.$message.error('复制失败，请手动复制链接');
        console.error('复制失败');
      });
    },
    
    // 关闭分享弹窗
    handleShareClose() {
      this.showShareDialog = false;
      this.showShareOption = false; // 重置分享选项状态
      this.shareDialogTitle = '分享链接'; // 重置标题
      // 不要清空shareLink，让用户还能看到链接
    },

    // 格式化为本地时间显示
    formatLocalTime(dateTimeStr) {
      if (!dateTimeStr) return '未知';
      
      // 使用moment解析时间并转换为本地时间
      const localTime = moment.utc(dateTimeStr).local();
      
      // 检查日期是否有效
      if (!localTime.isValid()) return '无效时间';
      
      // 格式化为 YYYY-MM-DD HH:MM:SS 格式
      return localTime.format('YYYY-MM-DD HH:mm:ss');
    },

    // 检查是否是第一次访问（15天过期）
    checkFirstVisit() {
      const now = new Date();
      const visitData = localStorage.getItem('visitData');
      
      if (visitData) {
        try {
          const data = JSON.parse(visitData);
          const expiry = new Date(data.expiry);
          
          if (now > expiry) {
            // 已过期，重新显示弹窗并更新过期时间
            this.showWelcomeDialog = true;
            const newExpiry = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
            localStorage.setItem('visitData', JSON.stringify({
              visited: true,
              expiry: newExpiry.toISOString()
            }));
          }
        } catch (e) {
          // 处理可能的JSON解析错误
          this.showWelcomeDialog = true;
          const expiry = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
          localStorage.setItem('visitData', JSON.stringify({
            visited: true,
            expiry: expiry.toISOString()
          }));
        }
      } else {
        // 首次访问
        this.showWelcomeDialog = true;
        const expiry = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
        localStorage.setItem('visitData', JSON.stringify({
          visited: true,
          expiry: expiry.toISOString()
        }));
      }
    },
    // 关闭弹窗
    handleClose() {
      this.showWelcomeDialog = false;
    },
    textFSMParser () {
      axios.post(`${config.API_BASE_URL}/api/parser`, {
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
      axios.get(`${config.API_BASE_URL}/api/getSourceList`)
        .then(response => {
          this.source_options = response.data.data.source_list
        })
        .catch((error) => {
          console.log('Loding source failed: ', error)
        })
    },
    getPlatformList () {
      const source = this.source_value
      axios.get(`${config.API_BASE_URL}/api/getPlatformList`, {
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
      axios.get(`${config.API_BASE_URL}/api/getTemplateList`, {
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
      axios.get(`${config.API_BASE_URL}/api/loadTemplate`, {
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