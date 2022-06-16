<template>
  <div id="app">
    <h1 class="title">QMK RGB Matrix Calculator</h1>
    <div class="controller">
      <el-dropdown @command="load">
        <el-button type="primary">
          Presets<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(preset, name) in presets"
            :key="name"
            :command="name"
            type="primary"
          >
            {{ name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button @click="add(0)">Add key</el-button>
      <el-button @click="addBatch(10)">Add 10 keys</el-button>
      <el-button @click="remove" :disabled="highlighted === -1">Remove key</el-button>
      <el-input v-model="cols">
        <template slot="append">COLS</template>
      </el-input>
      <el-input v-model="rows">
        <template slot="append">ROWS</template>
      </el-input>
      <el-button type="primary" @click="calculate">Calculate</el-button>
    </div>
    <div
      class="editor"
      :style="{ width: `${cols * oneU}px`, height: `${rows * oneU}px`, backgroundSize: `${oneU}px ${oneU}px` }"
    >
      <VueDragResize
        v-for="(rect, i) in rects"
        :key="rect.key"
        :class="['keycap', { active: highlighted === i }]"
        :isActive="highlighted === i"
        :w="rect.width * oneU"
        :h="rect.height * oneU"
        :x="rect.left * oneU"
        :y="rect.top * oneU"
        :z="rect.zIndex"
        :snapToGrid="true"
        :gridX="quarterU"
        :gridY="quarterU"
        :minw="quarterU"
        :minh="oneU"
        @resizing="update"
        @dragstop="update"
        @clicked="activate(i)"
        :parentLimitation="true"
      >
        <span class="tag">{{ i + 1 }}</span>
        <div class="info">{{ rect.width }}/{{ rect.height }}</div>
        <div class="info label">{{ rect.label }}</div>
      </VueDragResize>
    </div>
    <el-dialog
      title="LED Index to Physical Position"
      :visible.sync="outputDialog"
      :close-on-click-modal="false"
      width="50%"
    >
      <pre class="output">{{ output }}</pre>
      <span slot="footer">
        <el-button type="primary" @click="copy">Copy</el-button>
        <el-button type="primary" @click="close">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import presets from './presets'
const unitSize = 60

export default {
  name: 'App',
  components: {
    VueDragResize,
  },
  data () {
    return {
      highlighted: -1,
      rects: [],
      cols: 1,
      rows: 1,
      presets,
      output: '',
      outputDialog: false,
    }
  },
  computed: {
    oneU () {
      return unitSize
    },
    quarterU () {
      return unitSize / 4
    },
  },
  methods: {
    generateKey (i) {
      return `${Date.now()}_${i}_${Math.random()}`
    },
    activate (i) {
      this.highlighted = i
      if (this.rects[i].zIndex < this.rects.length) {
        for (let j = 0, l = this.rects.length; j < l; j++) {
          if (this.rects[j].zIndex === this.rects.length) {
            this.rects[j].zIndex = this.rects[i].zIndex
            this.rects[i].zIndex = this.rects.length
          }
        }
      }
    },
    update(rect) {
      const { left, top, width, height } = rect
      const updated = {
        left: left / unitSize,
        top: top / unitSize,
        width: width / unitSize,
        height: height / unitSize,
      }
      Object.assign(this.rects[this.highlighted], updated)
    },
    add (x) {
      this.rects.push({
        left: x,
        top: this.rows - 1,
        width: 1,
        height: 1,
        zIndex: this.rects.length + 1,
        key: this.generateKey(this.rects.length)
      })
    },
    addBatch (n) {
      for (let i = 0; i < n; i++) {
        this.add(i)
      }
    },
    remove () {
      this.rects.splice(this.highlighted, 1)
      this.highlighted = -1
    },
    calculate () {
      const cols = +this.cols
      const rows = +this.rows
      const positions = this.rects.map(rect => {
        const x = 224 / (cols - 1) * (rect.left + rect.width / 2 - 1 / 2)
        const y =  64 / (rows - 1) * (rect.top + rect.height / 2 - 1 / 2)
        return { x: Math.round(x), y: Math.round(y) }
      })
      this.open(positions)
    },
    open (data) {
      this.output = data.map(pos => `{${pos.x},${pos.y}}`).join(', ')
      this.outputDialog = true
    },
    close () {
      this.outputDialog = false
      this.output = ''
    },
    copy () {
      this.$copyText(this.output).then(() => {
        this.$message.success('Copied to clipboard')
      }, () => {
        this.$message.error('Failed to copy, please try again')
      })
    },
    load (name) {
      const { cols, rows, rects } = presets[name]
      this.cols = cols
      this.rows = rows
      this.rects = rects.map((rect, i) => ({ ...rect, zIndex: i + 1, key: this.generateKey(i) }))
      this.highlighted = -1
      this.output = ''
      this.outputDialog = false
    },
  },
  mounted () {
    this.load('blanck')
  }
}
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
}
#app {
  padding: 0 50px;
}
.el-button {
  margin-right: 10px;
  margin-left: 0 !important;
}
.el-input {
  width: 150px;
  margin-right: 10px;
}
.editor {
  position: absolute;
  top: 140px;
  left: 50px;
  box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, .2);
  background-image: linear-gradient(rgba(0, 0, 0, .2) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 0, 0, .2) 1px, transparent 1px);
}
.keycap {
  box-shadow: inset 0 0 0 2px #2c3e50;
  background-color: #f8f8f8;
}
.keycap.active {
  box-shadow: inset 0 0 0 2px #42b883;
}
.tag {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #2c3e50;
  color: #f8f8f8;
  border-radius: 0 0 0 5px;
  padding: 3px 5px;
  font-size: 12px;
}
.info {
  font-size: 13px;
  line-height: 24px;
  padding-top: 3px;
  padding-left: 6px;
  color: #2c3e50;
}
.label {
  text-align: center;
  font-weight: 700;
  padding-right: 6px;
}
.output {
  border: 1px dotted;
  padding: 1em;
  margin: 0 1em;
  white-space: pre-wrap;
}
</style>
