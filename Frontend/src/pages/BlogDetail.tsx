import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlog, vote } from '@/action';
import type { Blog } from '@/action';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        const blog = await getBlog(slug);
        setBlog(blog);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleVote = async (type: 'like' | 'dislike') => {
    if (!blog) return;
    try {
      const voteType = blog.user_feedback === type ? null : type;
      const updated = await vote(blog, voteType);
      setBlog(updated);
    } catch (error) {
      alert('Voting failed. Please try again.');
    }
  };

  if (!blog) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 relative">
      {/* Blog Title */}
      <h1 className="text-3xl font-bold">{blog.title}</h1>

      {/* Blog content */}
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blog.content}
        </ReactMarkdown>
      </div>

      {/* Floating Feedback Buttons */}
      <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-full p-3 flex items-center gap-4 border z-50">
        <button
          onClick={() => handleVote('like')}
          className={`flex items-center gap-1 hover:text-green-600 transition ${
            blog.user_feedback === 'like' ? 'text-green-600 font-bold' : 'text-gray-700'
          }`}
        >
          <ThumbsUp size={20} /> {blog.like_count}
        </button>
        <button
          onClick={() => handleVote('dislike')}
          className={`flex items-center gap-1 hover:text-red-600 transition ${
            blog.user_feedback === 'dislike' ? 'text-red-600 font-bold' : 'text-gray-700'
          }`}
        >
          <ThumbsDown size={20} /> {blog.dislike_count}
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
