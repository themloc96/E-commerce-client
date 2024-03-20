import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

// eslint import/no-unresolved
import 'react-datepicker/dist/react-datepicker.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './App.css';
import './styles/css/taildwind-css.css';

import { AppRoutes } from './routes';
import { AuthProvider } from './contexts/AuthProvider';
import { ShoppingCartProvider } from './contexts/ShoppingCartProvider';
import ErrorBoundary from './components/ErrorBoundary';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={4000}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <ShoppingCartProvider>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </ShoppingCartProvider>
          </SnackbarProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
