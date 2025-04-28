<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'AddEvent',
  data() {
    return {
      event: {
        name: '',
        date: '',
        description: '',
      },
      loading: false,
      error: null as string | null,
      success: false,
    }
  },
  methods: {
    submitForm() {
      if (!this.validateForm()) {
        return
      }

      this.loading = true
      this.error = null

      axios
        .post('http://localhost:3000/events', this.event)
        .then(() => {
          this.loading = false
          this.success = true
          this.event = {
            name: '',
            date: '',
            description: '',
          }
          setTimeout(() => {
            this.$router.push({ name: 'events' })
          }, 1500)
        })
        .catch((error) => {
          this.error = 'Error adding event: ' + error.message
          this.loading = false
          console.error('Error adding event:', error)
        })
    },
    validateForm() {
      this.error = null
      if (!this.event.name.trim()) {
        this.error = 'Event name is required'
        return false
      }
      if (!this.event.date) {
        this.error = 'Event date is required'
        return false
      }
      return true
    },
    closeModal() {
      this.$router.push({ name: 'events' })
    },
  },
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-black">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Add New Event</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div
        v-if="success"
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
      >
        Event added successfully! Redirecting...
      </div>

      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ error }}
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Event Name</label>
          <input
            type="text"
            id="name"
            v-model="event.name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            required
          />
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            v-model="event.date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            required
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <textarea
            id="description"
            v-model="event.description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
            :disabled="loading"
          >
            {{ loading ? 'Adding...' : 'Add Event' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
