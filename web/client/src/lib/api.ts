// ShareSmallBiz API client
// Base URL: https://api.sharesmallbiz.com
// Docs:     https://api.sharesmallbiz.com/scalar/v1

import type {
  LoginResponse,
  UserModel,
  ProfileModel,
  DiscussionModel,
  PostCommentModel,
  KeywordModel,
  MediaModel,
  PagedResult,
} from "@shared/schema";

const BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "https://api.sharesmallbiz.com";

const TOKEN_KEY = "ssb_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const message =
      Array.isArray(err)
        ? err.map((e: { description: string }) => e.description).join(", ")
        : (err as { message?: string }).message ?? "API error";
    throw Object.assign(new Error(message), { status: res.status });
  }

  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

// ──────────────────────────────────────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────────────────────────────────────

async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

async function register(
  email: string,
  password: string,
  displayName: string,
  firstName: string,
  lastName: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName, firstName, lastName }),
  });
}

function logout(): void {
  clearToken();
}

// ──────────────────────────────────────────────────────────────────────────────
// Profiles
// ──────────────────────────────────────────────────────────────────────────────

function getProfiles(): Promise<UserModel[]> {
  return apiFetch<UserModel[]>("/api/profiles");
}

function getProfile(slug: string): Promise<ProfileModel> {
  return apiFetch<ProfileModel>(`/api/profiles/${slug}`);
}

function getProfileFollowers(slug: string): Promise<UserModel[]> {
  return apiFetch<UserModel[]>(`/api/profiles/${slug}/followers`);
}

function getProfileFollowing(slug: string): Promise<UserModel[]> {
  return apiFetch<UserModel[]>(`/api/profiles/${slug}/following`);
}

function followProfile(slug: string): Promise<null> {
  return apiFetch<null>(`/api/profiles/${slug}/follow`, { method: "POST" });
}

function unfollowProfile(slug: string): Promise<null> {
  return apiFetch<null>(`/api/profiles/${slug}/unfollow`, { method: "POST" });
}

// ──────────────────────────────────────────────────────────────────────────────
// Discussions
// ──────────────────────────────────────────────────────────────────────────────

function getDiscussions(onlyPublic = true): Promise<DiscussionModel[]> {
  return apiFetch<DiscussionModel[]>(`/api/discussion?onlyPublic=${onlyPublic}`);
}

function getDiscussion(id: number): Promise<DiscussionModel> {
  return apiFetch<DiscussionModel>(`/api/discussion/${id}`);
}

function getPagedDiscussions(
  pageNumber = 1,
  pageSize = 20,
  sortType = 0
): Promise<PagedResult<DiscussionModel>> {
  return apiFetch<PagedResult<DiscussionModel>>(
    `/api/discussion/paged?pageNumber=${pageNumber}&pageSize=${pageSize}&sortType=${sortType}`
  );
}

function getFeaturedDiscussions(count: number): Promise<DiscussionModel[]> {
  return apiFetch<DiscussionModel[]>(`/api/discussion/featured/${count}`);
}

function getMostRecentDiscussions(count: number): Promise<DiscussionModel[]> {
  return apiFetch<DiscussionModel[]>(`/api/discussion/most-recent/${count}`);
}

function getMostPopularDiscussions(count: number): Promise<DiscussionModel[]> {
  return apiFetch<DiscussionModel[]>(`/api/discussion/most-popular/${count}`);
}

function createDiscussion(
  model: Partial<DiscussionModel>
): Promise<DiscussionModel> {
  return apiFetch<DiscussionModel>("/api/discussion", {
    method: "POST",
    body: JSON.stringify(model),
  });
}

function updateDiscussion(
  id: number,
  model: Partial<DiscussionModel>
): Promise<null> {
  return apiFetch<null>(`/api/discussion/${id}`, {
    method: "PUT",
    body: JSON.stringify(model),
  });
}

function deleteDiscussion(id: number): Promise<null> {
  return apiFetch<null>(`/api/discussion/${id}`, { method: "DELETE" });
}

