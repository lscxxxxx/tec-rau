import jwt from 'jsonwebtoken'
import type { Admin } from '@prisma/client'

const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error('JWT_SECRET não está definida.')
}

const JWT_SECRET = secret as string

export function gerarToken(admin: Admin): string {
  return jwt.sign(
    { id: admin.id, email: admin.email },
    JWT_SECRET,
    { expiresIn: '1h' } // Sessão válida por 1 hora
  )
}

export function verificarToken(token: string): { id: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string }
  } catch {
    return null
  }
}