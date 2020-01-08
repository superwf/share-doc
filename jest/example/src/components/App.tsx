import * as React from 'react'
import { Provider } from 'mobx-react'
import { User } from '../stores/user'
import { Role } from '../stores/role'

interface IProps {
  store: {
    user: User
    role: Role
  }
}

export class App extends React.Component<IProps> {
  public componentDidCatch(e: Error) {
    console.error(e)
  }

  public render() {
    const { store } = this.props
    return (
      <Provider store={store}>
        <section>App</section>
      </Provider>
    )
  }
}
