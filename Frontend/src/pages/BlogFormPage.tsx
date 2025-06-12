import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '/src/components/ui/input';
import { Button } from '/src/components/ui/button';
import RichTextEditor from '/src/components/ui/RichTextEditor';
import { getAllBlogs } from '/src/action';

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
        const blog = blogs.find((b) => b.slug === slug);
        if (blog) {
          setTitle(blog.title);
          setTags(blog.tags);
          setContent(blog.content);
        }
      };
      fetch();
    }
  }, [slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, tags, content };
    console.log(isEdit ? 'Updating blog:' : 'Creating blog:', payload);
    // Add create/update API call here
    navigate('/');
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
        <RichTextEditor value={content} onChange={(val) => setContent(val || '')} />
        <div className="text-right">
          <Button type="submit">{isEdit ? 'Update' : 'Create'} Blog</Button>
        </div>
      </form>
    </div>
  );
};

export default BlogFormPage;
