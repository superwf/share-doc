import * as React from 'react'
import { render } from 'react-dom'

import * as store from './store'
import { App } from './component/App'

render(<App store={store} />, document.querySelector('#app'))
