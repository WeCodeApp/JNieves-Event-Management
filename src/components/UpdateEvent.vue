<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

interface Event {
  id: number | string
  name: string
  date: string
  description: string
}

export default defineComponent({
  name: 'EditEvent',
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      event: {} as Event,
      loading: true,
      error: null as string | null,
      saving: false,
      successMessage: '',
    }
  },
  created() {
    this.fetchEvent()
  },
  methods: {
    fetchEvent() {
      this.loading = true
      axios
        .get(`http://localhost:3000/events/${this.id}`)
        .then((response) => {
          this.event = response.data
          this.loading = false
        })
        .catch((error) => {
          this.error = 'Error loading event: ' + error.message
          this.loading = false
          console.error('Error fetching event:', error)
        })
    },
    updateEvent() {
      this.saving = true
      this.error = null
      this.successMessage = ''

      axios
        .put(`http://localhost:3000/events/${this.id}`, this.event)
        .then(() => {
          this.saving = false
          this.successMessage = 'Event updated successfully!'
        })
        .catch((error) => {
          this.error = 'Error updating event: ' + error.message
          this.saving = false
          console.error('Error updating event:', error)
        })
    },
    goBack() {
      this.$router.push({ name: 'events' })
    },
  },
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen text-black">
    <div class="rounded-md bg-white p-6 w-[80%] max-w-4xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Edit Event</h1>
        <button @click="goBack" class="rounded-md bg-gray-500 p-2 text-white">
          Back to Events
        </button>
      </div>

      <div v-if="loading" class="text-center py-4">Loading event details...</div>

      <div
        v-else-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ error }}
      </div>

      <div
        v-if="successMessage"
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
      >
        {{ successMessage }}
      </div>

      <form v-if="!loading && !error" @submit.prevent="updateEvent" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
          <input
            id="name"
            v-model="event.name"
            type="text"
            class="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
          <input
            id="date"
            v-model="event.date"
            type="date"
            class="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1"
            >Description</label
          >
          <textarea
            id="description"
            v-model="event.description"
            class="w-full p-2 border rounded-md"
            rows="4"
            required
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="saving"
            class="rounded-md bg-blue-500 p-2 text-white disabled:bg-blue-300"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
