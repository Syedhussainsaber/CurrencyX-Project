import mongoose from 'mongoose'
import { getServerEnv } from './env'

declare global {
  // eslint-disable-next-line no-var
  var mongoosePromise: ReturnType<typeof mongoose.connect> | null
}

export const connectToDatabase = async () => {
  try {
    const { MONGODB_URI, NODE_ENV } = getServerEnv()

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection
    }

    const cached = globalThis.mongoosePromise

    if (!cached) {
      globalThis.mongoosePromise = mongoose.connect(MONGODB_URI)
    }

    if (NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    await globalThis.mongoosePromise
    return mongoose.connection
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Database connection failed: ${errorMessage}`)
  }
}

