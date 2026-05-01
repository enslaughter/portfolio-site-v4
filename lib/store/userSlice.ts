import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const COLORS = [
  '#e57373', '#f06292', '#ba68c8', '#7986cb',
  '#4dd0e1', '#4db6ac', '#81c784', '#ffb74d',
]
const ADJECTIVES = ['Quiet', 'Bright', 'Swift', 'Calm', 'Bold', 'Keen', 'Sage', 'Warm']
const NOUNS = ['Panda', 'Finch', 'Otter', 'Crane', 'Fox', 'Lynx', 'Ibis', 'Wren']

export type UserState = {
  name: string
  avatarUrl: string | null
  color: string
  isGuest: boolean
}

const initialState: UserState = {
  name: '',
  avatarUrl: null,
  color: COLORS[0],
  isGuest: true,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initGuestUser: (state) => {
      const idx = Math.floor(Math.random() * (ADJECTIVES.length * NOUNS.length))
      state.name = `${ADJECTIVES[idx % ADJECTIVES.length]} ${NOUNS[Math.floor(idx / ADJECTIVES.length) % NOUNS.length]}`
      state.avatarUrl = null
      state.color = COLORS[idx % COLORS.length]
      state.isGuest = true
    },
    setAuthUser: (state, action: PayloadAction<{ name: string | null; avatarUrl: string }>) => {
      state.name = action.payload.name ?? 'Anonymous'
      state.avatarUrl = action.payload.avatarUrl
      state.isGuest = false
      // color is kept from initialization
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload
    },
  },
})

export const { initGuestUser, setAuthUser, setColor } = userSlice.actions
export default userSlice.reducer
