'use server'


import { signIn } from '../../auth'
import { AuthError } from 'next-auth'
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const RegisterSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    cashtag: z.string().min(1).startsWith('$'),
    password: z.string().min(6),
})

export async function registerUser(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        email: formData.get('email'),
        name: formData.get('name'),
        cashtag: formData.get('cashtag'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Invalid fields. Please check your inputs.',
        }
    }

    const { email, name, cashtag, password } = validatedFields.data

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { cashtag }
                ]
            }
        })

        if (existingUser) {
            return {
                success: false,
                message: 'User with this email or cashtag already exists.'
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                name,
                cashtag,
                password: hashedPassword,
                ledgerAccounts: {
                    create: {
                        name: "Cash Balance",
                        type: "ASSET",
                        currency: "USD",
                        balance: 0
                    }
                }
            },
        })

        return { success: true, message: 'Account created! Redirecting...' }
    } catch (error) {
        return {
            success: false,
            message: 'Database Error: Failed to Create User.',
        }
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}
