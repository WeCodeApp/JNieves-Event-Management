<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

interface Event {
  id: number | string
  name: string
  date: string
  description: string
  participants: string[]
}

export default defineComponent({
  name: 'EventView',
  data() {
    return {
      events: [] as Event[],
      loading: true,
      error: null as string | null,
      joining: false,
      joinMessage: '',
      currentUser: null as string | null,
      deleting: false,
      deleteMessage: '',
    }
  },
  created() {
    const userData = sessionStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        this.currentUser = user.username
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }

    if (!this.currentUser) {
      this.$router.push({ name: 'login' })
      return
    }

    this.fetchEvents()
  },
  methods: {
    fetchEvents() {
      this.loading = true
      axios
        .get(`${API_URL}/events`)
        .then((response) => {
          this.events = response.data
          this.loading = false
        })
        .catch((error) => {
          this.error = 'Error loading events: ' + error.message
          this.loading = false
          console.error('Error fetching events:', error)
        })
    },
    addEvent() {
      this.$router.push({ name: 'add-event' })
    },
    joinEvent(event: Event) {
      if (!this.currentUser) {
        this.joinMessage = 'You must be logged in to join an event'
        return
      }

      if (event.participants && event.participants.includes(this.currentUser)) {
        this.joinMessage = 'You are already registered for this event'
        return
      }

      this.joining = true

      const updatedEvent = { ...event }
      if (!updatedEvent.participants) {
        updatedEvent.participants = []
      }
      updatedEvent.participants.push(this.currentUser)

      axios
        .put(`${API_URL}/events/${event.id}`, updatedEvent)
        .then(() => {
          this.joining = false
          this.joinMessage = `You (${this.currentUser}) successfully joined ${event.name}`

          const index = this.events.findIndex((e) => e.id === event.id)
          if (index !== -1) {
            this.events[index] = updatedEvent
          }

          setTimeout(() => {
            this.joinMessage = ''
          }, 3000)
        })
        .catch((error) => {
          this.joining = false
          this.joinMessage = 'Error joining event: ' + error.message
          console.error('Error joining event:', error)

          setTimeout(() => {
            this.joinMessage = ''
          }, 3000)
        })
    },
    deleteEvent(event: Event) {
      if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
        this.deleting = true

        axios
          .delete(`${API_URL}/events/${event.id}`)
          .then(() => {
            this.deleting = false
            this.deleteMessage = `Event "${event.name}" has been deleted successfully`

            this.events = this.events.filter((e) => e.id !== event.id)

            setTimeout(() => {
              this.deleteMessage = ''
            }, 3000)
          })
          .catch((error) => {
            this.deleting = false
            this.deleteMessage = 'Error deleting event: ' + error.message
            console.error('Error deleting event:', error)

            setTimeout(() => {
              this.deleteMessage = ''
            }, 3000)
          })
      }
    },
    viewEvent(eventId: number | string) {
      this.$router.push({ name: 'view-event', params: { id: eventId } })
    },
    logout() {
      sessionStorage.removeItem('user')

      this.currentUser = null

      this.$router.push({ name: 'login' })
    },
  },
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen text-black">
    <div class="rounded-md bg-white p-6 w-[80%] max-w-4xl">
      <div class="flex justify-between items-center" style="margin-bottom: 20px">
        <div>
          <h1 class="text-2xl font-bold">Events</h1>
          <p v-if="currentUser" class="text-sm text-gray-600">Welcome, {{ currentUser }}</p>
        </div>

        <div class="flex gap-2">
          <button @click="addEvent" class="rounded-md bg-blue-500 p-2 text-white">Add Event</button>
          <button @click="logout" class="rounded-md bg-red-500 p-2 text-white">Logout</button>
        </div>
      </div>

      <div
        v-if="deleteMessage"
        class="mb-4 p-3 rounded"
        :class="{
          'bg-green-100 border border-green-400 text-green-700': !deleteMessage.includes('Error'),
          'bg-red-100 border border-red-400 text-red-700': deleteMessage.includes('Error'),
        }"
      >
        {{ deleteMessage }}
      </div>

      <div
        v-if="joinMessage"
        class="mb-4 p-3 rounded"
        :class="{
          'bg-green-100 border border-green-400 text-green-700': !joinMessage.includes('Error'),
          'bg-red-100 border border-red-400 text-red-700': joinMessage.includes('Error'),
        }"
      >
        {{ joinMessage }}
      </div>

      <div v-if="loading" class="text-center py-4">Loading events...</div>

      <div
        v-else-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ error }}
      </div>

      <div v-else-if="events.length === 0" class="text-center py-4">No events found.</div>

      <div v-else class="grid gap-4">
        <div
          v-for="event in events"
          :key="event.id"
          class="rounded-md border shadow-md p-4 bg-white hover:shadow-lg transition cursor-pointer"
        >
          <h2 class="text-xl font-semibold">{{ event.name }}</h2>
          <div class="mt-2 text-gray-600">
            <div><span class="font-medium">Date:</span> {{ event.date }}</div>
            <div class="mt-1">
              <span class="font-medium">Participants:</span>
              {{ event.participants && event.participants.length ? event.participants.length : 0 }}
            </div>
          </div>
          <div class="mt-4 flex justify-end gap-2">
            <button @click="viewEvent(event.id)" class="rounded-md bg-blue-500 p-2 text-white">
              View
            </button>
            <button
              @click="$router.push({ name: 'edit-event', params: { id: event.id } })"
              class="rounded-md bg-yellow-500 p-2 text-white"
            >
              Edit
            </button>
            <button
              @click="deleteEvent(event)"
              class="rounded-md bg-red-500 p-2 text-white"
              :disabled="deleting"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
            <button
              @click="joinEvent(event)"
              class="rounded-md bg-green-500 p-2 text-white"
              :disabled="joining"
            >
              {{ joining ? 'Joining...' : 'Join' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
