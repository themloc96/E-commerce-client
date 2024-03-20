import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ShoppingCartContext } from '../../../contexts/ShoppingCartProvider';
import CartIconDesktop from '../CartIconDesktop';

describe('Cart Icon tests', () => {
  test('uses preloaded state to render', () => {
    const products = [
      {
        businessId: 3,
        code: '00009',
        createdAt: '2023-06-29 15:29:54',
        description: '키인S 도어락 현관 현관문 디지털 지문인식 즉시잠김',
        id: 11,
        mileageAccumulationRate: 3,
        modelName: '키인S',
        name: '키인S 도어락 현관 현관문',
        price: 190000,
      },
      {
        businessId: 3,
        code: '00009',
        createdAt: '2023-06-29 15:29:54',
        description: '키인S 도어락 현관 현관문 디지털 지문인식 즉시잠김',
        id: 11,
        mileageAccumulationRate: 3,
        modelName: '키인S',
        name: '키인S 도어락 현관 현관문',
        price: 190000,
      },
    ];
    const value = { products };
    render(
      <BrowserRouter>
        <ShoppingCartContext.Provider value={value}>
          <CartIconDesktop />
        </ShoppingCartContext.Provider>
      </BrowserRouter>,
    );
    const cartIconElement = screen.getByText('2+');
    expect(cartIconElement).toBeInTheDocument();
  });
});
