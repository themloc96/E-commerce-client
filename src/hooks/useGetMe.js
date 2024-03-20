import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import { getBusinessesInfoFn } from '../apis/business.api';
import { getMeFn } from '../apis/user.api';
import { memberStatus } from '../constants/enum/member';
import { useAuthContext } from '../contexts/AuthProvider';

const useGetMe = () => {
  const authCtx = useAuthContext();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await queryClient.fetchQuery(
          ['v1/member/my-info'],
          () => getMeFn(),
          {
            staleTime: 0,
          },
        );
        authCtx.dispatch({ type: 'GET_USER', payload: data });
        if (data?.memberStatus && data?.memberStatus === memberStatus.REMOVAL) {
          authCtx.dispatch({ type: 'LOGOUT_USER', payload: null });
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchBusinessesInfo = async () => {
      try {
        const data = await queryClient.fetchQuery(
          ['v1/business/my-info'],
          () => getBusinessesInfoFn(),
          {
            staleTime: 0,
          },
        );
        authCtx.dispatch({ type: 'GET_BUSINESS_INFO', payload: data });
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyInfo();
    fetchBusinessesInfo();
  }, [pathname]);
};
export default useGetMe;
