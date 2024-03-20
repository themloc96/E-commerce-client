import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createRenderer } from 'react-test-renderer/shallow';
import TotalAmount from '../components/TotalAmount';

const renderer = createRenderer();
const totalAmountData = {
  onToggle: () => {},
  onAddToCart: () => {},
  totalAmount: 10,
};
const mockComponent = (
  <BrowserRouter>
    <TotalAmount {...totalAmountData} />
  </BrowserRouter>
);
describe('TotalAmount', () => {
  renderer.render(mockComponent);
  const renderedOutput = renderer.getRenderOutput();
  it('should render and match the snapshot', () => {
    expect(renderedOutput).toMatchSnapshot();
  });
  it('Should render total amount', () => {
    const totalAmount = render(mockComponent);
    expect(totalAmount.queryByTestId('total-amount')?.innerHTML).toBe(
      `${totalAmountData.totalAmount}`,
    );
  });
});
