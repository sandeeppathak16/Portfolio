const BASE_URL = 'http://127.0.0.1:8000';

const authHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export class BlogAPI {
  static async getAll() {
    const response = await fetch(`${BASE_URL}/blogs`);
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return await response.json();
  }

  static async getOne(slug: string) {
    const response = await fetch(`${BASE_URL}/blogs/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch blog');
    return await response.json();
  }

  static async create(blog: { title: string; slug: string; tags?: string; content: string }) {
    const response = await fetch(`${BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         ...authHeader(),
      },
      body: JSON.stringify(blog),
    });
    if (!response.ok) throw new Error('Failed to create blog');
    return await response.json();
  }

  static async update(slug: string, data: { title: string; slug: string; tags?: string; content: string }) {
    const response = await fetch(`${BASE_URL}/blogs/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
         ...authHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update blog');
    return await response.json();
  }

  static async delete(slug: string) {
    const response = await fetch(`${BASE_URL}/blogs/${slug}`, {
      method: 'DELETE',
      headers:  authHeader(),
    });
    if (!response.ok) throw new Error('Failed to delete blog');
    return await response.json();
  }
}

export class ContactAPI {
  static async send(message: { email: string; message: string }) {
    const response = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) throw new Error('Failed to send contact message');
    return await response.json();
  }
}

export class UploadAPI {
  static async uploadFile(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers:  authHeader(),
      body: formData,
    });

    if (!response.ok) throw new Error('File upload failed');
    return await response.json();
  }
}
