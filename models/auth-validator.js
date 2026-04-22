const {z} = require('zod');

const registerSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['admin', 'bace'], 'Role must be either "admin" or "bace"')
})

const loginSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

module.exports = {
    registerSchema, loginSchema
}