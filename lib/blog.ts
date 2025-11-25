import { cache } from 'react'
import prisma from '@/lib/prisma'

export const getPublishedBlogs = cache(async (limit = 6) => {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    orderBy: [
      { publishedAt: 'desc' },
      { createdAt: 'desc' }
    ],
    take: limit,
    include: { author: true }
  })
  return blogs
})

export const getBlogBySlug = cache(async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { author: true }
  })
  if (blog && blog.published) {
    return blog
  }
  return null
})

export const getBlogById = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id }
  })
  return blog
}

