import {
  createVue,
  destroyVM,
  waitImmediate,
  bootstrap
} from '../../../util'

bootstrap('epay')

describe('SafeKeyboard', () => {
  let vm
  afterEach(() => {
    destroyVM(vm)
    // 清理可能遗留在 body 中的键盘元素
    const keyboards = document.querySelectorAll('.sp-safe-keyboard')
    keyboards.forEach(el => el.parentNode && el.parentNode.removeChild(el))
  })

  describe('create', () => {
    it('should create text keyboard by default', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      // 组件使用 appendToBody，所以从 keyboard.$el 查找
      expect(keyboard.$el.classList.contains('sp-safe-keyboard')).to.be.true
      expect(keyboard.$el.classList.contains('sp-safe-keyboard--text')).to.be.true
    })

    it('should create number keyboard when type is number', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="number" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      expect(keyboard.$el.classList.contains('sp-safe-keyboard--number')).to.be.true
    })

    it('should render correct title', async () => {
      const title = '测试标题'
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" :title="title" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            title,
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      expect(keyboard.$el.querySelector('.sp-safe-keyboard__title span').textContent).to.equal(title)
    })
  })

  describe('visibility', () => {
    it('should show keyboard when calling show()', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      expect(keyboard.visible).to.be.false

      keyboard.show()
      await waitImmediate()

      expect(keyboard.visible).to.be.true
    })

    it('should hide keyboard when calling hide()', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()
      expect(keyboard.visible).to.be.true

      keyboard.hide()
      await waitImmediate()
      expect(keyboard.visible).to.be.false
    })

    it('should toggle keyboard visibility', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      expect(keyboard.visible).to.be.false

      keyboard.toggle()
      await waitImmediate()
      expect(keyboard.visible).to.be.true

      keyboard.toggle()
      await waitImmediate()
      expect(keyboard.visible).to.be.false
    })

    it('should not show when disabled', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" disabled v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      expect(keyboard.visible).to.be.false
    })
  })

  describe('input', () => {
    it('should input character when clicking a key', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="number" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      // 从 keyboard.$el 查找按键
      const charKey = keyboard.$el.querySelector('.sp-safe-keyboard__key--char')
      charKey.click()
      await waitImmediate()

      expect(vm.value.length).to.equal(1)
    })

    it('should delete character when clicking backspace', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="number" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: '123'
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      const backspaceKey = keyboard.$el.querySelector('.sp-safe-keyboard__key--backspace')
      backspaceKey.click()
      await waitImmediate()

      expect(vm.value).to.equal('12')
    })

    it('should respect maxlength', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="number" :maxlength="3" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: '12'
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      const charKeys = keyboard.$el.querySelectorAll('.sp-safe-keyboard__key--char')
      charKeys[0].click()
      await waitImmediate()
      charKeys[1].click()
      await waitImmediate()

      expect(vm.value.length).to.equal(3)
    })

    it('should input space when clicking space key', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="text" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: 'test'
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      const keys = keyboard.$el.querySelectorAll('.sp-safe-keyboard__key')
      let spaceKey = null
      keys.forEach(key => {
        if (key.textContent.trim() === '空格') {
          spaceKey = key
        }
      })
      if (spaceKey) {
        spaceKey.click()
        await waitImmediate()
        expect(vm.value).to.equal('test ')
      }
    })
  })

  describe('shift', () => {
    it('should toggle shift state when clicking shift key', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="text" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      expect(keyboard.isShifted).to.be.false

      keyboard.show()
      await waitImmediate()

      const keys = keyboard.$el.querySelectorAll('.sp-safe-keyboard__key')
      let shiftKey = null
      keys.forEach(key => {
        if (key.querySelector('.sp-safe-keyboard__shift-text')) {
          shiftKey = key
        }
      })
      if (shiftKey) {
        shiftKey.click()
        await waitImmediate()
        expect(keyboard.isShifted).to.be.true

        shiftKey.click()
        await waitImmediate()
        expect(keyboard.isShifted).to.be.false
      }
    })
  })

  describe('events', () => {
    it('should emit show event when keyboard opens', async () => {
      const showSpy = sinon.spy()
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" v-model="value" @show="onShow"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        },
        methods: {
          onShow: showSpy
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      expect(showSpy.called).to.be.true
    })

    it('should emit hide event when keyboard closes', async () => {
      const hideSpy = sinon.spy()
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" v-model="value" @hide="onHide"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        },
        methods: {
          onHide: hideSpy
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()
      keyboard.hide()
      await waitImmediate()

      expect(hideSpy.called).to.be.true
    })

    it('should emit enter event when clicking enter key', async () => {
      const enterSpy = sinon.spy()
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="number" v-model="value" @enter="onEnter"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: '123'
          }
        },
        methods: {
          onEnter: enterSpy
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      const enterKey = keyboard.$el.querySelector('.sp-safe-keyboard__key--enter')
      enterKey.click()
      await waitImmediate()

      expect(enterSpy.called).to.be.true
      expect(enterSpy.calledWith('123')).to.be.true
    })

    it('should emit close event when clicking close button', async () => {
      const closeSpy = sinon.spy()
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" v-model="value" @close="onClose"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        },
        methods: {
          onClose: closeSpy
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      const closeBtn = keyboard.$el.querySelector('.sp-safe-keyboard__close')
      closeBtn.click()
      await waitImmediate()

      expect(closeSpy.called).to.be.true
      expect(keyboard.visible).to.be.false
    })

    it('should emit input and change events when inputting', async () => {
      const inputSpy = sinon.spy()
      const changeSpy = sinon.spy()
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="number" v-model="value" @input="onInput" @change="onChange"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        },
        methods: {
          onInput: inputSpy,
          onChange: changeSpy
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      const charKey = keyboard.$el.querySelector('.sp-safe-keyboard__key--char')
      charKey.click()
      await waitImmediate()

      expect(inputSpy.called).to.be.true
      expect(changeSpy.called).to.be.true
    })
  })

  describe('shuffle', () => {
    it('should shuffle keys when shuffle prop is true', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="number" :shuffle="true" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard

      keyboard.show()
      await waitImmediate()
      const firstKeys = []
      keyboard.$el.querySelectorAll('.sp-safe-keyboard__key--char').forEach(key => {
        firstKeys.push(key.textContent.trim())
      })
      keyboard.hide()
      await waitImmediate()

      let hasDifferent = false
      for (let i = 0; i < 10; i++) {
        keyboard.show()
        await waitImmediate()
        const currentKeys = []
        keyboard.$el.querySelectorAll('.sp-safe-keyboard__key--char').forEach(key => {
          currentKeys.push(key.textContent.trim())
        })

        if (currentKeys.join('') !== firstKeys.join('')) {
          hasDifferent = true
          break
        }
        keyboard.hide()
        await waitImmediate()
      }

      expect(hasDifferent).to.be.true
    })

    it('should not shuffle keys when shuffle prop is false', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="number" :shuffle="false" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard

      keyboard.show()
      await waitImmediate()
      const firstKeys = []
      keyboard.$el.querySelectorAll('.sp-safe-keyboard__key--char').forEach(key => {
        firstKeys.push(key.textContent.trim())
      })
      keyboard.hide()
      await waitImmediate()

      keyboard.show()
      await waitImmediate()
      const secondKeys = []
      keyboard.$el.querySelectorAll('.sp-safe-keyboard__key--char').forEach(key => {
        secondKeys.push(key.textContent.trim())
      })

      expect(secondKeys.join('')).to.equal(firstKeys.join(''))
    })
  })

  describe('position', () => {
    it('should position keyboard using vue-popper mixin', async () => {
      vm = createVue({
        template: `
          <div>
            <button ref="btn" style="margin: 100px;">触发按钮</button>
            <sp-safe-keyboard ref="keyboard" v-model="value"></sp-safe-keyboard>
          </div>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      await waitImmediate()
      const keyboard = vm.$refs.keyboard
      // 通过 show 方法传入 target 元素
      keyboard.show(vm.$refs.btn)
      await waitImmediate()

      // 验证 vue-popper mixin 的 referenceElm 和 popperElm 已设置
      expect(keyboard.referenceElm).to.equal(vm.$refs.btn)
      expect(keyboard.popperElm).to.equal(keyboard.$el)
      // 验证 currentPlacement 默认为 bottom-start（左对齐）
      expect(keyboard.currentPlacement).to.equal('bottom-start')
    })

    it('should accept triggerEl parameter in show method', async () => {
      vm = createVue({
        template: `
          <div>
            <button ref="btn" style="margin: 100px;" @click="showKeyboard($event.currentTarget)">触发按钮</button>
            <sp-safe-keyboard ref="keyboard" v-model="value"></sp-safe-keyboard>
          </div>
        `,
        data() {
          return {
            value: ''
          }
        },
        methods: {
          showKeyboard(el) {
            this.$refs.keyboard.show(el)
          }
        }
      }, true)

      await waitImmediate()

      vm.$refs.btn.click()
      await waitImmediate()

      const keyboard = vm.$refs.keyboard
      expect(keyboard.visible).to.be.true
      expect(keyboard.triggerElement).to.equal(vm.$refs.btn)
    })

    it('should set scrollBindElem via popperScrollBindElem', async () => {
      vm = createVue({
        template: `
          <div>
            <div id="scrollContainer" style="height: 200px; overflow: auto;">
              <button ref="btn">触发按钮</button>
            </div>
            <sp-safe-keyboard 
              ref="keyboard" 
              v-model="value"
              scroll-bind-elem="#scrollContainer"
            ></sp-safe-keyboard>
          </div>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      await waitImmediate()
      const keyboard = vm.$refs.keyboard
      
      // 验证 scrollBindElem 已传递给 popperScrollBindElem
      expect(keyboard.popperScrollBindElem).to.equal('#scrollContainer')
    })
  })

  describe('number keyboard layout', () => {
    it('should have enter key spanning 3 rows', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="number" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      const enterKey = keyboard.$el.querySelector('.sp-safe-keyboard__key--enter')
      expect(enterKey.getAttribute('rowspan')).to.equal('3')
    })

    it('should have backspace key spanning 2 columns', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="number" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      const backspaceKey = keyboard.$el.querySelector('.sp-safe-keyboard__key--backspace')
      expect(backspaceKey.getAttribute('colspan')).to.equal('2')
    })
  })

  describe('text keyboard layout', () => {
    it('should have enter key spanning 2 rows and 4 columns', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="text" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      const enterKey = keyboard.$el.querySelector('.sp-safe-keyboard__key--enter')
      expect(enterKey.getAttribute('rowspan')).to.equal('2')
      expect(enterKey.getAttribute('colspan')).to.equal('4')
    })

    it('should have backspace key spanning 3 columns', async () => {
      vm = createVue({
        template: `
          <sp-safe-keyboard ref="keyboard" type="text" v-model="value"></sp-safe-keyboard>
        `,
        data() {
          return {
            value: ''
          }
        }
      }, true)

      const keyboard = vm.$refs.keyboard
      keyboard.show()
      await waitImmediate()

      const backspaceKey = keyboard.$el.querySelector('.sp-safe-keyboard__key--backspace')
      expect(backspaceKey.getAttribute('colspan')).to.equal('3')
    })
  })
})