/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../../components/Container';
import '../../../styles/as-status/situation-detail.scss';
import storeStyles from '../../../styles/store/store.module.scss';
import { useWindowDimensions } from '../../../hooks';

function SituationDetail() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const [isFolded, setIsFolded] = useState({
    isOpenReceiptInfo: width > 767,
    isOpenCustomer: true,
    isOpenItem: true,
    isOpenAsReceipt: true,
    isOpenAsCost: true,
    isOpenAttachments: true,
    isOpenMaterial: true,
    isOpenAsAction: width > 767,
  });

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
        {/* <h1 className="as-heading">접수 내역</h1> */}
        <Container className={`${storeStyles.container} wrapper-situation`}>
          {width > 767 && (
            <div className="situation-heading-wrap">
              <button onClick={() => navigate(-1)}>
                <img src="/assets/icons/back.png" alt="back button" />
              </button>
              <h1 className="as-heading">접수 내역</h1>
            </div>
          )}
          <div className="content case-five">
            <div className="tab-small case-five">
              <span>A/S조치완료</span>
            </div>

            <div className="reception-information">
              <div
                // onClick={() => {
                //   setIsFolded({
                //     ...isFolded,
                //     isOpenReceiptInfo: !isFolded.isOpenReceiptInfo,
                //   });
                // }}
                className="title-reception case-five"
              >
                <span>접수 정보</span>
                {/* {width < 767 && (
                  <i
                    className={
                      !isFolded.isOpenReceiptInfo
                        ? 'ico-dropdown'
                        : 'ico-dropup'
                    }
                  />
                )} */}
              </div>
              {/* line */}
              <div className="line" />
              <div className="registration-block">
                <div className="registration-number">
                  <div className="label">접수번호</div>
                  <div className="field">
                    <input value="20230327-1" />
                  </div>
                </div>
                <div className="registration-number">
                  <div className="label">접수자</div>
                  <div className="field">
                    <input placeholder="" value="이소영" />
                  </div>
                </div>
                <div className="registration-number">
                  <div className="label">접수일시</div>
                  <div className="field">
                    <input placeholder="" value="2023.03.06 17:15" />
                  </div>
                </div>
              </div>
            </div>

            <div className="customer-information">
              <div className="title-customer">
                <h2
                  onClick={() => {
                    setIsFolded({
                      ...isFolded,
                      isOpenCustomer: !isFolded.isOpenCustomer,
                    });
                  }}
                >
                  고객 정보
                  <i
                    className={
                      !isFolded.isOpenCustomer ? 'ico-dropdown' : 'ico-dropup'
                    }
                  />
                </h2>
              </div>
              <div className="line" />
              {!isFolded.isOpenCustomer && (
                <div className="registration-block">
                  <div className="row">
                    <div className="registration-number">
                      <div className="label">고객명</div>
                      <div className="field">
                        <input placeholder="" value="홍범영" />
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label">
                        휴대전화<span className="require">*</span>
                      </div>
                      <div className="field">
                        <input placeholder="" value="01033371363" />
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label">전화번호</div>
                      <div className="field">
                        <input placeholder="" />
                      </div>
                    </div>
                  </div>

                  <div className="registration-number">
                    <div className="label-address">주소</div>
                    <div className="field full">
                      <input
                        placeholder=""
                        value="서울시 강서구 화곡동1056-7"
                      />
                    </div>
                    {width > 767 && (
                      <div className="field full">
                        <input
                          placeholder=""
                          value="101호"
                          className="spacing-10"
                        />
                      </div>
                    )}
                  </div>
                  {width < 767 && (
                    <div className="registration-number">
                      <div className="label-address">주소</div>
                      <div className="field full">
                        <input placeholder="" value="101호" />
                      </div>
                    </div>
                  )}
                  <div className="registration-number">
                    <div className="label-remember-board">메모</div>
                    <div className="field full">
                      <input placeholder="" className="spacing-16" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="item-information">
              <div className="title">
                <h2
                  className="case-five"
                  onClick={() => {
                    setIsFolded({
                      ...isFolded,
                      isOpenItem: !isFolded.isOpenItem,
                    });
                  }}
                >
                  품목 정보
                  <i
                    className={
                      !isFolded.isOpenItem ? 'ico-dropdown' : 'ico-dropup'
                    }
                  />
                </h2>
              </div>
              <div className="line case-five" />
              {!isFolded.isOpenItem && (
                <div className="registration-block">
                  <div className="row">
                    <div className="registration-number">
                      <div className="label">
                        모델명 <span className="require">*</span>
                      </div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input placeholder="" value="KD1234591" />
                        </div>
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label">제품명</div>
                      <div className="wrapper-field">
                        <div className="field submit">
                          <input placeholder="" value="키인L" />
                          <button className="">
                            <span>제품정보</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label">상담유형</div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input placeholder="" value="방문 설치" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="registration-number">
                    <div className="label-consulting-details case-four">
                      상담내역
                    </div>
                    <div className="wrapper-field">
                      <div className="field full">
                        <textarea
                          placeholder=""
                          className="height"
                          value="장비에서 알림 소리가 지속적으로 울려 교체를 희망함"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="as-receipt-details">
              <div className="title">
                <h2
                  className="case-four"
                  onClick={() => {
                    setIsFolded({
                      ...isFolded,
                      isOpenAsReceipt: !isFolded.isOpenAsReceipt,
                    });
                  }}
                >
                  {width < 767 ? 'A/S 접수내역' : 'A/S 접수 내역'}
                  <i
                    className={
                      !isFolded.isOpenAsReceipt ? 'ico-dropdown' : 'ico-dropup'
                    }
                  />
                </h2>
              </div>
              <div className="line" />
              {!isFolded.isOpenAsReceipt && (
                <div className="registration-block">
                  <div className="row">
                    <div className="registration-number">
                      <div className="label">접수유형</div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input placeholder="" value="A/S 접수" />
                        </div>
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label">유/무상</div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input placeholder="" value="유상" />
                        </div>
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label">시리얼 넘버(S/N)</div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input placeholder="" value="입력" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="registration-number">
                      <div className="label">
                        {width < 767 ? '설치일자' : '출동구분'}
                      </div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input
                            placeholder=""
                            // value="일반"
                            value={`${width < 767 ? '2023.03.10' : '입력'}`}
                          />
                        </div>
                      </div>
                    </div>
                    {width < 767 && (
                      <div className="registration-number">
                        <div className="label">출동구분</div>
                        <div className="wrapper-field">
                          <div className="field">
                            <input placeholder="" value="일반" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="registration-number">
                      <div className="label">
                        {width < 767 ? '제조년월' : '설치일자'}
                      </div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input
                            placeholder=""
                            // value=""
                            value={`${width < 767 ? '2023.03' : '2023.03.10'}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label">
                        {width < 767 ? '대표증상' : '제조년월'}
                      </div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input
                            placeholder=""
                            // value="2023.03"
                            value={`${width < 767 ? '인증불량' : '2023.03'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="registration-number">
                    <div className="label-detailed-symptoms">
                      {width < 767 ? '세부증상' : '대표증상'}
                    </div>
                    <div className="wrapper-field">
                      <div className="field full">
                        <input placeholder="" value="인증불량" />
                      </div>
                    </div>
                  </div>
                  {width > 767 && (
                    <div className="registration-number">
                      <div className="label-detailed-symptoms">세부증상</div>
                      <div className="wrapper-field">
                        <div className="field full">
                          <input placeholder="" value="인증불량" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="as-cost">
              <div className="title">
                <h2
                  // className={`${
                  //   !isFolded.isOpenAsCost ? 'title-open case-five' : ''
                  // }`}
                  onClick={() => {
                    setIsFolded({
                      ...isFolded,
                      isOpenAsCost: !isFolded.isOpenAsCost,
                    });
                  }}
                >
                  {!isFolded.isOpenAsCost ? 'A/S 비용' : 'A/S 비용'}
                  <i
                    className={
                      !isFolded.isOpenAsCost ? 'ico-dropdown' : 'ico-dropup'
                    }
                  />
                </h2>
              </div>
              <div className="line" />
              {!isFolded.isOpenAsCost && (
                <div className="registration-block">
                  <div className="registration-number">
                    <div className="label-customer-name">비용총액(원)</div>
                    <div className="wrapper-field">
                      <div className="field full">
                        <input placeholder="" value="370,000" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="registration-number">
                      <div className="label-travel-expenses">출장비</div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input placeholder="" value="20,000" />
                        </div>
                        <div className="add-item">
                          <img
                            src="../../../../assets/icons/icon-add.png"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>

                    <div className="registration-number">
                      <div className="label-travel-expenses">자재비</div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input placeholder="" value="320,000" />
                        </div>
                        <div className="add-item">
                          <img
                            src="../../../../assets/icons/icon-add.png"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label-travel-expenses">할증료</div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input placeholder="" value="320,000" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="registration-number row">
                    <div className="col-70">
                      <div className="label-optional-surcharge">
                        할증료 선택(다중선택 가능)
                      </div>
                      <div className="wrapper-field">
                        <div className="field full">
                          <input placeholder="" value="할증 종류" />
                        </div>
                      </div>
                    </div>
                    <div className="col-30">
                      <div className="label-optional-surcharge">
                        {width > 767 ? '할증료' : ''}
                      </div>
                      <div className="wrapper-field">
                        <div className="field full">
                          <input placeholder="" value="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="attachments">
              <div className="title">
                <h2
                  onClick={() => {
                    setIsFolded({
                      ...isFolded,
                      isOpenAttachments: !isFolded.isOpenAttachments,
                    });
                  }}
                >
                  {width < 767 ? '첨부파일' : '첨부파일'}
                  <i
                    className={
                      !isFolded.isOpenAttachments
                        ? 'ico-dropdown'
                        : 'ico-dropup'
                    }
                  />
                </h2>
              </div>
              <div className="line" />
              {!isFolded.isOpenAttachments && (
                <div className="registration-block">
                  <div className="registration-number">
                    <div className="label-attachment">파일첨부</div>
                    <div className="wrapper-field field-attachment">
                      <div className="field">
                        <input placeholder="" value="설치 설명서.jpg" />
                      </div>
                      <div className="attachment">
                        <span>다운로드</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="as-action-details">
              <div className="title">
                <h2
                  onClick={() => {
                    setIsFolded({
                      ...isFolded,
                      isOpenAsAction: !isFolded.isOpenAsAction,
                    });
                  }}
                >
                  A/S 조치 내역
                  <i
                    className={
                      !isFolded.isOpenAsAction ? 'ico-dropdown' : 'ico-dropup'
                    }
                  />
                </h2>
              </div>
              <div className="line" />
              {!isFolded.isOpenAsAction && (
                <div className="registration-block">
                  <div className="row">
                    <div className="registration-number">
                      <div className="label">모델명</div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input placeholder="" value="KD1234591" />
                        </div>
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label">제품명</div>
                      <div className="wrapper-field">
                        <div className="field submit">
                          <input placeholder="" value="키인L" />
                          <button className="">
                            <span>제품정보</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label">상담유형</div>
                      <div className="wrapper-field">
                        <div className="field">
                          <input placeholder="" value="방문 설치" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="registration-number">
                    <div className="label-representative-symptoms">
                      대표증상
                    </div>
                    <div className="wrapper-field">
                      <div className="field full">
                        <input placeholder="" value="인증불량" />
                      </div>
                    </div>
                  </div>
                  <div className="registration-number">
                    <div className="label-representative-symptoms">
                      세부증상
                    </div>
                    <div className="wrapper-field">
                      <div className="field full">
                        <input placeholder="" value="인증불량" />
                      </div>
                    </div>
                  </div>
                  <div className="registration-number">
                    <div className="label-advanced-processing">처리내용</div>
                    <div className="wrapper-field">
                      <div className="field full">
                        <textarea
                          placeholder=""
                          className="height"
                          value="장비교체"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="estimated-material">
              <div className="title">
                <h2
                // className={`${isFolded.isOpenMaterial ? 'open' : ''}`}
                // onClick={() => {
                //   setIsFolded({
                //     ...isFolded,
                //     isOpenMaterial: !isFolded.isOpenMaterial,
                //   });
                // }}
                >
                  사용 자재
                  {/* {width < 767 && (
                    <i
                      className={
                        !isFolded.isOpenMaterial ? 'ico-dropdown' : 'ico-dropup'
                      }
                    />
                  )} */}
                </h2>
              </div>
              <div className="line" />
              <div className="registration-table">
                <table>
                  <thead>
                    <tr className="header">
                      <th className="col-1">
                        <span>No</span>
                      </th>
                      <th className="col-2">
                        <span>품번</span>
                      </th>
                      <th className="col-3">
                        <span>품명</span>
                      </th>
                      <th className="col-4">
                        <span>수량</span>
                      </th>
                      <th className="col-5">
                        <span>소비자가</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="col-1">
                        <span>1</span>
                      </td>
                      <td className="col-2">
                        <span>1264f52</span>
                      </td>
                      <td className="col-3">
                        <span>키인S</span>
                      </td>
                      <td className="col-4">
                        <span>1</span>
                      </td>
                      <td className="col-5">
                        <span>170,000</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* {width < 767 && (
              <div className="footer-situation">
                <div
                  className={`${width < 767 ? 'active' : ''} ${
                    !isFolded.isOpenMaterial ? 'open' : ''
                  } submit-situation`}
                >
                  <span>{width < 767 ? '출동승인' : '출동 승인'}</span>
                </div>
              </div>
            )} */}
          </div>
        </Container>
      </div>
    </>
  );
}

export default SituationDetail;
