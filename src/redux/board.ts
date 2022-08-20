import { createSlice, current } from '@reduxjs/toolkit'
import { getRandomEmoji } from '../helpers'
import { IBoard, ICard, IList } from '../types/global-types'


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
      const currentBoardIndex = state.findIndex((board: any) => board.id === action.payload.boardId);
      const currentBoard = state[currentBoardIndex];
      const currentListIndex = (currentBoard!.list!).findIndex((list: any) => list.id === action.payload.listId);
      const currentList = (currentBoard!.list!)[currentListIndex]

      currentList.title = action.payload.listTitle;

      localStorage.setItem("boards", JSON.stringify([...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list: [
          ...(currentBoard.list || []).slice(0, currentListIndex), currentList,
          ...(currentBoard.list || []).slice(currentListIndex + 1, (currentBoard.list || "1").length)
        ]
      }, ...state.slice(currentBoardIndex + 1, state.length)]))
      state = [...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list: [
          ...(currentBoard.list || []).slice(0, currentListIndex), currentList,
          ...(currentBoard.list || []).slice(currentListIndex + 1, (currentBoard.list || "1").length)
        ]
      }, ...state.slice(currentBoardIndex + 1, state.length)]


    },
    deleteList: (state, action) => {
      const currentBoardIndex = state.findIndex((board: any) => board.id === action.payload.boardId);
      const currentBoard = state[currentBoardIndex];
      const list = (currentBoard!.list!).filter((list: any) => list.id !== action.payload.listId);
      localStorage.setItem("boards", JSON.stringify([...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list
      }, ...state.slice(currentBoardIndex + 1, state.length)]))
      return [...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list
      }, ...state.slice(currentBoardIndex + 1, state.length)]
    },
    deleteCard: (state, action) => {
      const currentBoardIndex = state.findIndex((board: any) => board.id === action.payload.boardId);
      const currentBoard = state[currentBoardIndex];
      const currentListIndex = (currentBoard!.list!).findIndex((list: any) => list.id === action.payload.listId);
      const currentList = (currentBoard!.list!)[currentListIndex];
      const cards = (currentList!.cards!).filter((card: any) => card.id !== action.payload.cardId);

      localStorage.setItem("boards", JSON.stringify([...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list: [
          ...(currentBoard.list || []).slice(0, currentListIndex), {
            id: currentList.id,
            title: currentList.title,
            cards
          },
          ...(currentBoard.list || []).slice(currentListIndex + 1, (currentBoard.list || "1").length)
        ]
      }, ...state.slice(currentBoardIndex + 1, state.length)]))
      return [...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list: [
          ...(currentBoard.list || []).slice(0, currentListIndex), {
            id: currentList.id,
            title: currentList.title,
            cards
          },
          ...(currentBoard.list || []).slice(currentListIndex + 1, (currentBoard.list || "1").length)
        ]
      }, ...state.slice(currentBoardIndex + 1, state.length)]
    },
    editCardTitle: (state, action) => {
      const currentBoardIndex = state.findIndex((board: any) => board.id === action.payload.boardId);
      const currentBoard = state[currentBoardIndex];
      const currentListIndex = (currentBoard!.list!).findIndex((list: any) => list.id === action.payload.listId);
      const currentList = (currentBoard!.list!)[currentListIndex];
      const currentCardIndex = (currentList!.cards!).findIndex((card: any) => card.id === action.payload.cardId);
      const currentCard = (currentList!.cards!)[currentCardIndex];
      currentCard.title = action.payload.cardTitle;

      localStorage.setItem("boards", JSON.stringify([...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list: [
          ...(currentBoard.list || []).slice(0, currentListIndex), {
            id: currentList.id,
            title: currentList.title,
            cards: [...(currentList.cards || []).slice(0, currentCardIndex), currentCard,
            ...(currentList.cards || []).slice(currentCardIndex + 1, (currentList.cards || "1").length)
            ]
          },
          ...(currentBoard.list || []).slice(currentListIndex + 1, (currentBoard.list || "1").length)
        ]
      }, ...state.slice(currentBoardIndex + 1, state.length)]))
      state = [...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list: [
          ...(currentBoard.list || []).slice(0, currentListIndex), {
            id: currentList.id,
            title: currentList.title,
            cards: [...(currentList.cards || []).slice(0, currentCardIndex), currentCard,
            ...(currentList.cards || []).slice(currentCardIndex + 1, (currentList.cards || "1").length)
            ]
          },
          ...(currentBoard.list || []).slice(currentListIndex + 1, (currentBoard.list || "1").length)
        ]
      }, ...state.slice(currentBoardIndex + 1, state.length)]
    },
    reorderBoard: (state, action) => {
      const currentBoardIndex = state.findIndex((board: any) => board.id === action.payload.boardId);
      const currentBoard = state[currentBoardIndex];
      const remainLists = currentBoard.list?.filter(list => list.id !== action.payload.dropListId);
      const removeList = currentBoard.list?.filter(list => list.id === action.payload.dropListId)[0];
      (remainLists || []).splice(action.payload.destinationIndex, 0, removeList!);

      return [...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list: remainLists
      }, ...state.slice(currentBoardIndex + 1, state.length)]

    },
    reorderList: (state, action) => {
      const destinationIndex = action.payload.destinationIndex;

      const currentBoardIndex = state.findIndex((board: any) => board.id === action.payload.boardId);
      const currentBoard = state[currentBoardIndex];
      const initListIndex = (currentBoard!.list!).findIndex((list: any) => list.id === action.payload.initListId);
      const initList = (currentBoard!.list!)[initListIndex];
      const removeCard: ICard = initList.cards?.filter(card => card.id === action.payload.cardId)[0]!
      const destListIndex = (currentBoard!.list!).findIndex((list: any) => list.id === action.payload.destListId);
      const destList = (currentBoard!.list!)[destListIndex];
      const initRemaincards = (initList!.cards!).filter((card: any) => card.id !== action.payload.cardId);
     
      if (!destList.cards) {
        destList.cards = []
      }
      initList.cards = initRemaincards;
      (destList.cards).splice(destinationIndex, 0, removeCard);
     
      
      let list;
      if (destListIndex > initListIndex) {
        list = [...currentBoard!.list!.slice(0 , initListIndex), initList, 
          ...currentBoard!.list!.slice(initListIndex + 1 , destListIndex) , destList,
          ...currentBoard!.list!.slice(destListIndex + 1 , currentBoard!.list!.length) ]
      } else if (initListIndex > destListIndex) {
        list = [...currentBoard!.list!.slice(0 , destListIndex), destList, 
          ...currentBoard!.list!.slice(destListIndex + 1 , initListIndex) , initList,
          ...currentBoard!.list!.slice(initListIndex + 1 , currentBoard!.list!.length) ]
      } else {
        list = [...currentBoard!.list!.slice(0 , destListIndex), destList, 
          ...currentBoard!.list!.slice(destListIndex + 1 , currentBoard!.list!.length) ]
      }

      localStorage.setItem("boards", JSON.stringify([...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list
      }, ...state.slice(currentBoardIndex + 1, state.length)]))

      state = [...state.slice(0, currentBoardIndex), {
        id: currentBoard.id,
        title: currentBoard.title,
        list
      }, ...state.slice(currentBoardIndex + 1, state.length)]

    }
  },
})

export const { addBoard, deleteBoard, generateExampleBoard, addList,
  addCard, editListTitle, getInit, deleteList,
  deleteCard, editCardTitle, reorderBoard, reorderList } = boardSlice.actions


export default boardSlice.reducer