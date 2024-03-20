import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// components
import Container from '../../../components/Container';
import TotalAmountOfTable from '../../../components/WTable/TotalAmountOfTable';

// contexts
import { useAuthContext } from '../../../contexts/AuthProvider';

// utils
import { formatShortDate } from '../../../utils/helper.dateTime';

// apis
import {
  getMaterialStatusFn,
  getSettlementMaterialFn,
} from '../../../apis/after-service';

// styles
import '../../../styles/as-status/material-return-status-detail.scss';

function MaterialReturnStatusCaseOne() {
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { businessInfo } = state;
  const today = new Date();
  const navigate = useNavigate();
  const [materialList, setMaterialList] = useState([]);

  const { data: items = { list: [] } } = useQuery(
    ['getSettlementMaterialFn'],
    () =>
      getSettlementMaterialFn({
        businessId: businessInfo.id,
      }),
    {
      enabled: !!businessInfo.id,
      onSuccess: _data => {
        setMaterialList(
          _data?.list.filter(raw => raw.returnStatus === 'DEFAULT').length !== 0
            ? _data?.list.filter(raw => raw.returnStatus === 'DEFAULT')
            : [],
        );
      },
    },
  );

  const { refetch } = useQuery(
    ['getMaterialStatusFn'],
    () =>
      getMaterialStatusFn({
        id: materialList.map(item => item.id).join(','),
        status: 'RETURN_REQUEST',
      }),
    {
      enabled: false,
      onSuccess: () => {
        navigate('/as/material-return-status');
      },
      onError: error => {
        // console.log(error);
        alert('반납 요청 자재가 존재하지 않습니다.');
      },
    },
  );

  const sumCount = useMemo(() => {
    let sum = 0;
    if (materialList.length > 0) {
      sum = materialList.reduce((prev, current) => {
        return prev + Number(current.quantity);
      }, 0);
    }
    return sum;
  }, [materialList]);

  function Style() {
    return (
      <style>
        {`
            .keyin-parent{ background-color: #FFFFFF;display: flex;flex-direction: column;overflow:hidden;}
            #product-order{background-color: #FFFFFF}
          `}
      </style>
    );
  }

  return (
    <>
      <Style />
      <div>
        <h1 className="!text-textSecondary4 as-heading">자재 반납 요청</h1>
        <Container className="wrapper-material-return-status-detail">
          <div className="txt-title">
            <span className="txt-date-require">요청일</span>
            <span className="line" />
            <span className="txt-date">
              {formatShortDate(today, 'yyyy.MM.DD')}
            </span>
          </div>
          <div className="line-x" />
          <div className="content">
            <div className="wrapper-table">
              <table>
                <thead>
                  <tr className="header">
                    <th className="col-1">
                      <span>No</span>
                    </th>
                    <th className="col-2">
                      <span>요청일</span>
                    </th>
                    <th className="col-3">
                      <span>품번</span>
                    </th>
                    <th className="col-4">
                      <span>품명</span>
                    </th>
                    <th className="col-5">
                      <span>수량</span>
                    </th>
                    <th className="col-6">
                      <span>내용</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {materialList.map((item, index) => {
                    const { id, createdAt, asMaterial, quantity } = item;
                    return (
                      <tr key={`${id}-${createdAt}`}>
                        <td className="col-1">
                          <span>{index + 1}</span>
                        </td>
                        <td className="col-2">
                          <span>
                            {formatShortDate(createdAt, 'yyyy.MM.DD')}
                          </span>
                        </td>
                        <td className="col-3">
                          <span>{asMaterial.productCode}</span>
                        </td>
                        <td className="col-4">
                          <span>{asMaterial.productName}</span>
                        </td>
                        <td className="col-5">
                          <span>{quantity}</span>
                        </td>
                        <td className="col-6">
                          <span>{asMaterial.description}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <TotalAmountOfTable
              elementText={
                <div className="flex items-end md:mt-[-2px] txt-total">
                  <span className="f16Medium md:mr-[4px] md:f24Medium">
                    합계
                  </span>
                  <span className="text-[10px] mb-[5px] md:text-base">
                    (수량)
                  </span>
                </div>
              }
              totalAmountValue={sumCount}
            />
          </div>
          <div className="btn-ft">
            <button onClick={refetch}>
              <span>반납 요청</span>
            </button>
          </div>
        </Container>
      </div>
    </>
  );
}

export default MaterialReturnStatusCaseOne;
