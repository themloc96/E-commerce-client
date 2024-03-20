import { boardPerPageDefault } from '../components/Pagination/configPagination';
import { clientRequest } from '../utils/Request';

export const searchPostFn = async ({
  page,
  channel,
  inform = false,
  title,
  category = undefined,
  size = boardPerPageDefault,
  sort,
}) => {
  const orderSort = sort === 'SORT_DESC' ? 'SORT_DESC' : '';

  const paramQuery = {
    PAGE: page,
    SIZE: size,
    CHANNEL: channel,
    INFORM_STATUS: inform,
    TITLE: title,
    CATEGORY: category,
  };

  const response = await clientRequest.get(`v1/post/search?${orderSort}`, {
    params: paramQuery,
  });
  return response;
};

export const getPostDetailFn = async (postId, channelType, categoryType) => {
  const paramQuery = {
    channel: channelType,
    category: categoryType,
  };
  const response = await clientRequest.get(`v1/post/detail/${postId}`, {
    params: paramQuery,
  });
  return response;
};

export const getLikesFn = async (postId, likeStatus) => {
  const paramQuery = {
    status: likeStatus,
  };
  const response = await clientRequest.get(`v1/post/likes/${postId}`, {
    params: paramQuery,
  });
  return response;
};

export const creaetCommentFn = async (postId, comment) => {
  const paramQuery = {
    content: comment,
  };
  const response = await clientRequest.get(
    `v1/post/comment/created/${postId}`,
    { params: paramQuery },
  );
  return response;
};

export const updateCommentFn = async (commentId, comment) => {
  const paramQuery = {
    content: comment,
  };
  const response = await clientRequest.get(
    `v1/post/comment/updated/${commentId}`,
    { params: paramQuery },
  );
  return response;
};

export const deleteCommentFn = async commentId => {
  const response = await clientRequest.get(
    `v1/post/comment/deleted/${commentId}`,
  );
  return response;
};

export const createdPostFn = async newPost => {
  const response = await clientRequest.post('v1/post/created', newPost);
  return response;
};

export const updatedPostFn = async (postId, updatePost) => {
  const response = await clientRequest.post(
    `v1/post/updated/${postId}`,
    updatePost,
  );
  return response;
};

export const deletePostFn = async postId => {
  const response = await clientRequest.post(`v1/post/deleted/${postId}`);
  return response;
};

export const uploadCommunityFilesFn = async formData => {
  const response = await clientRequest.post(
    'v1/file/upload/community',
    formData,
  );
  return response;
};
