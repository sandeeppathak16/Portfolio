import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { getAllBlogs } from '/src/action';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const blogs = await getAllBlogs();
      const found = blogs.find((b) => b.slug === slug);
      setBlog(found);
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
