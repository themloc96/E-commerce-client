/**
 * Asynchronously loads the component for ProductPage
 */

import * as React from 'react';
import { lazyLoad } from '../../utils/loadable';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';

const ProductPage = lazyLoad(
  () => import('./index'),
  module => module.ProductPage,
  {
    fallback: <FullScreenLoader />,
  },
);
export default ProductPage;
