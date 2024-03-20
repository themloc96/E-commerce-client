/* eslint-disable react/require-default-props */
import React, { forwardRef, useRef } from 'react';

import ModalComponent from '../core/modal-base';
import { useOnClickOutside } from '../../hooks';
import '../../styles/components/confirmation-modal.scss';
import Button from '../Button';

function ConfirmationModal(props) {
  const { isOpen, onClose, title, onConfirm, formId } = props;
  const ref = useRef();

  useOnClickOutside(ref, () => onClose());

  return (
    <ModalComponent
      refs={ref}
      className="confirmation-modal"
      isOpen={isOpen}
      closeModal={onClose}
    >
      <h3 className="confirmation-modal-title">{title}</h3>
      <div className="flex gap-[8px] md:gap-[18px]">
        <Button className="flex-1" onClick={onClose}>
          <span>취소</span>
        </Button>
        <Button variant="outline-gray" className="flex-1" onClick={onConfirm} form={formId}>
          <span>확인</span>
        </Button>
      </div>
    </ModalComponent>
  );
}

ConfirmationModal.propTypes = {
  title: 'Are you sure confim this?',
  onClose: () => {},
  isOpen: false,
};

export default forwardRef(ConfirmationModal);
