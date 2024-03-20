import { createRenderer } from 'react-test-renderer/shallow';
import AccessMethod from '../components/AccessMethod';

const product = {
  productDesigns: ['text game'],
  productAppServices: ['text game'],
  accessMethods: [
    {
      text: '비밀번호',
      value: '비밀번호',
      icon: '/assets/icons/password-icon.png',
    },
  ],
};
const renderer = createRenderer();
describe('AccessMethod', () => {
  renderer.render(<AccessMethod product={product} />);
  const renderedOutput = renderer.getRenderOutput();
  it('Should render and match the snapshot', () => {
    expect(renderedOutput).toMatchSnapshot();
  });
});
