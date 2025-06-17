import { BlogAPI, ContactAPI } from '@/api';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  tags?: string;
  content: string;
  created_at: string;
}

export type BlogInput = Omit<Blog, 'id' | 'created_at'> & {
  content: string;
  slug: string;
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
