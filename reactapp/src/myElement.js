import { transformToReact } from './transform'

class MyElementClass extends HTMLElement {
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
  setAttribute(name: string, value: any) {
    if (MyElementClass.observedAttributes.includes(name)) {
      this.data = value
      this.attributeChangedCallback()
    } else {
      super.setAttribute(name, value)
    }
  }

  /** 插入dom节点时使用preact render */
  connectedCallback() {
    this.render()
  }

  /** 因为拦截了setAttribute
   * 所以当set observedAttributes里监控的属性时，这里不会运行
   * */
  // attributeChangedCallback() {
  //   this.render()
  // }

  render() {
    this.shadowRoot.innerHTML = Object.keys(this.data).map((k) => {
      return `<p>${k}: ${this.data[k]}</p>`
    }).join('<br />')
  }

}

customElements.define('my-element', MyElementClass)

export const MyElement = transformToReact('my-element')
