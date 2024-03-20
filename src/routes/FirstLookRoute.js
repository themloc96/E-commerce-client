import { Outlet } from 'react-router-dom';

import Footer from '../components/core/footer';
import Home from '../pages/Home';

export const FirstLookRoute = () => {
  return {
    path: '',
    element: <Outlet />,
    children: [
      {
        path: '',
        element: (
          <>
            <Outlet />
            <Footer hasMarginTop={false} />
          </>
        ),
        children: [
          {
            path: '',
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <Home />,
              },
            ],
          },
        ],
      },
    ],
  };
};
