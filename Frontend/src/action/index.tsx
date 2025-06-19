import { BlogAPI, ContactAPI } from '@/api';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  tags?: string;
  content: string;
  created_at: string;
  like_count: number;
  dislike_count: number;
  user_feedback: 'like' | 'dislike' | null;
}

export type BlogInput = {
  title: string;
  slug: string;
  tags?: string;
  content: string;
};

export const getAllBlogs = async () => {
  return await BlogAPI.getAll();
};

export const getBlog = async (slug: string) => {
    return await BlogAPI.getOne(slug)
};

export const createOrUpdateBlog = async (
  blog: BlogInput,
  isEdit: boolean
) => {
  if (isEdit && blog.slug) {
    return await BlogAPI.update(blog.slug, blog);
  } else {
    const generatedSlug = blog.title.toLowerCase().replace(/\s+/g, '-');
    return await BlogAPI.create({ ...blog, slug: generatedSlug });
  }
};

export const submitContactMessage = async (contact: { email: string; message: string }) => {
  const name = contact.email.split('@')[0];
  const payload = { ...contact, name };

  return await ContactAPI.send(payload);
};

export const handleDelete = async (
  slug: string,
  setBlogs: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const confirmDelete = confirm('Are you sure you want to delete this blog?');
  if (!confirmDelete) return;

  try {
    await BlogAPI.delete(slug);
    setBlogs((prev) => prev.filter((b) => b.slug !== slug));
  } catch (error) {
    console.error('❌ Failed to delete blog:', error);
    alert('Something went wrong while deleting.');
  }
};


export const vote = async (
  blog: Blog,
  voteType: 'like' | 'dislike' | null
): Promise<Blog> => {
  if (blog.user_feedback === voteType) return blog; // No change

  await BlogAPI.vote(blog.slug, voteType); // Send null if toggling off

  let newLikeCount = blog.like_count;
  let newDislikeCount = blog.dislike_count;

  if (voteType === null) {
    if (blog.user_feedback === 'like') newLikeCount -= 1;
    if (blog.user_feedback === 'dislike') newDislikeCount -= 1;
  } else if (voteType === 'like') {
    newLikeCount += 1;
    if (blog.user_feedback === 'dislike') newDislikeCount -= 1;
  } else if (voteType === 'dislike') {
    newDislikeCount += 1;
    if (blog.user_feedback === 'like') newLikeCount -= 1;
  }

  return {
    ...blog,
    like_count: newLikeCount,
    dislike_count: newDislikeCount,
    user_feedback: voteType,
  };
};
