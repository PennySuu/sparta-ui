<template>
  <transition name="sp-safe-keyboard-fade">
    <div
      v-show="visible"
      class="sp-safe-keyboard"
      :class="[
        'sp-safe-keyboard--' + type,
        { 'sp-safe-keyboard--disabled': disabled },
      ]"
      @click.stop
    >
      <!-- 键盘头部 -->
      <div class="sp-safe-keyboard__head">
        <div class="sp-safe-keyboard__title">
          <i class="sp-icon-epay-logo"></i>
          <span>{{ title }}</span>
        </div>
        <div class="sp-safe-keyboard__close" @click="handleClose">
          <i class="sp-icon-close"></i>
        </div>
      </div>

      <!-- 键盘主体 -->
      <div class="sp-safe-keyboard__body">
        <table class="sp-safe-keyboard__table">
          <tbody>
            <tr
              v-for="(row, rowIndex) in currentItems"
              :key="rowIndex"
              class="sp-safe-keyboard__row"
            >
              <td
                v-for="(item, colIndex) in row"
                :key="colIndex"
                class="sp-safe-keyboard__key"
                :class="getKeyClass(item)"
                :colspan="item.col || 1"
                :rowspan="item.row || 1"
                @click="handleKeyClick(item)"
              >
                <template v-if="typeof item === 'string'">
                  {{ isShifted ? item.toUpperCase() : item }}
                </template>
                <template v-else-if="item.code === 'shift'">
                  <span class="sp-safe-keyboard__shift-text">
                    <span :class="{ 'is--active': isShifted }">大写</span>
                    <span class="sp-safe-keyboard__shift-sep">/</span>
                    <span :class="{ 'is--active': !isShifted }">小写</span>
                  </span>
                </template>
                <template v-else-if="item.code === 'backspace'">
                  <i class="sp-icon-backspace_bold"></i>
                </template>
                <template v-else>
                  {{ item.text }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </transition>
</template>

<script>
import Popper from 'sparta/common/js/mixins/vue-popper'

// 工具函数：随机打乱数组指定范围的元素
function shuffle(list, from, to) {
  const clone = list.slice(from, to + 1)
  for (let i = from; i <= to; i++) {
    list[i] = popRandom(clone)
  }
}

function popRandom(list) {
  const i = Math.floor(Math.random() * list.length)
  const item = list[i]
  list.splice(i, 1)
  return item
}

// 深拷贝数组
function deepClone(arr) {
  return arr.map((row) =>
    row.map((item) => {
      if (typeof item === 'object') {
        return { ...item }
      }
      return item
    })
  )
}

// 全键盘布局
const TEXT_KEYBOARD_ITEMS = [
  [
    '~',
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '-',
    '+',
    '|',
    { code: 'backspace', text: '退格', col: 3 },
  ],
  [
    '`',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    '_',
    '=',
    '\\',
    { code: 'space', text: '空格', col: 3 },
  ],
  [
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    '{',
    '}',
    '[',
    ']',
    { code: 'shift', text: '', col: 3 },
  ],
  [
    'a',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    ':',
    ';',
    '"',
    '\'',
    { code: 'enter', text: '确定', col: 4, row: 2 },
  ],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', '<', ',', '>', '.', '?', '/'],
]

// 数字键盘布局（5列 x 3行）
// 布局说明：
// 行1: [数字] [数字] [数字] [数字] [确定(跨3行)]
// 行2: [数字] [数字] [数字] [数字] (第5列被确定占用)
// 行3: [数字] [数字] [退格(跨2列)]
const NUMBER_KEYBOARD_ITEMS = [
  ['1', '2', '3', '4', { code: 'enter', text: '确定', row: 3 }],
  ['5', '6', '7', '8'],
  ['9', '0', { code: 'backspace', text: '退格', col: 2 }],
]

export default {
  name: 'SpSafeKeyboard',

  mixins: [Popper],

  props: {
    // 键盘类型：text-全键盘，number-数字键盘
    type: {
      type: String,
      default: 'text',
      validator(val) {
        return ['text', 'number'].includes(val)
      },
    },
    // 绑定的输入值
    value: {
      type: String,
      default: '',
    },
    // 最大输入长度
    maxlength: {
      type: Number,
      default: Infinity,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 键盘标题
    title: {
      type: String,
      default: '网易支付·安全键盘',
    },
    // 是否每次显示时随机打乱键位
    shuffle: {
      type: Boolean,
      default: true,
    },
    // 定位目标元素（用于计算键盘位置）
    target: {
      type: null, // HTMLElement
      default: null,
    },
    // 滚动绑定元素（CSS选择器或Element），用于监听滚动事件更新位置
    // 如果不指定，会自动查找目标元素的滚动容器
    scrollBindElem: {
      type: null, // String | HTMLElement
      default: null,
    },
  },

  data() {
    return {
      visible: false,
      isShifted: false,
      currentItems: [],
      triggerElement: null, // 动态触发元素，优先于 target prop
      currentPlacement: 'bottom-start', // 默认左对齐显示在目标下方
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.$emit('show')
        if (this.shuffle) {
          this.shuffleKeys()
        }
        // 设置 popper 的参考元素和弹出元素
        this.referenceElm = this.triggerElement || this.target
        this.popperElm = this.$el
        // 更新 popper 位置
        this.$nextTick(() => {
          this.updatePopper()
        })
        // 延迟添加点击外部关闭的监听，避免触发显示的点击事件被捕获
        setTimeout(() => {
          document.addEventListener('click', this.handleDocumentClick)
        }, 0)
      } else {
        this.$emit('hide')
        document.removeEventListener('click', this.handleDocumentClick)
        // 延迟销毁 popper，等待动画完成（动画时长 0.2s）
        setTimeout(() => {
          this.doDestroy(true)
        }, 200)
      }
    },
    type: {
      handler() {
        this.initItems()
      },
      immediate: true,
    },
    // 监听 scrollBindElem 变化，传递给 popper
    scrollBindElem: {
      handler(val) {
        this.popperScrollBindElem = val
      },
      immediate: true,
    },
  },

  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleDocumentClick)
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },

  methods: {
    // 初始化键位数据
    initItems() {
      const baseItems =
        this.type === 'number' ? NUMBER_KEYBOARD_ITEMS : TEXT_KEYBOARD_ITEMS
      this.currentItems = deepClone(baseItems)
    },

    // 随机打乱键位
    shuffleKeys() {
      this.initItems()
      if (this.type === 'number') {
        // 数字键盘：打乱所有数字（5列 x 3行布局）
        const codes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        // 第1行：4个数字（第5列是确定按钮）
        for (let col = 0; col < 4; col++) {
          this.currentItems[0][col] = popRandom(codes)
        }
        // 第2行：4个数字
        for (let col = 0; col < 4; col++) {
          this.currentItems[1][col] = popRandom(codes)
        }
        // 第3行：2个数字（第3列是退格按钮）
        for (let col = 0; col < 2; col++) {
          this.currentItems[2][col] = popRandom(codes)
        }
      } else {
        // 全键盘：打乱数字和字母
        const items = this.currentItems
        shuffle(items[1], 1, 10) // 数字行
        shuffle(items[2], 0, 9) // 字母第一行
        shuffle(items[3], 0, 8) // 字母第二行
        shuffle(items[4], 0, 6) // 字母第三行
      }
    },

    // 显示键盘
    // triggerEl: 可选，触发显示的元素，用于动态设置定位目标
    show(triggerEl) {
      if (this.disabled) return
      if (triggerEl) {
        this.triggerElement = triggerEl
      }
      this.visible = true
    },

    // 隐藏键盘
    hide() {
      this.visible = false
    },

    // 切换显示状态
    // triggerEl: 可选，触发显示的元素，用于动态设置定位目标
    toggle(triggerEl) {
      if (this.visible) {
        this.hide()
      } else {
        this.show(triggerEl)
      }
    },

    // 处理按键点击
    handleKeyClick(item) {
      if (this.disabled) return

      // 普通字符键
      if (typeof item === 'string') {
        const char = this.isShifted ? item.toUpperCase() : item
        this.inputChar(char)
        return
      }

      // 功能键
      const { code } = item
      switch (code) {
      case 'backspace':
        this.deleteChar()
        break
      case 'space':
        this.inputChar(' ')
        break
      case 'shift':
        this.isShifted = !this.isShifted
        break
      case 'enter':
        this.handleEnter()
        break
      }
    },

    // 输入字符
    inputChar(char) {
      const currentValue = this.value || ''
      if (currentValue.length < this.maxlength) {
        const newValue = currentValue + char
        this.$emit('input', newValue)
        this.$emit('change', newValue)
      }
    },

    // 删除字符
    deleteChar() {
      const currentValue = this.value || ''
      if (currentValue.length > 0) {
        const newValue = currentValue.slice(0, -1)
        this.$emit('input', newValue)
        this.$emit('change', newValue)
      }
    },

    // 处理确定键
    handleEnter() {
      this.$emit('enter', this.value)
      this.hide()
    },

    // 处理关闭按钮
    handleClose() {
      this.$emit('close')
      this.hide()
    },

    // 处理点击文档其他区域
    handleDocumentClick(e) {
      // 如果点击的是键盘本身，不关闭
      if (this.$el && this.$el.contains(e.target)) {
        return
      }
      // 如果点击的是目标元素或其子元素，不关闭
      if (this.target && this.target.contains(e.target)) {
        return
      }
      this.hide()
    },

    // 获取按键的 class
    getKeyClass(item) {
      if (typeof item === 'string') {
        return 'sp-safe-keyboard__key--char'
      }
      const classes = ['sp-safe-keyboard__key--command']
      if (item.col > 1) {
        classes.push(`sp-safe-keyboard__key--col-${item.col}`)
      }
      if (item.code === 'shift' && this.isShifted) {
        classes.push('is--active')
      }
      if (item.code === 'enter') {
        classes.push('sp-safe-keyboard__key--enter')
      }
      if (item.code === 'backspace') {
        classes.push('sp-safe-keyboard__key--backspace')
      }
      return classes
    },
  },
}
</script>

