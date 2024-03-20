import { initialState, stateReducer } from '../AuthProvider';

const userPayload = {
  createdAt: '2023-07-05 07:54:08',
  updatedAt: '2023-07-06 13:59:52',
  id: 678,
  name: 'Danh-Han-test',
  username: 'admin',
  phone: '010-1230-56479',
  email: 'adminGiang@gmail.com',
  address: null,
  detailedAddress: null,
  role: 'ROLE_ADMIN',
  referralCode: '010-1230-56479',
  fromReferralCode: null,
  currentMileagePoint: 58000,
  memberType: 'EMPLOY',
  memberStatus: 'ACTIVATE',
  memberBelong: 'Danh-Han-test',
  memberPosition: 'Danh-Han-test',
  per_id: null,
  businessFile: null,
};

const loginingUserPayload = {
  message: 'Login successfully!',
  role: 'ROLE_ADMIN',
  token:
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY4OTMyMDA1OSwiZXhwIjoxNjg5NDA2NDU5fQ.FHqiip7rRkHi9lmTwS9Q8vGTU0_scOAIZxF_rZ2dmlroBWdaLcX13YiyG_tCIgCxJBjp-6CgkTp3RjcXQ2Rp4A',
  username: 'admin',
};

const bizInfoPayload = {
  createdAt: '2023-06-21 07:35:19',
  updatedAt: '2023-07-13 06:16:11',
  id: 2,
  businessName: 'Ninefive',
  businessPhone: '0965684762',
  businessRepresentativeName: 'GiangTran',
  businessRegistrationNumber: '123456789',
  businessAddress: 'Island',
  businessDetailedAddress: 'PhuNhuanDistrict',
  businessType: 'GENERAL',
  businessFile: null,
  businessSavingMileagePoint: 327175,
  partnerShipID: null,
};

  const mileagePointPayload = '327175';

describe('Auth reducer', () => {
  it('should return current state when LOGIN_USER action is dispatched', () => {
    const action = {
      type: 'LOGIN_USER',
      payload: loginingUserPayload,
    };
    const updatedState = stateReducer(initialState, action);
    expect(updatedState).toEqual({
      authUser: loginingUserPayload,
      isAuthenticated: true,
      currentUser: null,
      businessInfo: null,
      mileagePoint: null,
    });
  });
  it('should return current state when GET_USER action is dispatched', () => {
    const action = {
      type: 'GET_USER',
      payload: userPayload,
    };
    const currentState = {
      authUser: loginingUserPayload,
      isAuthenticated: true,
      currentUser: null,
      businessInfo: null,
      mileagePoint: null,
    };
    const updatedState = stateReducer(currentState, action);
    expect(updatedState).toEqual({
      authUser: loginingUserPayload,
      isAuthenticated: true,
      currentUser: userPayload,
      businessInfo: null,
      mileagePoint: null,
    });
  });
  it('should return current state when GET_BUSINESS_INFO action is dispatched', () => {
    const action = {
      type: 'GET_BUSINESS_INFO',
      payload: bizInfoPayload,
    };
    const currentState = {
      authUser: loginingUserPayload,
      isAuthenticated: true,
      currentUser: userPayload,
      businessInfo: null,
      mileagePoint: null,
    };
    const updatedState = stateReducer(currentState, action);
    expect(updatedState).toEqual({
      authUser: loginingUserPayload,
      isAuthenticated: true,
      currentUser: userPayload,
      businessInfo: bizInfoPayload,
      mileagePoint: null,
    });
  });

  it('should return current state when GET_MILEAGE_POINT action is dispatched', () => {
    const action = {
      type: 'GET_MILEAGE_POINT',
      payload: mileagePointPayload,
    };
    const currentState = {
      authUser: loginingUserPayload,
      isAuthenticated: true,
      currentUser: userPayload,
      businessInfo: bizInfoPayload,
      mileagePoint: null,
    };
    const updatedState = stateReducer(currentState, action);
    expect(updatedState).toEqual({
      authUser: loginingUserPayload,
      isAuthenticated: true,
      currentUser: userPayload,
      businessInfo: bizInfoPayload,
      mileagePoint: mileagePointPayload,
    });
  });
});
