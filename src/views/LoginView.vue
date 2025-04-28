<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

interface User {
  id: number
  email: string
  password: string
  username?: string
}

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      users: [] as User[],
      loading: true,
      error: null as string | null,
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    fetchUsers() {
      this.loading = true
      axios
        .get(`${API_URL}/users`)
        .then((response) => {
          this.users = response.data
          this.loading = false
        })
        .catch((error) => {
          this.error = 'Error loading users: ' + error.message
          this.loading = false
          console.error('Error fetching users:', error)
        })
    },
    submitLogin() {
      if (this.loading) {
        alert('Please wait while we load user data')
        return
      }

      const validUser = this.users.find(
        (user) => user.email === this.email && user.password === this.password,
      )

      if (validUser) {
        const userData = {
          id: validUser.id,
          email: validUser.email,
          username: validUser.username || validUser.email.split('@')[0],
        }
        sessionStorage.setItem('user', JSON.stringify(userData))

        this.$router.push({ name: 'events' })
      } else {
        alert('Invalid email or password')
      }
    },
  },
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <div
      class="bg-white rounded-md border w-[50%] max-w-md p-6 flex flex-col gap-4 text-black shadow-md"
    >
      <h1 class="text-xl font-bold text-center">Login</h1>

      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ error }}
      </div>

      <label for="email" class="block text-sm font-medium">Email</label>
      <input
        v-model="email"
        type="email"
        id="email"
        name="email"
        required
        placeholder="Enter your email"
        class="w-full border rounded-md p-2"
      />

      <label for="password" class="block text-sm font-medium">Password</label>
      <input
        v-model="password"
        type="password"
        id="password"
        name="password"
        required
        placeholder="Enter your password"
        class="w-full border rounded-md p-2"
      />

      <button
        type="submit"
        class="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        @click="submitLogin"
        :disabled="loading"
      >
        {{ loading ? 'Loading...' : 'Login' }}
      </button>
    </div>
  </div>
</template>
