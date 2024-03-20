import React from 'react';
import ModifyPersonalForm from './components/ModifyPersonalForm';
// import Container from '../../../components/Container';

import '../../../styles/my-page/modify-personal-info.scss';

function index() {
  return (
    <div className="modify-personal">
      {/* <Container className="px-6"> */}
        <div className="modify-personal-content">
          <ModifyPersonalForm />
        </div>
      {/* </Container> */}
    </div>
  );
}

export default index;
