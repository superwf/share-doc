/** 配置jest启动前的环境
 * 此时jest的整个环境还不可用，没有jest、beforeEach、beforeAll这种全局变量
 * */
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })
