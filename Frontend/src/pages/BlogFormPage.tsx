import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { createOrUpdateBlog, getAllBlogs } from '@/action';
import type { Blog, BlogInput } from '@/action';

const BlogFormPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (slug) {
      setIsEdit(true);
      const fetch = async () => {
        const blogs = await getAllBlogs();
        const blog = blogs.find((b: Blog) => b.slug === slug);
        if (blog) {
          setTitle(blog.title);
          setTags(blog.tags);
          setContent(blog.content);
        }
      };
      fetch();
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const payload: BlogInput = {
          title,
          tags,
          content,
          slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        };

      try {
        await createOrUpdateBlog(payload, isEdit);
        navigate('/');
      } catch (err) {
        console.error('❌ Failed to submit blog:', err);
        alert('Something went wrong while submitting the blog.');
      }
    };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {isEdit ? 'Edit Blog' : 'Create Blog'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <RichTextEditor value={content} onChange={(val: string) => setContent(val || '')} />
        <div className="text-right">
          <Button type="submit">{isEdit ? 'Update' : 'Create'} Blog</Button>
        </div>
      </form>
    </div>
  );
};

export default BlogFormPage;
