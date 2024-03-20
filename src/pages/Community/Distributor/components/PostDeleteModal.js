import { useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useOnClickOutside } from '../../../../hooks';
import ModalComponent from '../../../../components/core/modal-base';
import '../../../../styles/community/distributor/distributor-create.scss';
import { deletePostFn } from '../../../../apis/post.api';

function PostDeleteModal(props) {
  const navigate = useNavigate();
  const { isOpen, onClose, deletePostId, postChannl } = props;
  const ref = useRef();

  useOnClickOutside(ref, () => onClose());

  const { mutate: deletedPost } = useMutation(postId => deletePostFn(postId), {
    onSuccess: data => {
      if (postChannl === 'quality') {
        navigate('/as/quality');
        return;
      }
      navigate(`/community/${postChannl}`);
    },
    onError: error => {
      console.log(error);
    },
  });

  return (
    <ModalComponent
      refs={ref}
      className="post-delete-modal"
      isOpen={isOpen}
      closeModal={onClose}
    >
      <h3 className="post-delete-modal-title">게시물을 삭제하시겠습니까?</h3>
      <div>
        <button
          className="post-delete-modal-close-btn"
          onClick={() => onClose()}
        >
          <span>취소</span>
        </button>
        <button
          className="post-delete-modal-delete-btn"
          onClick={() => deletedPost(deletePostId)}
        >
          <span>삭제</span>
        </button>
      </div>
    </ModalComponent>
  );
}

export default PostDeleteModal;
