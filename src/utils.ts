import { verify } from 'jsonwebtoken'
import { Context } from './context'

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, process.env.APP_SECRET || '') as Token
    console.log('getUserId -> verifiedToken', verifiedToken)
    return verifiedToken && verifiedToken.userId
  }
}
