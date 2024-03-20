import { Route } from 'react-router-dom';
import { Mainlayout, Minilayout } from '../Layouts';

export function RouteWithLayout(routes) {
  const renderLayout = item => {
    return item.isMiniLayout ? (
      <Minilayout name={item.nameMiniLayOut || ''} />
    ) : (
      <Mainlayout renderWithoutFooter />
    );
  };

  return routes.map(route => {
    return (
      <Route
        exact
        key={route.path}
        path={route.path}
        element={renderLayout(route)}
      >
        <Route
          exact
          key={route.label}
          index
          path={route.path}
          element={route.component || null}
        />
      </Route>
    );
  });
}

export function RouteWithSub(routes) {
  return routes.map(item => {
    return (
      <Route
        key={item.label}
        exact
        path={item.path}
        element={item.component || null}
      />
    );
  });
}

