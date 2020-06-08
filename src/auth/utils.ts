import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

import Axios from 'axios'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export const parseToken = (authHeader: string) => {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

/**
 * Parse a JWT token and return a user id
 * @param jwksUrl welknown jwksUrl
 * @returns a rs256 certificate
 */
export const getCertificate = async (jwksUrl: string): Promise<string> => {
  const jwks = await Axios.get(jwksUrl)

  if (!jwks || !jwks.data) throw new Error('Invalid JSON Web Key Set')

  const { keys } = jwks.data

  if (!Array.isArray(keys) || !keys.length)
    throw new Error('Invalid JSON Web Key Set')

  return `-----BEGIN CERTIFICATE-----\n${keys[0].x5c[0]}\n-----END CERTIFICATE-----`
}
