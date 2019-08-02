export class MyElement extends HTMLElement {
  static get observedAttributes() {
    return ['data']
  }

  constructor() {
    super()
    this.data = {}
    this.attachShadow({ mode: 'open' })
  }

  /** 依赖于调用方的virtual dom层是否使用setAttribute来设置节点值
   * 经过测试react与vue应该都是这么做的
   * 🔑 这里是普通dom节点是否可以接受复杂对象的关键环节
   * */
  setAttribute(name, value) {
    if (MyElement.observedAttributes.includes(name)) {
      this.data = value
      this.attributeChangedCallback()
    } else {
      super.setAttribute(name, value)
    }
  }

  /** 插入dom节点时使用preact render
   * @return void
   * */
  connectedCallback() {
    this.render()
  }

  /** 在connectedCallback之前也可能会有attribute change
   * 在render之后，才需要调用render
   * @return void
   * */
  attributeChangedCallback() {
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = Object.keys(this.data)
      .map(k => {
        return `<p>${k}: ${this.data[k]}</p>`
      })
      .join('<br />')
  }
}

const myTagName = 'my-element'

customElements.define(myTagName, MyElement)
