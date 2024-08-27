<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import CryptoJS from 'crypto-js'
import { getPublicKey, loginApi } from '@/api/modules/login'
import { encryptSymmetricKey } from '@/utils/crypto/encryte'
import { HOME_URL } from '@/config'
import { useUserStore } from '@/stores/modules/user'
import router from '@/router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
let publicKey: string

const userStore = useUserStore()

const handleLogin = async () => {
  // 生成随机对称密钥
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const symmetricKey = CryptoJS.lib.WordArray.random(32).toString()

  // 对密码进行哈希
  const hashedPassword = CryptoJS.SHA256(password.value).toString()

  // 使用对称密钥加密哈希后的密码
  const encryptedPassword = CryptoJS.AES.encrypt(hashedPassword, symmetricKey).toString()

  // 使用公钥加密对称密钥
  const encryptedSymmetricKey = await encryptSymmetricKey(publicKey, symmetricKey)

  // 1.执行登录接口
  const { data } = await loginApi({
    username: username.value,
    password: encryptedPassword,
    key: encryptedSymmetricKey
  })
  userStore.setToken(data.access_token)
  router.push(HOME_URL)
}

onBeforeMount(async () => {
  const publicKeyRes = await getPublicKey()
  publicKey = publicKeyRes.data.publicKey
})
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #359d74;
}

p {
  color: red;
  margin-top: 15px;
}
</style>
