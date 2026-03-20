# SafeKeyboard 安全键盘

用于密码输入等需要防止键盘记录的安全场景，提供全键盘和数字键盘两种模式，支持键位随机化。

### 基础用法

:::demo 基础的安全键盘使用方法，点击按钮打开全键盘。通过 `ref` 调用 `show()`/`hide()`/`toggle()` 方法控制显示。可以传入触发元素作为参数来定位键盘位置。
```vue
<template>
  <div class="md-demo-safe-keyboard">
    <sp-button type="primary" @click="showKeyboard1($event.currentTarget)">打开全键盘</sp-button>
    <span style="margin-left: 20px;">输入值：{{ password }}</span>
    <sp-safe-keyboard
      ref="keyboard1"
      v-model="password"
      :maxlength="20"
      @enter="handleEnter"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      password: ''
    }
  },
  methods: {
    showKeyboard1(triggerEl) {
      this.$refs.keyboard1.toggle(triggerEl)
    },
    handleEnter(value) {
      this.$sparta.success('输入完成：' + value)
    }
  }
}
</script>
```
:::

### 数字键盘

:::demo 设置 `type="number"` 使用纯数字键盘，适用于验证码、支付密码等场景。
```vue
<template>
  <div class="md-demo-safe-keyboard">
    <sp-button @click="showKeyboard2($event.currentTarget)">打开数字键盘</sp-button>
    <span style="margin-left: 20px;">输入值：{{ code }}</span>
    <sp-safe-keyboard
      ref="keyboard2"
      v-model="code"
      type="number"
      title="数字键盘"
      :maxlength="6"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      code: ''
    }
  },
  methods: {
    showKeyboard2(triggerEl) {
      this.$refs.keyboard2.toggle(triggerEl)
    }
  }
}
</script>
```
:::

### 禁用键位随机

:::demo 设置 `shuffle` 为 `false` 可以禁用键位随机化功能，此时键位保持固定顺序。多次点击按钮可以看到键位始终不变。
```vue
<template>
  <div class="md-demo-safe-keyboard">
    <sp-button @click="showKeyboard3($event.currentTarget)">打开固定键位键盘</sp-button>
    <span style="margin-left: 20px;">输入值：{{ fixedValue }}</span>
    <sp-safe-keyboard
      ref="keyboard3"
      v-model="fixedValue"
      type="number"
      :shuffle="false"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      fixedValue: ''
    }
  },
  methods: {
    showKeyboard3(triggerEl) {
      this.$refs.keyboard3.toggle(triggerEl)
    }
  }
}
</script>
```
:::

### 自定义标题

:::demo 通过 `title` 属性可以自定义键盘标题。
```vue
<template>
  <div class="md-demo-safe-keyboard">
    <sp-button @click="showKeyboard4($event.currentTarget)">打开自定义标题键盘</sp-button>
    <span style="margin-left: 20px;">输入值：{{ customValue }}</span>
    <sp-safe-keyboard
      ref="keyboard4"
      v-model="customValue"
      title="请输入支付密码"
      type="number"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      customValue: ''
    }
  },
  methods: {
    showKeyboard4(triggerEl) {
      this.$refs.keyboard4.toggle(triggerEl)
    }
  }
}
</script>
```
:::

### Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| value / v-model | 绑定值 | string | — | '' |
| type | 键盘类型 | string | text / number | text |
| maxlength | 最大输入长度 | number | — | Infinity |
| disabled | 是否禁用 | boolean | — | false |
| title | 键盘标题 | string | — | '网易支付·安全键盘' |
| shuffle | 是否每次显示时随机打乱键位 | boolean | — | true |
| target | 定位目标元素，用于计算键盘位置 | HTMLElement | — | null |
| scroll-bind-elem | 滚动绑定元素，用于监听滚动事件更新位置。可以是 CSS 选择器或 HTMLElement。如不指定，会自动查找目标元素的滚动容器 | string / HTMLElement | — | null |
| placement | 键盘出现位置 | string | top / top-start / top-end / bottom / bottom-start / bottom-end / left / right | bottom-start |
| offset | 键盘与目标元素的偏移量（水平方向） | number | — | 0 |
| append-to-body | 是否将键盘插入到 body | boolean | — | true |

### Events

| 事件名称 | 说明 | 回调参数 |
|----------|------|----------|
| input | 输入值变化时触发 | value: string |
| change | 输入值变化时触发 | value: string |
| enter | 点击确定键时触发 | value: string |
| show | 键盘显示时触发 | — |
| hide | 键盘隐藏时触发 | — |
| close | 点击关闭按钮时触发 | — |

### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| show | 显示键盘 | triggerEl: HTMLElement (可选，定位目标元素) |
| hide | 隐藏键盘 | — |
| toggle | 切换键盘显示状态 | triggerEl: HTMLElement (可选，定位目标元素) |

<script>
  export default {
    data() {
      return {
        password: '',
        code: '',
        fixedValue: '',
        customValue: ''
      }
    },
    methods: {
      showKeyboard1(triggerEl) {
        this.$refs.keyboard1.toggle(triggerEl)
      },
      showKeyboard2(triggerEl) {
        this.$refs.keyboard2.toggle(triggerEl)
      },
      showKeyboard3(triggerEl) {
        this.$refs.keyboard3.toggle(triggerEl)
      },
      showKeyboard4(triggerEl) {
        this.$refs.keyboard4.toggle(triggerEl)
      },
      handleEnter(value) {
        this.$sparta.success('输入完成：' + value)
      }
    }
  }
</script>

<style>
  .components--main {
    .md-demo-safe-keyboard {
      margin-bottom: 20px;
    }
  }
</style>