import { useCallback, useState } from 'react';

const useToggleModal = (initIsOpen = false) => {
  const [isOpen, setIsOpen] = useState(initIsOpen);

  const onToggle = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, []);
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    onToggle,
    onClose,
  };
};
export default useToggleModal;
