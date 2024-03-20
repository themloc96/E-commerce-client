import '../../styles/components/drawer-menu.scss';
import { Link } from 'react-router-dom';

// component
import Collapse from './menu-collapse';

// context
import { useAuthContext } from '../../contexts/AuthProvider';

// utils
import { formatNumber, callComingSoon } from '../../utils/helpers';

// constants
import { businessType } from '../../constants';

export default function DrawerMenu(props) {
  const { handleGetListSubmenu, setOpenMenu } = props;
  const authCtx = useAuthContext();
  const { state } = authCtx;
  const { mileagePoint, currentUser } = state;
  return (
    <div className="drawer-menu">
      <div className="drawer-menu-content">
        <div className="money-field">
          <Link to="/mileage">
            <div className="money">
              <div>P</div>
              <span className="font-roboto">{formatNumber(mileagePoint)}</span>
            </div>
          </Link>
        </div>
        <Collapse title="상품주문">
          <div className="menu-collapse-content">
            {/* <p>Keyin 스마트락</p>
            <p>Ark 도어락</p>
            <p>기타</p> */}
            {handleGetListSubmenu('product-order')?.map(t => {
              return (
                <p key={t.value}>
                  <Link onClick={() => setOpenMenu(false)} to={t.link}>
                    {t.text}
                  </Link>
                </p>
              );
            })}
          </div>
        </Collapse>
        <Collapse title="커뮤니티">
          <div className="menu-collapse-content">
            {/* <p>라오나크 이야기</p>
            <p>이달의 인터뷰</p>
            <p>대리점 소식</p>
            <p>품질 게시판</p> */}
            {handleGetListSubmenu('community')?.map(t => {
              return (
                // todo: 2차 개발 범위
                <p key={t.value}>
                  {/* <button onClick={() => alert('페이지 준비중 입니다.')}>
                    {t.text}
                  </button> */}
                  <Link onClick={() => setOpenMenu(false)} to={t.link}>
                    {t.text}
                  </Link>
                  {/* set coming soon for this phase */}
                  {/* <Link onClick={() => callComingSoon()}>{t.text}</Link> */}
                </p>
              );
            })}
          </div>
        </Collapse>
        {/* todo: 권한 해제 */}
        {currentUser?.businessType === 'AS_AGENCY' &&
          (currentUser?.asengineer ||
            currentUser?.memberType === 'ACCOUNT' ||
            currentUser?.previousMemberType === 'ACCOUNT') && (
            <Collapse title="A/S관리">
              <div className="menu-collapse-content">
                {/* <p>A/S 현황</p>
            <p>재고 조회</p>
            <p>자재출고</p>
            <p>자재반납</p>
            <p>품질 게시판</p> */}
                {handleGetListSubmenu('a-s-management')?.map(t => {
                  return (
                    <p key={t.value}>
                      <Link onClick={() => setOpenMenu(false)} to={t.link}>
                        {t.text}
                      </Link>
                    </p>
                  );
                })}
              </div>
            </Collapse>
          )}
        <Link onClick={() => setOpenMenu(false)} to="/my-page">
          <Collapse title="마이페이지" />
        </Link>
      </div>
    </div>
  );
}