<style lang="scss">
@import "sparta/common/scss/base/mixin";

// 动画
.sp-safe-keyboard-fade-enter-active,
.sp-safe-keyboard-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.sp-safe-keyboard-fade-enter,
.sp-safe-keyboard-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// 主容器
.sp-safe-keyboard {
  padding: 10px 4px 4px;
  margin-top: 10px; // 与目标元素的垂直间距
  background-color: $input-background-readonly;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgb(0 0 0 / 4%);
  border: $border-width-base $border-style-base $button-info-plain-border;
  user-select: none;

  // 头部
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 4px 6px;
    padding-left: 2px;
  }

  &__title {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: $color-text-primary;

    i {
      margin-right: 6px;
      font-size: 18px;
      color: $color-primary;
    }
  }

  &__close {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    color: $color-text-tip;
    transition: color 0.15s;

    &:hover {
      color: $color-text-primary;
    }
  }

  // 键盘表格 - 使用 border-spacing 实现间距，配合负边距抵消左上间距
  &__table {
    border-collapse: separate;
    border-spacing: 4px;
  }

  &__row {
    display: table-row;
  }

  // 按键基础样式（全键盘：24x24px）
  &__key {
    width: 23px;
    height: 23px;
    min-width: 23px;
    padding: 0;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    vertical-align: middle;
    color: $color-text-primary;
    background: $color-white;
    border-radius: 4px;
    border: 1px solid $color-white;
    box-shadow: 0 0 3px 0 rgb(0 0 0 / 8%);
    cursor: pointer;
    transition: all 0.1s;

    // Hover 状态：红色边框
    &:hover {
      border-color: $border-color-base;
    }

    // Active/Click 状态：红色边框 + 浅红背景
    &:active {
      color: $color-primary;
      border-color: $color-primary;
      background-color: $background-color-base;
    }

    // 字符键
    &--char {
      font-family: "Microsoft Yahei", Arial, sans-serif;
    }

    // 功能键（退格、空格、大小写）- 宽60px
    &--command {
      width: 60px;
      min-width: 60px;
      background: $color-white;
      color: $color-text-primary;
      font-size: 12px;
      font-weight: 600;
    }

    // 确定键 - 宽88px，高52px
    &--enter {
      width: 88px;
      min-width: 88px;
      height: 52px;
      font-size: 14px;
    }

    // 退格键图标
    &--backspace {
      .sp-icon-backspace_bold {
        font-size: 19px;
      }
    }

    // Shift 大写/小写按键 - 不使用红色背景
    &.is--active {
      background: $color-white;
      border-color: $border-color-lighter;
      color: $color-text-primary;
      font-size: 12px;
    }

    // 跨列
    &--col-2 {
      min-width: 56px;
    }
    &--col-3 {
      min-width: 60px;
    }
    &--col-4 {
      min-width: 88px;
    }
  }

  // Shift 键文本 - 大写/小写
  &__shift-text {
    display: flex;
    align-items: baseline;
    justify-content: center;
    font-size: 10px;

    span {
      color: $color-text-tip;
      transition: color 0.1s;
      font-weight: 600;

      // 激活状态文字变红
      &.is--active {
        color: $color-primary;
        font-size: 12px;
      }
    }
  }

  &__shift-sep {
    margin: 0 2px;
    color: $color-text-tip;
  }

  // 数字键盘特殊样式
  &--number {
    .sp-safe-keyboard__title {
      font-size: 14px;
    }

    .sp-safe-keyboard__table {
      border-spacing: 4px;
    }

    .sp-safe-keyboard__key {
      width: 35px;
      height: 35px;
      min-width: 35px;
      padding: 0;
      font-size: 14px;
      font-weight: 600;

      // 确定按钮（跨3行）
      &--enter {
        width: 75px;
        min-width: 75px;
        font-size: 14px;
      }

      // 退格按钮（跨2列）
      &--backspace {
        width: 75px;
        min-width: 75px;
      }
    }
  }

  // 禁用状态
  &--disabled {
    .sp-safe-keyboard__key {
      cursor: not-allowed;
      opacity: 0.5;

      &:hover {
        background: $color-white;
        border-color: $border-color-lighter;
        color: $color-text-primary;
      }
    }
  }
}
</style>