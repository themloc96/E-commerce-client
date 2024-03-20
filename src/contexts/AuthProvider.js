/* eslint-disable react/function-component-definition */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {
  LocalStorageEventTarget,
  checkAuthenticated,
  removeAccessToken,
  saveAccessToken,
} from '../utils/accessTokenUtils';

export const initialState = {
  authUser: null,
  currentUser: null,
  isAuthenticated: checkAuthenticated(),
  businessInfo: {
    id: null,
  },
  mileagePoint: null,
};

const AuthContext = createContext(undefined);

export const stateReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      if (action.payload) {
        saveAccessToken(action.payload);
      }
      return {
        ...state,
        authUser: action.payload,
        isAuthenticated: true,
      };
    case 'GET_USER': {
      return {
        ...state,
        currentUser: action.payload,
      };
    }
    case 'LOGOUT_USER': {
      removeAccessToken();
      return {
        ...state,
        authUser: null,
        currentUser: null,
        isAuthenticated: false,
        businessInfo: null,
        mileagePoint: null,
      };
    }
    case 'GET_BUSINESS_INFO': {
      return {
        ...state,
        businessInfo: action.payload,
      };
    }
    case 'GET_MILEAGE_POINT': {
      return {
        ...state,
        mileagePoint: action.payload,
      };
    }
    default:
      throw new Error('Unhanlde action type');
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  // Listen event when server response status is 401
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', () => {
      dispatch({ type: 'LOGOUT_USER', payload: null });
    });
  }, []);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  }
  throw new Error(`useAuthContext must be used within a AuthContextProvider`);
};

export { AuthProvider, useAuthContext };
