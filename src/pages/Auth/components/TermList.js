/* eslint-disable react/no-danger */
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { terms } from '../contants';
import { getTermsFn } from '../../../apis/term.api';
import { IndCheckbox } from '../../../components/WTable/IndCheckbox';
import ModalComponent from '../../../components/core/modal-base';

function TermList({
  onChangeChecked,
  error,
  onHandleOpenTerm,
  register,
  setValue,
  clearErrors,
  fieldName,
  termList,
  setTermList,
}) {
  const [isOpenContent, setIsOpenContent] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState();

  useQuery(['v1/terms/list'], getTermsFn, {
    keepPreviousData: true,
    onSuccess: data => {
      const newTermList = [];
      data?.data?.list?.forEach(item => {
        termList?.forEach(item2 => {
          if (item?.id === item2.id) {
            newTermList.push({ ...item2, content: item?.content });
          }
        });
      });
      setTermList(newTermList);
    },
  });

  const handleCheckAll = event => {
    const newTermList = termList.map(item => ({
      ...item,
      checked: event.target.checked,
    }));
    setTermList(newTermList);
    if (onChangeChecked) {
      onChangeChecked(event.target.checked);
    }
  };
  const handleChangeChecked = (event, id) => {
    const isChecked = event?.target?.checked;
    setSelectedTerm(prev => ({ ...prev, checked: isChecked }));
    setTermList(() => {
      const items = termList.map(item => {
        if (item.id === id) {
          return { ...item, checked: isChecked };
        }
        return item;
      });
      if (onChangeChecked) {
        onChangeChecked(
          items.every(item => {
            return item.checked;
          }),
        );
      }
      return items;
    });
  };
  const isCheckedAll = termList?.every(item => {
    return item.checked;
  });
  useEffect(() => {
    clearErrors(fieldName);
    if (
      termList?.filter(item => item.isRequired)?.every(item => item.checked)
    ) {
      setValue(fieldName, true);
    } else {
      setValue(fieldName, null);
    }
  }, [termList]);

  return (
    <>
      <p className="sign-up-label">약관 동의</p>
      <div>
        <div
          className={`sign-up-input checkbox-list ${
            error ? '!border-error' : ''
          }`}
        >
          <input
            className="styled-checkbox"
            id="termAll"
            type="checkbox"
            value="value2"
            onChange={handleCheckAll}
            checked={isCheckedAll}
            readOnly
          />

          <label htmlFor="termAll">전체 동의</label>
        </div>
        <div
          className={`sign-up-input checkbox-rest ${
            error ? '!border-error' : ''
          }`}
        >
          {termList?.map(term => {
            return (
              <div key={term.id} className="other-checkbox">
                <input
                  className="styled-checkbox policy-checkbox"
                  id={term.id}
                  type="checkbox"
                  value="value2"
                  onClick={e => handleChangeChecked(e, term.id)}
                  checked={term.checked}
                  readOnly
                />
                <label htmlFor={term.id}>{term?.title}</label>
                <button
                  onClick={e => {
                    e.preventDefault();
                    setIsOpenContent(true);
                    setSelectedTerm(term);
                  }}
                >
                  보기
                </button>
              </div>
            );
          })}
        </div>
        {error && (
          <p className="f12Regular md:f16Regular text-error mt-[10px] ml-[10px] md:ml-[0px]">
            {error?.message}
          </p>
        )}
      </div>
      <ModalComponent
        title={selectedTerm?.titleDisplay}
        isOpen={isOpenContent}
        closeModal={() => setIsOpenContent(false)}
        className="policy-modal"
      >
        <div className="policy-modal-body">
          <p dangerouslySetInnerHTML={{ __html: selectedTerm?.content }} />
        </div>
        <div className="policy-checkbox">
          <div>
            <IndCheckbox
              className="styled-checkbox"
              id="policy"
              type="checkbox"
              value="value2"
              checked={selectedTerm?.checked}
              onClick={e => handleChangeChecked(e, selectedTerm?.id)}
            />
            <label htmlFor="policy">{selectedTerm?.titleDisplay}</label>
          </div>
        </div>
      </ModalComponent>
    </>
  );
}

export default TermList;
