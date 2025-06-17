import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { getBlog } from '@/action';
import type { Blog } from '@/action';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const blog = await getBlog(slug || '');
      setBlog(blog);
    };

    fetchBlog();
  }, [slug]);

  if (!blog) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <MarkdownPreview source={blog.content} />
    </div>
  );
};

export default BlogDetail;
