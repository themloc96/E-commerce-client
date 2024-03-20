import Modal from 'react-modal';
import '../../styles/components/modal.css';

Modal.setAppElement('#root');
const customStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'white',
    boxShadow: '0 0 30px 0 #0000004d',
    padding: '16px',
    borderRadius: '10px',
    // maxHeight: '80vh',
    // overFlow: 'scroll',
  },
};

function ModalComponent(props) {
  const {
    title,
    children,
    closeModal,
    afterOpenModal,
    isOpen,
    className,
    closeColor,
    styleConfig,
    styleTitle,
  } = props;

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      className={className}
      isOpen={isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={!styleConfig ? customStyles : styleConfig}
      contentLabel="Example Modal"
    >
      <div className="custom-dialog">
        <div className="modal-header">
          <div className="title-modal" style={styleTitle && styleTitle}>
            {title}
          </div>
          {/* <img alt="close" onClick={closeModal} src="/assets/app/close.svg" /> */}
          <button
            style={{
              padding: '0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={closeModal}
            className="modal-close-button"
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
                fill={closeColor || '#1C1C1C'}
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </Modal>
  );
}

export default ModalComponent;
