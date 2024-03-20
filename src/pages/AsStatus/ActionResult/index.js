import { useState } from 'react';
import Container from '../../../components/Container';
import '../../../styles/as-status/action-result.scss';
import storeStyles from '../../../styles/store/store.module.scss';
import { useWindowDimensions } from '../../../hooks';

function ActionResult() {
  const { width } = useWindowDimensions();

  const [isFolded, setIsFolded] = useState({
    isOpenItem: false,
    isOpenApplication: false,
  });

  const [listItem, setListItem] = useState([
    {
      id: 1,
      idPrd: '1264f52',
      checked: false,
      namePrd: '키인S',
      pricePrd1: '140,000원',
      pricePrd2: '170,000',
      numerPrd: 3,
    },
  ]);

  const [isChecked, setIsChecked] = useState(false);

  const toggleSelectAll = () => {
    setIsChecked(!isChecked);
    const updatedCheckboxes = listItem.map(item => ({
      ...item,
      checked: !isChecked,
    }));
    setListItem(updatedCheckboxes);
  };

  const handleCheckboxChange = id => {
    const updatedCheckboxes = listItem.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setListItem(updatedCheckboxes);

    const allChecked = updatedCheckboxes.every(item => item.checked);
    setIsChecked(allChecked);
  };

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
        <h1 className="as-heading">A/S 조치결과 입력</h1>
        <Container className={`${storeStyles.container} wrapper-action-result`}>
          <div className="content">
            <div className="customer-information">
              <div className="title-customer">
                <h2>고객 정보</h2>
              </div>
              <div className="line" />
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
                      value="서울특별시 강서구 화곡동 1056-7"
                    />
                  </div>
                </div>
                <div className="registration-number">
                  {width < 767 && <div className="label-address">상세주소</div>}

                  <div className="field full">
                    <input
                      placeholder=""
                      value="101호"
                      className="spacing-10"
                    />
                  </div>
                </div>
                <div className="registration-number">
                  <div className="label-remember-board">메모</div>
                  <div className="field full">
                    <input placeholder="" className="spacing-16" />
                  </div>
                </div>
              </div>
            </div>

            <div className="item-information">
              <div className="title">
                <h2
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
              <div className="line" />
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
                </div>
              )}
            </div>

            <div className="application-type">
              <div className="title">
                <h2
                  onClick={() => {
                    setIsFolded({
                      ...isFolded,
                      isOpenApplication: !isFolded.isOpenApplication,
                    });
                  }}
                >
                  접수유형
                  <i
                    className={
                      !isFolded.isOpenApplication
                        ? 'ico-dropdown'
                        : 'ico-dropup'
                    }
                  />
                </h2>
              </div>
              <div className="line" />
              {!isFolded.isOpenApplication && (
                <>
                  <div className="registration-block">
                    <div className="row">
                      <div className="registration-number">
                        <div className="label">접수명</div>
                        <div className="wrapper-field">
                          <div className="field">
                            <input placeholder="" value="A/S 접수" />
                          </div>
                        </div>
                      </div>
                      <div className="registration-number">
                        <div className="label">유무상</div>
                        <div className="wrapper-field">
                          <div className="field">
                            {/* <input placeholder="" value="유상" /> */}
                            <div className="select">
                              <div className="selected">
                                <span>유상</span>
                                <i className="ico-dropup" />
                              </div>
                            </div>
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
                    <div className="registration-number">
                      <div className="label-representative-symptoms">
                        대표증상
                      </div>
                      <div className="wrapper-field">
                        <div className="select">
                          <div className="selected">
                            <span>인증불량</span>
                            <i className="ico-dropup" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label-representative-symptoms">
                        세부증상
                      </div>
                      <div className="wrapper-field">
                        <div className="select">
                          <div className="selected">
                            <span>인증불량</span>
                            <i className="ico-dropup" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="registration-number">
                      <div className="label-consulting-details">처리내용</div>
                      <div className="wrapper-field">
                        <div className="field full">
                          <textarea placeholder="텍스트 입력" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="registration-block">
                    <div className="registration-number">
                      <div className="label-attachment">파일첨부</div>
                      <div className="wrapper-field field-attachment">
                        <div className="field">
                          <input placeholder="" value="" />
                        </div>
                        <div className="attachment">
                          <span>파일첨부</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="estimated-material">
              <div className="title">
                <h2>사용 자재</h2>
                {width > 767 && (
                  <div className="group-btn">
                    <div className="btn">
                      <button>
                        <span>추가</span>
                      </button>
                    </div>
                    <div className="btn">
                      <button>
                        <span>삭제</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="line" />
              <div className="registration-table">
                <table>
                  <thead>
                    <tr className="header">
                      <th className="col-1">
                        <input
                          className="styled-checkbox"
                          id="termAll"
                          type="checkbox"
                          value="value2"
                          checked={isChecked}
                          readOnly
                          onClick={toggleSelectAll}
                        />
                        <label htmlFor="termAll" />
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
                        <span>단가</span>
                      </th>
                      <th className="col-6">
                        <span>소비자가</span>
                      </th>
                      <th className="col-7">
                        <span>현재고</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listItem.map(item => {
                      return (
                        <tr key={item.id}>
                          <td className="col-1">
                            <input
                              className="styled-checkbox"
                              id={item.id}
                              type="checkbox"
                              value="value2"
                              checked={item.checked}
                              readOnly
                              onChange={() => handleCheckboxChange(item.id)}
                            />
                            <label htmlFor={item.id} />
                          </td>
                          <td className="col-2">
                            <span>{item.idPrd}</span>
                          </td>
                          <td className="col-3">
                            <span>{item.namePrd}</span>
                          </td>
                          <td className="col-4">
                            <span>{item.id}</span>
                          </td>
                          <td className="col-5">
                            <span>{item.pricePrd1}</span>
                          </td>
                          <td className="col-6">
                            <span>{item.pricePrd2}</span>
                          </td>
                          <td className="col-7">
                            <span>{item.numerPrd}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {width < 767 && (
              <div className="group-btn">
                <div className="btn">
                  <button>
                    <span>삭제</span>
                  </button>
                </div>
                <div className="btn">
                  <button>
                    <span>추가</span>
                  </button>
                </div>
              </div>
            )}

            <div className="footer-situation">
              <div className="submit-situation">
                <span>조치완료</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default ActionResult;
