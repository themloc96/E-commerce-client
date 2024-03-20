import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// COMPs
import Container from '../../../components/Container';
import CreateCustomerForm from './components/CreateCustomerForm';
// STYLEs
import '../../../styles/customer/new.scss';

import { createCustomerFn } from '../../../apis/customer.api';
import { useToggleModal, useWindowDimensions } from '../../../hooks';
import InstallationProductsModal from '../InstallationProducts/InstallationProductsModal';
import InstallationProductsPortal from '../InstallationProducts/InstallationProductsPortal';
import { useTogglePortal } from '../InstallationProducts/hooks';

function CreateCustomerPage() {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { isOpen, onToggle, onClose } = useToggleModal();
  const { isPortalOpen, togglePortal } = useTogglePortal();

  const isDesktop = width > 768;

  // API create mutation
  const { mutate: createCustomer, isLoading } = useMutation(
    userData => createCustomerFn(userData),
    {
      onSuccess: () => {
        navigate('/my-page#customer');
      },
    },
  );

  return (
    <div className="customer" id="customer">
      <Container>
        {isDesktop && (
          <div className="customer-heading-wrap">
            <button onClick={() => navigate(-1)}>
              <img src="/assets/icons/back.png" alt="back button" />
            </button>
            <h2 className="customer-heading">신규 고객 등록</h2>
          </div>
        )}
        <CreateCustomerForm
          createCustomer={createCustomer}
          isLoading={isLoading}
        />
      </Container>
    </div>
  );
}

export default CreateCustomerPage;
