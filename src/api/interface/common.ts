export interface Result {
  code: string
  msg: string
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T
}

export namespace SecretKey {
  export interface PublicKeyRes {
    publicKey: string
  }
}

export namespace Login {
  export interface ReqLoginForm {
    username: string
    password: string
    key: string
  }
  export interface ResLogin {
    access_token: string
  }
}
