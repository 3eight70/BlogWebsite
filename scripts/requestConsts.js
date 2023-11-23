const site = "https://blog.kreosoft.space/api";

export const register = `${site}/account/register`;
export const login = `${site}/account/login`;
export const logout = `${site}/account/logout`;
export const editProfile = `${site}/account/profile`;
export const getProfile = `${site}/account/profile`;

export const getTagList = `${site}/tag`;

export const getPosts = `${site}/post`;
export const createPost = `${site}/post`;
export const getInfoPost = (id) => `${site}/post/${id}`;
export const addLike = (postId) => `${site}/post/${postId}/like`;
export const delLike = (postId) => `${site}/post/${postId}/like`;

export const getCommunities = `${site}/community`;
export const getUsersCommunities = `${site}/community/my`;
export const getInfoCommunity = (id) => `${site}/community/${id}`;
export const getCommunitiesPosts = (id) => `${site}/community/${id}/post`;
export const createPostInCommunity = (id) => `${site}/community/${id}/post`;
export const getTheGreatestUserRole = (id) => `${site}/community/${id}/role`;
export const subscribeUser = (id) => `${site}/community/${id}/subscribe`;
export const unsubscribeUser = (id) => `${site}/community/${id}/unsubscribe`;

export const getAllNestedComments = (id) => `${site}/comment/${id}/tree`;
export const addCommentToConcretePost = (id) => `${site}/post/${id}/comment`;
export const editComment = (id) => `${site}/comment/${id}`;
export const delComment = (id) => `${site}/comment/${id}`;

export const getAuthorsList = `${site}/author/list`;

export const searchAddress = `${site}/address/search`;
export const getAddressChain = `${site}/address/chain`;

export const postCardHtml = `../../pages/postCard.html`;
export const templates = `../../pages/templates.html`;
