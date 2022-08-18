import { createSlice } from '@reduxjs/toolkit'

interface BoardState {
  value: any
}

const initialState: BoardState = {
  value: [],
}

export const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addBoard: (state, action) => {
      state.value = [ ...state.value, { id: action.payload.id, title: action.payload.title }]
    }
  },
})

export const { addBoard } = boardSlice.actions


export default boardSlice.reducer