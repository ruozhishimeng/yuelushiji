import { api } from "./client";
import { getLocalCommunityPosts, LOCAL_COMMUNITY_POSTS } from "./demoFallback";

export async function getCommunityPosts({ category, sort, limit, offset } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  if (limit != null) params.set("limit", String(limit));
  if (offset != null) params.set("offset", String(offset));
  const qs = params.toString();
  try {
    return await api.get("/community/posts" + (qs ? "?" + qs : ""));
  } catch (error) {
    console.warn("[communityApi] fallback to local demo posts:", error.message);
    return getLocalCommunityPosts({ category, limit, offset });
  }
}

export async function getCommunityPost(id) {
  try {
    return await api.get("/community/posts/" + id);
  } catch (error) {
    const post = LOCAL_COMMUNITY_POSTS.find((item) => item.id === id);
    if (post) return post;
    throw error;
  }
}
