import { createSlice } from '@reduxjs/toolkit'
import { getRandomEmoji } from '../helpers'
import { IBoard } from '../types/global-types'

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
      state.value = [...state.value, { id: action.payload.id, title: action.payload.title }]
    },
    deleteBoard: (state, action) => {
      const restBoards = state.value.filter((item: IBoard) => item.id !== action.payload)
      state.value = restBoards
    },
    generateExampleBoard: (state) => {
      const title = `Example Board ${getRandomEmoji()}`;
      state.value = [...state.value, { id: new Date().getTime(), title }]
    }
  },
})

export const { addBoard, deleteBoard, generateExampleBoard } = boardSlice.actions


export default boardSlice.reducer