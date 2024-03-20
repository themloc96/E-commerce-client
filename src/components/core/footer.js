import { useState } from 'react';
import '../../styles/components/footer.scss';
import { useQuery } from '@tanstack/react-query';
import ModalComponent from './modal-base';
import { getTermsFn } from '../../apis/term.api';
import { generateUId } from '../../utils/helpers';

export default function Footer(props) {
  const { hasMarginTop = true } = props;
  const [isOpenInformation, setIsOpenInformation] = useState(false);
  const [policyList, setPolicyList] = useState([]);
  const [selectPolicy, setSelectPolicy] = useState();
  const isDisplayNone =
    window.location.href.includes('/my-page/employee-management') &&
    window.innerWidth < 768;

  useQuery(['v1/terms/list'], getTermsFn, {
    keepPreviousData: true,
    onSuccess: data => {
      const newPolicyList = [];
      data?.data?.list?.forEach(item => {
        newPolicyList.push({
          uid: generateUId(),
          title: item.name,
          content: item.content,
        });
      });
      setPolicyList(newPolicyList);
    },
  });
  return (
    <>
      <div
        id="footer"
        className={`footer main-bg-white ${
          hasMarginTop ? '!mt-[80px] lg:!mt-[200px]' : ''
        }`}
        style={{ display: isDisplayNone ? 'none' : 'block' }}
      >
        <div
          style={{ paddingX: '0!important' }}
          className="container keyin-footer-container"
        >
          <div className="keyin-footer">
            <div className="keyin-info">
              <div className="keyin-footer-logo">
                <img alt="logos" src="/assets/logos/footer-logo.svg" />
              </div>
              <div className="keyin-company">
                <span>상호명 : 주식회사 라오나크</span>
                <hr />
                <span>대표이사 : 구민기</span>
              </div>
              <div className="keyin-address">
                <span>
                  서울시 금천구 가산디지털
                  <span style={{ fontFamily: 'Roboto' }}>2</span>로 101
                  (한라원앤원타워 A동, 1608호)
                </span>
              </div>
              <div className="keyin-contact">
                <span>
                  <span style={{ fontFamily: 'Noto Sans KR' }}>
                    사업자등록번호 :
                  </span>{' '}
                  348-87-01843
                </span>
                <hr />
                <span>
                  <span
                    style={{
                      fontFamily: 'Noto Sans KR',
                    }}
                  >
                    대표전화 :
                  </span>{' '}
                  1668-3804
                </span>
                <hr />
                <span>
                  <span style={{ fontFamily: 'Noto Sans KR' }}>
                    통신판매업번호 :
                  </span>{' '}
                  2021-서울금천-1060
                </span>
              </div>
              <div className="keyin-business-information">
                <span>
                  {policyList?.map(item => {
                    return (
                      <button
                        key={item.uid}
                        onClick={e => {
                          e.preventDefault();
                          setIsOpenInformation(true);
                          setSelectPolicy(item);
                        }}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </span>
              </div>
              <div className="keyin-copyright">
                <span>
                  COPYRIGHT ⓒ
                  <span style={{ fontFamily: 'Roboto' }}>
                    {new Date().getFullYear()}
                  </span>{' '}
                  KEYIN. ALL RIGHTS RESERVED.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalComponent
        title={selectPolicy?.title}
        isOpen={isOpenInformation}
        closeModal={() => setIsOpenInformation(false)}
        className="policy-modal"
      >
        <div className="policy-modal-body">
          <p dangerouslySetInnerHTML={{ __html: selectPolicy?.content }} />
        </div>
      </ModalComponent>
    </>
  );
}