function likeDiscussion(id: number): Promise<null> {
  return apiFetch<null>(`/api/discussion/${id}/like`, { method: "POST" });
}

// ──────────────────────────────────────────────────────────────────────────────
// Comments
// ──────────────────────────────────────────────────────────────────────────────

function getComments(postId: number): Promise<PostCommentModel[]> {
  return apiFetch<PostCommentModel[]>(`/api/comments?postId=${postId}`);
}

function addComment(
  postId: number,
  content: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/comments", {
    method: "POST",
    body: JSON.stringify({ postId, content }),
  });
}

function editComment(id: number, content: string): Promise<null> {
  return apiFetch<null>(`/api/comments/${id}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

function deleteComment(id: number): Promise<null> {
  return apiFetch<null>(`/api/comments/${id}`, { method: "DELETE" });
}

// ──────────────────────────────────────────────────────────────────────────────
// Keywords
// ──────────────────────────────────────────────────────────────────────────────

function getKeywords(): Promise<KeywordModel[]> {
  return apiFetch<KeywordModel[]>("/api/keywords");
}

// ──────────────────────────────────────────────────────────────────────────────
// Users
// ──────────────────────────────────────────────────────────────────────────────

function getUser(userId: string): Promise<UserModel> {
  return apiFetch<UserModel>(`/api/users/${userId}`);
}

function getUserByUsername(username: string): Promise<UserModel> {
  return apiFetch<UserModel>(`/api/users/username/${username}`);
}

function updateUser(userId: string, model: Partial<UserModel>): Promise<string> {
  return apiFetch<string>(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(model),
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Media
// ──────────────────────────────────────────────────────────────────────────────

function getMedia(params: Record<string, string | number> = {}): Promise<MediaModel[]> {
  const q = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = String(v);
      return acc;
    }, {})
  ).toString();
  return apiFetch<MediaModel[]>(`/api/media${q ? "?" + q : ""}`);
}

function uploadMedia(
  file: File,
  description = "",
  attribution = ""
): Promise<MediaModel> {
  const form = new FormData();
  form.append("file", file);
  form.append("description", description);
  form.append("attribution", attribution);
  return apiFetch<MediaModel>("/api/media/upload", {
    method: "POST",
    body: form,
  });
}

function deleteMedia(id: number): Promise<null> {
  return apiFetch<null>(`/api/media/${id}`, { method: "DELETE" });
}

function uploadProfilePicture(
  file: File
): Promise<{ profilePictureUrl: string; mediaId: number }> {
  const form = new FormData();
  form.append("file", file);
  return apiFetch("/api/media/profile/upload", {
    method: "POST",
    body: form,
  });
}

function setExternalProfilePicture(
  url: string,
  description = ""
): Promise<{ profilePictureUrl: string; mediaId: number }> {
  return apiFetch("/api/media/profile/external", {
    method: "POST",
    body: JSON.stringify({ url, description }),
  });
}

function removeProfilePicture(): Promise<null> {
  return apiFetch<null>("/api/media/profile", { method: "DELETE" });
}

// ──────────────────────────────────────────────────────────────────────────────
// Exported API object
// ──────────────────────────────────────────────────────────────────────────────

export const api = {
  auth: { login, register, logout },
  profiles: {
    getProfiles,
    getProfile,
    getProfileFollowers,
    getProfileFollowing,
    followProfile,
    unfollowProfile,
  },
  discussion: {
    getDiscussions,
    getDiscussion,
    getPagedDiscussions,
    getFeaturedDiscussions,
    getMostRecentDiscussions,
    getMostPopularDiscussions,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    likeDiscussion,
  },
  comments: { getComments, addComment, editComment, deleteComment },
  keywords: { getKeywords },
  users: { getUser, getUserByUsername, updateUser },
  media: {
    getMedia,
    uploadMedia,
    deleteMedia,
    uploadProfilePicture,
    setExternalProfilePicture,
    removeProfilePicture,
  },
};
