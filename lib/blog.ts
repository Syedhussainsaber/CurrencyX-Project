import { cache } from 'react'
import { connectToDatabase } from './db'
import BlogModel, { type BlogDocument } from '@/models/Blog'

export const getPublishedBlogs = cache(async (limit = 6) => {
  await connectToDatabase()
  const blogs = await BlogModel.find({ status: 'published' })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean<BlogDocument[]>()
  return blogs
})

export const getBlogBySlug = cache(async (slug: string) => {
  await connectToDatabase()
  const blog = await BlogModel.findOne({ slug, status: 'published' }).lean<BlogDocument>()
  return blog
})

export const getBlogById = async (id: string) => {
  await connectToDatabase()
  const blog = await BlogModel.findById(id).lean<BlogDocument>()
  return blog
}

