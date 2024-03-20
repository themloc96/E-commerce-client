import React from 'react';
// notistack
import { useSnackbar } from 'notistack';

// context
import { useAuthContext } from '../../contexts/AuthProvider';

// styles
import orderStyles from '../../styles/components/share-popover.module.scss';

// utils
import { copyLink } from '../../utils/helpers';

// routes
import { SIGN_UP_REPRESENTATIVE } from '../routes/Routes';

function SharePopoverContent({ onClose, handleCopyKakaotalk }) {
  const { state } = useAuthContext();
  const { currentUser } = state;
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCopyReferralCode = (event, value) => {
    event.preventDefault();
    alert('링크가 복사 되었습니다.');
    copyLink(value);
    onClose(event);
  };

  return (
    <div className={orderStyles['popover-share']}>
      <div className={orderStyles['popover-header']}>
        <button
          style={{
            padding: '0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="svg-close"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.121 3 3 5.121l7.071 7.072-7.07 7.07 2.12 2.122 7.072-7.071 7.07 7.07 2.122-2.12-7.071-7.071 7.071-7.071L19.264 3l-7.071 7.071L5.12 3z"
              fill="#1C1C1C"
            />
          </svg>
        </button>
      </div>
      <div className={orderStyles['popover-title']}>
        <span>공유하기</span>
      </div>
      <div className={orderStyles['action-share']}>
        <button
          className={orderStyles.kakaotalk}
          onClick={event => handleCopyKakaotalk(event, '')}
        >
          <img src="/assets/app/kakaotalk.svg" alt="" />
          <span>카카오톡</span>
        </button>
        <button
          className={orderStyles.link}
          onClick={event =>
            handleCopyReferralCode(
              event,
              `${SIGN_UP_REPRESENTATIVE}?referralCode=${currentUser?.referralCode}`,
            )
          }
        >
          <img src="/assets/icons/link.svg" alt="" />
          <span>링크복사</span>
        </button>
      </div>
    </div>
  );
}

export default SharePopoverContent;
