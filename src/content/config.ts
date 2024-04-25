import {defineCollection, z} from 'astro:content';

const member = defineCollection({
    type: 'content',
    // Type-check frontmatter using a schema
    schema: z.object({
        name: z.string(),
        alias: z.string(),
    }),
});

const blog = defineCollection({
    type: 'content',
    // Type-check frontmatter using a schema
    schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string().optional(),
        // Transform string to Date object
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional(),
    }),
});


export const collections = {member, blog};
