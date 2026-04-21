import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'

const postsDirectory = path.join(process.cwd(), 'content/blog')

function calculateReadingTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  rawDate: string
  excerpt: string
  tags: string[]
  author: string
  readingTime: number
  featured: boolean
}

export interface Post extends PostMeta {
  content: string
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return []
  return fs
    .readdirSync(postsDirectory)
    .filter((e) => e.endsWith('.md') || e.endsWith('.mdx'))
    .map((e) => {
      const slug = e.replace(/\.(md|mdx)$/, '')
      const fullPath = path.join(postsDirectory, e)
      const fileContents = fs.readFileSync(fullPath, 'utf-8')
      const { data, content } = matter(fileContents)
      const rawDate = data.date ? new Date(data.date).toISOString() : new Date().toISOString()
      return {
        slug,
        title: data.title || slug,
        date: formatDate(rawDate),
        rawDate,
        excerpt:
          data.excerpt ||
          content.replace(/#+\s/g, '').replace(/\*\*/g, '').trim().slice(0, 160) + '...',
        tags: data.tags || [],
        author: data.author || 'Redaktion',
        readingTime: calculateReadingTime(content),
        featured: data.featured || false,
      } as PostMeta
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
    })
}

export function getFeaturedPost(): PostMeta | null {
  const posts = getAllPosts()
  return posts.find((p) => p.featured) || posts[0] || null
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  let filePath: string | null = null
  for (const ext of ['.md', '.mdx']) {
    const p = path.join(postsDirectory, `${slug}${ext}`)
    if (fs.existsSync(p)) {
      filePath = p
      break
    }
  }
  if (!filePath) return null

  const fileContents = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContents)
  const processedContent = await remark().use(gfm).use(html, { sanitize: false }).process(content)
  const rawDate = data.date ? new Date(data.date).toISOString() : new Date().toISOString()

  return {
    slug,
    title: data.title || slug,
    date: formatDate(rawDate),
    rawDate,
    excerpt:
      data.excerpt || content.replace(/#+\s/g, '').trim().slice(0, 160) + '...',
    tags: data.tags || [],
    author: data.author || 'Redaktion',
    readingTime: calculateReadingTime(content),
    featured: data.featured || false,
    content: processedContent.toString(),
  }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  return fs
    .readdirSync(postsDirectory)
    .filter((e) => e.endsWith('.md') || e.endsWith('.mdx'))
    .map((e) => e.replace(/\.(md|mdx)$/, ''))
}
