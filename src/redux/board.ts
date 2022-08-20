import { createSlice, current } from '@reduxjs/toolkit'
import { getRandomEmoji } from '../helpers'
import { IBoard } from '../types/global-types'


const initialState: IBoard[] = []

export const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {

    getInit: () => {
      return JSON.parse(localStorage.getItem("boards")!)
    },
    addBoard: (state, action) => {
      localStorage.setItem("boards", JSON.stringify([...state, { id: action.payload.id, title: action.payload.title }]))
      return [...state, { id: action.payload.id, title: action.payload.title }]
    },
    deleteBoard: (state, action) => {
      const restBoards = state.filter((item: IBoard) => item.id !== action.payload)
      localStorage.setItem("boards", JSON.stringify(restBoards))
      return restBoards;
    },
    generateExampleBoard: (state) => {
      const title = `Example Board ${getRandomEmoji()}`;
      localStorage.setItem("boards", JSON.stringify([...state, { id: `${new Date().getTime()}`, title }]))
      return [...state, { id: `${new Date().getTime()}`, title }]
    },
    addList: (state, action) => {

      const currentBoard = state.filter((board: any) => board.id === action.payload.boardId);
      const restBoards = state.filter((board: any) => board.id !== action.payload.boardId);
      (currentBoard[0]).list = [
        ...(currentBoard[0].list || []), { id: `${new Date().getTime()}`, title: action.payload.listTitle }
      ];
      localStorage.setItem("boards", JSON.stringify([...restBoards, currentBoard[0]]))
      state = [...restBoards, currentBoard[0]]
    },
    addCard: (state, action) => {
      const currentBoardIndex = state.findIndex((board: any) => board.id === action.payload.boardId);
      const currentBoard = state[currentBoardIndex]
      const currentListIndex = (currentBoard!.list!).findIndex((list: any) => list.id === action.payload.listId);
      const currentList = (currentBoard!.list!)[currentListIndex]
      const restList = (currentBoard!.list!).filter((list: any) => list.id !== action.payload.listId);
      (currentList).cards = [
        ...(currentList.cards || []), { id: `${new Date().getTime()}`, title: action.payload.cardTitle }
      ];

      localStorage.setItem("boards", JSON.stringify([...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list: [
          ...(currentBoard.list || [])?.slice(0, currentListIndex), currentList,
          ...(currentBoard.list || [])?.slice(currentListIndex + 1, (currentBoard.list || "1")?.length)
        ]
      }, ...state.slice(currentBoardIndex + 1, state.length)]))

      state = [...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list: [
          ...restList, currentList
        ]
      }, ...state.slice(currentBoardIndex + 1, state.length)]


    },
    editListTitle: (state, action) => {
      const currentBoard = state.filter((board: any) => board.id === action.payload.boardId);
      const restBoards = state.filter((board: any) => board.id !== action.payload.boardId);
      const currentList = (currentBoard[0]!.list!).filter((list: any) => list.id === action.payload.listId);
      const restList = (currentBoard[0]!.list!).filter((list: any) => list.id !== action.payload.listId);

      (currentList[0]).title = action.payload.listTitle;

      localStorage.setItem("boards", JSON.stringify([...restBoards, {
        id: currentBoard[0].id,
        title: currentBoard[0].title,
        list: [
          ...restList, currentList[0]
        ]
      }]))
      state = [...restBoards, {
        id: currentBoard[0].id,
        title: currentBoard[0].title,
        list: [
          ...restList, currentList[0]
        ]
      }]


    }
  },
})

export const { addBoard, deleteBoard, generateExampleBoard, addList,
  addCard, editListTitle, getInit } = boardSlice.actions


export default boardSlice.reducer