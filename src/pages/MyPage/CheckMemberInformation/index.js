import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import '../../../styles/my-page/checkmemberinformation.scss';
import { useWindowDimensions } from '../../../hooks';
import { checkPasswordFn } from '../../../apis/auth.api';
/**
 * Page
 */

function Page() {
  function Style() {
    return (
      <style>
        {`
            .keyin-parent{ background-color: #FFFFFF;display: flex;flex-direction: column;overflow:hidden;}
            #main{background-color: #FFFFFF}

            @media(max-width:768px){
              .keyin-parent{background-color: #f5f7fb;}
            }
          `}
      </style>
    );
  }
  // snackBar
  // const { enqueueSnackbar } = useSnackbar();
  const { width } = useWindowDimensions();
  const [password, setPassword] = useState('');
  const [isSubmited, setIsSubmited] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (width < 1024) {
      document.getElementById('footer').style.display = 'none';
    }
  }, []);
  // #region
  const { mutate: checkPassword } = useMutation(
    userData => checkPasswordFn(userData),
    {
      onSuccess: data => {
        setIsSubmited(true);
        navigate('/my-page/modify-personal-info');
      },
      onError: () => {
        setIsSubmited(false);
        // enqueueSnackbar('Invalid password!', {
        //   variant: 'error',
        // });
      },
    },
  );
  // #endregion
  const hanldeSubmit = () => {
    const result = password.length > 0;

    if (result) {
      checkPassword({ password });
    } else {
      setIsSubmited(false);
    }
    // if (result) {
    //   navigate('/my-page/modify-personal-info');
    // }
  };
  return (
    <>
      <Style />
      <main className="check-member-information keyin-parent">
        <div className="keyin-container">
          <div className="form-checkmember">
            <div className="title">회원정보 확인</div>
            <p>
              회원 정보를 안전하게 보호하기 위해
              <br />
              비밀번호를 다시 한번 확인 합니다.
            </p>
            <div className="password">비밀번호</div>
            <div className="form-row">
              <input
                type="password"
                id="pwd"
                name="pwd"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  border:
                    isSubmited === false ? '1px solid red' : '1px solid black',
                }}
              />
              {isSubmited === false && (
                <p className="!f12Regular md:!f16Regular !mt-[10px]">
                  비밀번호를 확인해 주세요.
                </p>
              )}
            </div>
            <div className="button">
              <button type="" className="btn-01" onClick={() => navigate(-1)}>
                취소
              </button>
              <button type="" className="btn-02" onClick={hanldeSubmit}>
                확인
              </button>
            </div>
          </div>
          <div className="button-mobile">
            <button type="" className="btn-01" onClick={() => navigate(-1)}>
              취소
            </button>
            <button type="" className="btn-02" onClick={e => hanldeSubmit(e)}>
              확인
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default Page;
