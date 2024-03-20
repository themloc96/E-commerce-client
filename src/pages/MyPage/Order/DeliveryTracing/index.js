import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import Container from '../../../../components/Container';
import PageHeader from '../../../../components/MyPage/page-header';
import Pagination from '../../../../components/Pagination';
import { useWindowDimensions } from '../../../../hooks';

import { getOrderByIdFn } from '../../../../apis/order.api';
import '../../../../styles/my-page/delivery-tracking.scss';
import LoadingBox from '../../../../components/Loading/LoadingBox';
import { smartDeliveryCheckFn } from '../../../../apis/delivery.api';

const exData = [
  {
    code: null,
    kind: '집화처리',
    level: 2,
    manName: '',
    manPic: '',
    remark: null,
    telno: '02-2209-1184',
    telno2: '',
    time: 1687160504000,
    timeString: '2023-06-19 16:41:44',
    where: '서울상봉',
  },
  {
    code: null,
    kind: '간선상차',
    level: 3,
    manName: '',
    manPic: '',
    remark: null,
    telno: '',
    telno2: '',
    time: 1687163438000,
    timeString: '2023-06-19 17:30:38',
    where: '중랑',
  },
  {
    code: null,
    kind: '간선하차',
    level: 3,
    manName: '',
    manPic: '',
    remark: null,
    telno: '',
    telno2: '',
    time: 1687214924000,
    timeString: '2023-06-20 07:48:44',
    where: '곤지암Hub',
  },
  {
    code: null,
    kind: '간선하차',
    level: 3,
    manName: '',
    manPic: '',
    remark: null,
    telno: '',
    telno2: '',
    time: 1687215777000,
    timeString: '2023-06-20 08:02:57',
    where: '곤지암Hub',
  },
  {
    code: null,
    kind: '간선상차',
    level: 3,
    manName: '',
    manPic: '',
    remark: null,
    telno: '',
    telno2: '',
    time: 1687215904000,
    timeString: '2023-06-20 08:05:04',
    where: '곤지암Hub',
  },
  {
    code: null,
    kind: '간선하차',
    level: 3,
    manName: '',
    manPic: '',
    remark: null,
    telno: '',
    telno2: '',
    time: 1687224715000,
    timeString: '2023-06-20 10:31:55',
    where: '덕양B',
  },
  {
    code: null,
    kind: '간선하차',
    level: 3,
    manName: '',
    manPic: '',
    remark: null,
    telno: '',
    telno2: '',
    time: 1687224792000,
    timeString: '2023-06-20 10:33:12',
    where: '덕양B',
  },
  {
    code: null,
    kind: '배송출발\n(배달예정시간\n:16∼18시)',
    level: 5,
    manName: '김형탁',
    manPic: '',
    remark: null,
    telno: '',
    telno2: '01046293515',
    time: 1687246773000,
    timeString: '2023-06-20 16:39:33',
    where: '경기고양천하',
  },
  {
    code: null,
    kind: '배송완료',
    level: 6,
    manName: '김형탁',
    manPic: '',
    remark: null,
    telno: '',
    telno2: '01046293515',
    time: 1687247860000,
    timeString: '2023-06-20 16:57:40',
    where: '경기고양천하',
  },
];

function DeliveryTrackingPage() {
  const { width } = useWindowDimensions();
  const { id } = useParams();
  const [shoppingData, setShoppingData] = useState();

  const { isLoading } = useQuery(
    [`v1/order/${id}`, id],
    () => getOrderByIdFn(id || null),
    {
      keepPreviousData: true,
      retry: 0,
      onError: error => {
        console.log(error);
      },
      onSuccess: _data => {
        setShoppingData(_data.shippingResponse[0]);
      },
    },
  );

  // todo 배송 정보 더미 데이터
  const { data: deliveryData } = useQuery(
    [shoppingData],
    () =>
      smartDeliveryCheckFn({
        deliveryNote: shoppingData?.invoice,
        deliveryCompany: shoppingData?.courier,
      }),
    {
      enabled: shoppingData !== undefined,
      onError: error => {
        console.log(error);
      },
    },
  );

  return (
    <div className="delivery-tracking">
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          {width > 768 && <PageHeader currentLink="/my-page#order" />}
          <h2 className="delivery-tracking-heading">배송조회</h2>
          <div className="delivery-tracking-content">
            <div className="flex gap-[4px] flex-col md:flex-row">
              <div className="delivery-tracking-courier">
                <span className="md:!min-w-[65px]">이름</span>
                <span>{shoppingData?.courier}</span>
              </div>
              <div className="delivery-tracking-courier">
                <span className="md:!min-w-[114px]">운송장번호</span>
                <span>{shoppingData?.invoice}</span>
              </div>
              <div className="delivery-tracking-recipient">
                <span className="md:!min-w-[103px]">받는 사람</span>
                <span>{shoppingData?.name}</span>
              </div>
            </div>
            <div className="delivery-tracking-recipient">
              <span className="md:!min-w-[101px]">받는 주소</span>
              <span>{shoppingData?.address}</span>
            </div>

            {width > 768 && (
              <div className="delivery-tracking-delivery-statuses">
                <div className="delivery-tracking-delivery-status-title">
                  <p>시간</p>
                  <p>현재위치</p>
                  <p>배송상태</p>
                </div>
                <div className="delivery-tracking-delivery-status-content">
                  {deliveryData?.map(raw => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          backgroundColor: '#fff',
                          marginBottom: '1%',
                        }}
                      >
                        <div
                          style={{
                            width: '33.33%',
                            textAlign: 'center',
                            margin: '2% 0',
                          }}
                        >
                          {raw.timeString}
                        </div>
                        <div
                          style={{
                            width: '33.33%',
                            textAlign: 'center',
                            margin: '2% 0',
                          }}
                        >
                          {raw.where}
                        </div>
                        <div
                          style={{
                            width: '33.33%',
                            textAlign: 'center',
                            margin: '2% 0',
                          }}
                        >
                          {raw.kind}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {width < 768 && (
              <div>
                {deliveryData?.map(raw => {
                  return (
                    <div
                      className="delivery-tracking-delivery-statuses"
                      style={{ padding: '16px 20px' }}
                    >
                      <div className="delivery-tracking-delivery-status">
                        <p>시간</p>
                        <div className="md:relative z-[1]">
                          <span>{raw.timeString}</span>
                        </div>
                      </div>
                      <div className="delivery-tracking-delivery-status">
                        <p>현재위치</p>
                        <p className="md:relative z-[1]">{raw.where}</p>
                      </div>
                      <div className="delivery-tracking-delivery-status">
                        <p>배송상태</p>
                        <p className="md:relative z-[1]">{raw.kind}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      )}
    </div>
  );
}

export default DeliveryTrackingPage;
