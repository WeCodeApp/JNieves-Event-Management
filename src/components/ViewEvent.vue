<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

interface Event {
  id: number | string
  name: string
  date: string
  description: string
  participants: string[]
}

export default defineComponent({
  name: 'ViewEvent',
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      event: null as Event | null,
      loading: true,
      error: null as string | null,
      currentUser: null as string | null,
    }
  },
  created() {
    this.fetchEvent()
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        this.currentUser = user.username
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  },
  methods: {
    fetchEvent() {
      this.loading = true

      axios
        .get(`http://localhost:3000/events/${this.id}`)
        .then((response) => {
          this.event = response.data
          if (this.event && !this.event.participants) {
            this.event.participants = []
          }
          this.loading = false
        })
        .catch((error) => {
          this.error = 'Error loading event: ' + error.message
          this.loading = false
          console.error('Error fetching event:', error)
        })
    },
    closeModal() {
      this.$router.push({ name: 'events' })
    },
    joinEvent() {
      if (!this.currentUser || !this.event) return

      if (this.event.participants.includes(this.currentUser)) {
        return
      }

      const updatedEvent = { ...this.event }
      updatedEvent.participants.push(this.currentUser)

      axios
        .put(`http://localhost:3000/events/${this.id}`, updatedEvent)
        .then(() => {
          this.event = updatedEvent
        })
        .catch((error) => {
          console.error('Error joining event:', error)
        })
    },
  },
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 text-black">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Event Details</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div v-if="loading" class="py-4 text-center">Loading event details...</div>

      <div
        v-else-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ error }}
      </div>

      <div v-else-if="event" class="space-y-4">
        <h3 class="text-xl font-semibold">{{ event.name }}</h3>

        <div class="text-gray-700">
          <div class="mb-2"><span class="font-medium">Date:</span> {{ event.date }}</div>
          <div class="mb-4">
            <span class="font-medium">Description:</span>
            <p class="mt-1">{{ event.description }}</p>
          </div>

          <div>
            <span class="font-medium">Participants ({{ event.participants.length }}):</span>
            <ul v-if="event.participants.length > 0" class="list-disc ml-5 mt-1">
              <li
                v-for="(participant, index) in event.participants"
                :key="index"
                :class="{ 'font-bold': participant === currentUser }"
              >
                {{ participant }} {{ participant === currentUser ? '(You)' : '' }}
              </li>
            </ul>
            <p v-else class="mt-1 italic">No participants yet</p>
          </div>
        </div>

        <div class="pt-4 border-t mt-4 flex justify-between">
          <button
            v-if="currentUser && event.participants && !event.participants.includes(currentUser)"
            @click="joinEvent"
            class="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md"
          >
            Join Event
          </button>
          <span
            v-else-if="
              currentUser && event.participants && event.participants.includes(currentUser)
            "
            class="px-4 py-2 bg-gray-100 text-green-700 rounded-md"
          >
            You've joined this event
          </span>
          <span></span>
          <!-- Spacer -->
          <button @click="closeModal" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
