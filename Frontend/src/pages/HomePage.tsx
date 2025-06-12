import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '/src/components/ui/card';
import { Button } from '/src/components/ui/button';
import { Input } from '/src/components/ui/input';
import { Textarea } from '/src/components/ui/textarea';
import { getAllBlogs, submitContactMessage } from '/src/action';
import { Pencil } from 'lucide-react';

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [contact, setContact] = useState({ email: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      }
    };
    fetchBlogs();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContactMessage(contact);
      console.log('Contact message submitted:', contact);
    } catch (err) {
      console.error('Failed to submit contact message:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Navbar */}
      <nav className="bg-black text-white px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center shadow-md">
        <h1 className="text-lg sm:text-xl font-bold">My Portfolio</h1>
        <div className="space-x-4 text-sm sm:text-base font-medium">
          <a href="#about" className="hover:text-gray-300">About</a>
          <a href="#blogs" className="hover:text-gray-300">Blogs</a>
          <a href="#contact" className="hover:text-gray-300">Contact</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-16 space-y-16">
        {/* About Section */}
        <section id="about" className="max-w-2xl mx-auto text-center space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Welcome to My Portfolio</h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            I’m a passionate backend developer building fast, scalable apps. Explore my work and reach out!
          </p>
        </section>

        {/* Blog Section */}
        <section id="blogs" className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center">Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog) => (
              <div className="relative group" key={blog.id}>
                <Card
                  onClick={() => navigate(`/blogs/${blog.slug}`)}
                  className="cursor-pointer hover:shadow-xl transition-shadow h-full flex flex-col"
                >
                  <CardContent className="p-4 space-y-2 flex-grow">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{blog.title}</h3>
                    <p className="text-sm text-gray-500">Tags: {blog.tags || 'None'}</p>
                    <p className="text-xs text-gray-400">{new Date(blog.created_at).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
                <button
                  onClick={() => navigate(`/blogs/${blog.slug}/edit`)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full border opacity-0 group-hover:opacity-100 transition"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ))}

            {/* Create Blog Card */}
            <Card
              onClick={() => navigate('/blogs/create')}
              className="hover:shadow-xl border-2 border-dashed border-gray-300 cursor-pointer flex items-center justify-center h-40"
            >
              <CardContent className="text-gray-400 font-medium text-center">
                + Create New Blog
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">Contact Me</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4 sm:space-y-6 bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm">
            <Input
              type="email"
              placeholder="Your Email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              required
            />
            <Textarea
              rows={4}
              placeholder="Your Message"
              value={contact.message}
              onChange={(e) => setContact({ ...contact, message: e.target.value })}
              required
            />
            <div className="text-right">
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 text-xs sm:text-sm text-gray-600 border-t">
        &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
