import { describe, it, expect } from 'bun:test'
import { treaty } from '@elysiajs/eden'
import { Elysia } from 'elysia'

import { xss } from './index'

const app = new Elysia().use(xss).post('/', ({ body }) => body)

const api = treaty(app)

describe('xss', () => {
    it('should sanitize XSS in string values', async () => {
        const maliciousInput = '<script>alert("XSS")</script>'
        const { data } = await api.post({
            message: maliciousInput
        })

        expect(data).toBeDefined()
        const body = data as { message?: string }

        // XSS library HTML-encodes dangerous content
        expect(body.message).toBeDefined()
        expect(typeof body.message).toBe('string')
        // Should not contain raw script tags
        expect(body.message).not.toContain('<script>')
        expect(body.message).not.toContain('</script>')
        // Should be HTML-encoded
        expect(body.message).toContain('&lt;')
        expect(body.message).toContain('&gt;')
    })

    it('should sanitize XSS in nested objects', async () => {
        const { data } = await api.post({
            user: {
                name: '<img src=x onerror=alert(1)>',
                bio: 'Hello <script>evil()</script> world'
            }
        })

        expect(data).toBeDefined()
        const body = data as {
            user?: {
                name?: string
                bio?: string
            }
        }

        expect(body.user).toBeDefined()
        expect(body.user?.name).toBeDefined()
        expect(typeof body.user?.name).toBe('string')
        // Should not contain raw dangerous attributes
        expect(body.user?.name).not.toContain('onerror=')
        // Should be sanitized (dangerous attributes removed, tag may remain but sanitized)
        // The XSS library removes dangerous attributes but may keep the tag
        expect(body.user?.name).not.toContain('onerror')

        expect(body.user?.bio).toBeDefined()
        expect(typeof body.user?.bio).toBe('string')
        // Should not contain raw script tags
        expect(body.user?.bio).not.toContain('<script>')
        expect(body.user?.bio).not.toContain('</script>')
        // Should still contain safe text
        expect(body.user?.bio).toContain('Hello')
        expect(body.user?.bio).toContain('world')
    })

    it('should sanitize XSS in arrays', async () => {
        const { data } = await api.post({
            tags: [
                '<script>alert(1)</script>',
                'normal-tag',
                '<iframe src="evil.com"></iframe>'
            ]
        })

        expect(data).toBeDefined()
        const body = data as { tags?: unknown[] }

        expect(Array.isArray(body.tags)).toBe(true)
        expect(body.tags?.length).toBe(3)

        // First item should be sanitized
        const firstTag = String(body.tags?.[0])
        expect(firstTag).not.toContain('<script>')
        expect(firstTag).not.toContain('</script>')
        expect(firstTag).toContain('&lt;')

        // Second item should be preserved
        expect(body.tags?.[1]).toBe('normal-tag')

        // Third item should be sanitized
        const thirdTag = String(body.tags?.[2])
        expect(thirdTag).not.toContain('<iframe')
        expect(thirdTag).toContain('&lt;')
    })

    it('should preserve non-string values', async () => {
        const { data } = await api.post({
            number: 42,
            boolean: true,
            nullValue: null,
            array: [1, 2, 3],
            nested: {
                count: 100
            }
        })

        expect(data).toBeDefined()
        const body = data as {
            number?: number
            boolean?: boolean
            nullValue?: null
            array?: number[]
            nested?: {
                count?: number
            }
        }

        expect(body.number).toBe(42)
        expect(body.boolean).toBe(true)
        expect(body.nullValue).toBeNull()
        expect(body.array).toEqual([1, 2, 3])
        expect(body.nested?.count).toBe(100)
    })

    it('should handle empty objects', async () => {
        const { data } = await api.post({})

        expect(data).toBeDefined()
        expect(data).toEqual({})
    })

    it('should sanitize mixed content', async () => {
        const { data } = await api.post({
            safe: 'This is safe',
            unsafe: '<script>alert("XSS")</script>',
            number: 123,
            nested: {
                text: 'Hello <b>world</b>',
                malicious: '<img src=x onerror=alert(1)>'
            },
            items: ['safe-item', '<script>bad</script>', 456]
        })

        expect(data).toBeDefined()
        const body = data as {
            safe?: string
            unsafe?: string
            number?: number
            nested?: {
                text?: string
                malicious?: string
            }
            items?: unknown[]
        }

        // Safe string should be preserved
        expect(body.safe).toBe('This is safe')

        // Unsafe content should be sanitized
        expect(body.unsafe).toBeDefined()
        expect(typeof body.unsafe).toBe('string')
        expect(body.unsafe).not.toContain('<script>')
        expect(body.unsafe).toContain('&lt;')

        // Numbers should be preserved
        expect(body.number).toBe(123)

        // Nested text - <b> might be allowed by XSS library, but dangerous content should be sanitized
        expect(body.nested?.text).toBeDefined()
        expect(typeof body.nested?.text).toBe('string')
        expect(body.nested?.text).toContain('Hello')
        expect(body.nested?.text).toContain('world')

        // Malicious content should be sanitized
        expect(body.nested?.malicious).toBeDefined()
        expect(typeof body.nested?.malicious).toBe('string')
        // Dangerous attributes should be removed
        expect(body.nested?.malicious).not.toContain('onerror=')
        expect(body.nested?.malicious).not.toContain('onerror')

        // Array items
        expect(Array.isArray(body.items)).toBe(true)
        expect(body.items?.[0]).toBe('safe-item')

        const secondItem = String(body.items?.[1])
        expect(secondItem).not.toContain('<script>')
        expect(secondItem).toContain('&lt;')

        expect(body.items?.[2]).toBe(456)
    })
})
