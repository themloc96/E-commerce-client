import React from 'react';

import { Input } from '../../../components/Input';
import { useTogglePortal } from './hooks';
import InstallationProductsPortal from './InstallationProductsPortal';
import InstallationProductsModal from './InstallationProductsModal';
import { useToggleModal, useWindowDimensions } from '../../../hooks';

function InputModel({ register, errors, setValue }) {
  const { width } = useWindowDimensions();
  const { isOpen, onToggle, onClose } = useToggleModal();
  const { isPortalOpen, togglePortal } = useTogglePortal();

  const isDesktop = width > 768;
  const onClickToModelName = data => {
    if (isDesktop) {
      onToggle();
    } else {
      togglePortal();
    }
  };
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!isPortalOpen ? (
        <Input
          classes="!w-[187px] md:!w-[194px] h-[35px] md:h-[60px] !mt-0 md:!mt-2"
          label=""
          name="modelName"
          type="text"
          onClick={onClickToModelName}
          register={register}
          helperText={errors.modelName?.message}
          error={!!errors.modelName}
          readOnly
        />
      ) : (
        <InstallationProductsPortal
          onClose={togglePortal}
          isOpen={isPortalOpen}
          setValue={setValue}
        />
      )}
      <InstallationProductsModal
        setValue={setValue}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}

export default InputModel;
