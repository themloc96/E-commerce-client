import { render, screen, waitFor } from '@testing-library/react';
import SafetySection from '../components/SafetySection';

describe('SafetySection', () => {
  test('renders null if empty', () => {
    render(<SafetySection />);
    waitFor(() => expect(screen).toBeEmptyDOMElement());
  });

  test('renders 2 items', async () => {
    const items = [
      {
        id: 1,
        name: `엿보기 방지`,
        value: '엿보기 방지 페이크 비밀번호',
        src: '/assets/icons/safety-1.png',
        maxWidth: '120px',
      },
      {
        id: 2,
        name: `푸시바 강제잠금`,
        value: `푸시바 강제잠금`,
        src: '/assets/icons/safety-2.png',
        maxWidth: '120px',
      },
    ];
    render(<SafetySection safeties={items} />)
    const renderdItems = screen.queryAllByTestId('list-item');
    expect(renderdItems.length).toEqual(2);
  });
});
