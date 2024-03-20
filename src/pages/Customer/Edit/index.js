import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// COMPs
import Container from '../../../components/Container';
import FullScreenLoader from '../../../components/Loading/FullScreenLoader';
import EditCustomerForm from './components/EditCustomerForm';
// STYLEs
import '../../../styles/customer/new.scss';

import {
  getCustomerByIdFn,
  updateCustomerFn,
} from '../../../apis/customer.api';
import { useWindowDimensions } from '../../../hooks';

function EditCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  // Fetch item
  const { data, isLoading } = useQuery([`v1/business/client/${id}`], () =>
    getCustomerByIdFn(id),
  );

  // API create mutation
  const { mutate: updateCustomer, isLoading: isLoadingMutate } = useMutation(
    customerData => updateCustomerFn(customerData, id),
    {
      onSuccess: () => {
        navigate('/my-page#customer');
      },
    },
  );

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="customer" id="customer">
      <Container>
        {isDesktop && (
          <div className="customer-heading-wrap">
            <button onClick={() => navigate(-1)}>
              <img src="/assets/icons/back.png" alt="back button" />
            </button>
            <h2 className="customer-heading">고객 정보 수정</h2>
          </div>
        )}
        <EditCustomerForm
          isLoading={isLoadingMutate}
          updateCustomer={updateCustomer}
          customer={data}
        />
      </Container>
    </div>
  );
}

export default EditCustomerPage;
