// ShareSmallBiz API data models — mirrors the types defined at api.sharesmallbiz.com

export interface UserModel {
  id: string;
  email: string;
  userName: string;
  displayName: string;
  firstName: string;
  lastName: string;
  bio: string;
  websiteUrl: string;
  profilePictureUrl: string;
  profileViewCount: number;
  likeCount: number;
  postCount: number;
  isEmailConfirmed: boolean;
  isLockedOut: boolean;
  roles: string[];
  lastLogin: string | null;
  loginCount: number;
  posts: DiscussionModel[];
}

export interface ProfileAnalytics {
  totalViews: number;
  recentViews: Record<string, number>;
  geoDistribution: Record<string, number>;
  engagement: {
    followerCount: number;
    newFollowers: number;
    totalLikes: number;
    recentLikes: number;
  };
}

export interface ProfileModel extends UserModel {
  analytics: ProfileAnalytics | null;
  publicUsers: UserModel[];
}

export interface DiscussionModel {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover: string;
  isPublic: boolean;
  isFeatured: boolean;
  postType: number;
  postViews: number;
  rating: number;
  published: string;
  createdDate: string;
  modifiedDate: string | null;
  tags: string[];
  creator: UserModel | null;
  comments: PostCommentModel[];
  likes: LikeModel[];
  media: MediaModel[];
}

export interface LikeModel {
  userId: string;
  postId: number;
}

export interface PostCommentModel {
  id: number;
  postId: number;
  content: string;
  likeCount: number;
  createdDate: string;
  modifiedDate: string | null;
  author: {
    id: string;
    userName: string;
    displayName: string;
    profilePictureUrl: string;
  } | null;
  likes: LikeModel[];
}

export interface KeywordModel {
  id: number;
  name: string;
  description: string;
  postCount: number;
}

export interface MediaModel {
  id: number;
  fileName: string;
  description: string;
  attribution: string;
  url: string;
  contentType: string;
  fileSize: number;
  mediaType: number; // 0=Image, 1=Video, 2=Audio, 3=Document
  storageProvider: number; // 0=LocalStorage, 1=External, 2=YouTube, 3=Unsplash
  storageMetadata: string;
  userId: string;
  postId: number | null;
  commentId: number | null;
  createdDate: string;
  modifiedDate: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginResponse {
  token: string;
  userId: string;
  displayName: string;
}

export interface ApiError {
  message: string;
}
