import { PORT1 } from '@/api/config/servicePort'
import type { Login, SecretKey } from '../interface/common'
import http from '@/api'

export const getPublicKey = () => {
  return http.get<SecretKey.PublicKeyRes>(PORT1 + '/auth/public-key')
}

// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(PORT1 + `/auth/login`, params, { loading: false })
}
