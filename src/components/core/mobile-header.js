import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '../../styles/components/mobile-header.module.scss';
import Container from '../Container';

function MobileHeader({ name, onBack = null }) {
  const navigate = useNavigate();
  const handleOnBack = () => {
    return onBack ? onBack() : navigate(-1);
  };
  return (
    <div className={styles.wrapper} id="mobile-header">
      <Container>
        <div className={styles.content}>
          <button onClick={handleOnBack}>
            <img src="/assets/icons/back.png" alt="back button" />
          </button>
          <h3 className="f18Medium">{name}</h3>
        </div>
      </Container>
      <div className={styles.line} />
    </div>
  );
}
MobileHeader.propTypes = {
  name: PropTypes.string.isRequired,
};
export default MobileHeader;
