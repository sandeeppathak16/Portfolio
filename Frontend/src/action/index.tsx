import { BlogAPI, ContactAPI } from '/src/api';


const dummyBlogs = [
  {
    id: 1,
    title: 'How I Built My Portfolio',
    slug: 'how-i-built-my-portfolio',
    tags: 'portfolio,frontend,react',
    content: `# How I Built My Portfolio

I used React + Vite + Tailwind to build a fast and clean portfolio.

## Stack
- React
- TypeScript
- Tailwind CSS
- Markdown-based blog system

## Features
- Responsive design
- Blog support
- Contact form`,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Top 5 Backend Practices in 2025',
    slug: 'backend-best-practices-2025',
    tags: 'backend,django,go',
    content: `# Top 5 Backend Practices in 2025

Here are 5 must-follow practices for backend developers:

1. Use typed APIs (OpenAPI/GraphQL)
2. Implement proper logging and tracing
3. Use background workers for heavy tasks
4. Monitor and alert with Prometheus/Grafana
5. Automate CI/CD pipelines`,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Switching from Node.js to Go',
    slug: 'node-to-go-migration',
    tags: 'go,node,migration',
    content: `# Switching from Node.js to Go

Migrating from Node to Go was a game changer for our real-time backend.

## Why Go?
- Better concurrency
- Compiled performance
- Simple deployment

## Lessons Learned
- Use goroutines wisely
- Embrace interfaces
- Use echo or gin for web APIs`,
    created_at: new Date().toISOString(),
  },
];

export const getAllBlogs = async () => {
  return dummyBlogs;
};

export const submitContactMessage = async (contact: { email: string; message: string }) => {
  return await ContactAPI.send(contact);
};
