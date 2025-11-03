import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

declare global {
  // allow global prisma in dev to avoid multiple instances
  // eslint-disable-next-line
  var __PRISMA_CLIENT__: PrismaClient | undefined
}

export const prisma =
  global.__PRISMA_CLIENT__ ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  global.__PRISMA_CLIENT__ = prisma
} 
