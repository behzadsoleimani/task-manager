import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLocation } from "react-router-dom"
import List from '../../components/List';
import ListAdder from '../../components/ListAdder';
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { addList , reorderBoard , reorderList } from '../../redux/board';

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 111px);
  overflow-x: auto;
  overflow-y: auto;

  @media (max-width: 1436px) {
    align-items: ${(props: any) => props.numLists > 3 && 'self-start'};
  }

  @media (max-width: 1152px) {
    align-items: ${(props: any) => props.numLists > 2 && 'self-start'};
  }

  @media (max-width: 868px) {
    align-items: ${(props: any) => props.numLists > 1 && 'self-start'};
  }

  @media (max-width: 768px) {
    align-items: center;
    height: 100%;
  }
`;

const BoardTitle = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: white;
`;

const BoardTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ListsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Board = () => {

    const location = useLocation();
    const boardId = location.pathname.split("/")[2];
    const boards = useAppSelector(state => state.boards);
    const currentBoard = boards.find((i: any) => i.id === boardId);
    const [showListAdder, setShowListAdder] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const dispatch = useAppDispatch();


     

    const handleDragEnd = ({ draggableId, source, destination, type }: any) => {

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type === 'COLUMN') {
              dispatch(
                reorderBoard({
                  dropListId: draggableId,
                  destinationIndex: destination.index,
                  boardId
                })
              );
            return;
        } else {
              dispatch(
                reorderList({
                  cardId: draggableId,
                  initListId: source.droppableId,
                  destListId: destination.droppableId,
                //   sourceIndex: source.index,
                  destinationIndex: destination.index,
                  boardId
                })
              );
        }
    };

    const onAddList = async () => {
        dispatch(
            addList({
                listTitle: newListTitle,
                boardId
            })
        );
        setShowListAdder(false);
        setNewListTitle('');
    };
    

    return (
      currentBoard ?
        <React.Fragment>
            <BoardTitleWrapper>
                <BoardTitle>{currentBoard!.title}</BoardTitle>
            </BoardTitleWrapper>
            <StyledBoard
            //   numLists={lists.length || 0}
            >
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId={boardId} type="COLUMN" direction="horizontal">
                        {(droppableProvided: any) => (
                            <ListsWrapper ref={droppableProvided.innerRef}>
                                {(currentBoard!.list || []).map((list: any, index: number) => (
                                    <Draggable key={list.id} draggableId={list.id} index={index}>
                                        {(provided: any) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                data-react-beautiful-dnd-draggable="0"
                                                data-react-beautiful-dnd-drag-handle="0">
                                                <List list={list} boardId={boardId} />
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                                {(currentBoard!.list || []).length < 5 && (
                                    <ListAdder
                                        numLeft={5 - (currentBoard!.list || []).length}
                                        onAddList={onAddList}
                                        showListAdder={showListAdder}
                                        setShowListAdder={setShowListAdder}
                                        newListTitle={newListTitle}
                                        setNewListTitle={setNewListTitle}
                                    />
                                )}
                            </ListsWrapper>
                        )}
                    </Droppable>
                </DragDropContext>
            </StyledBoard>
        </React.Fragment>: <></>
    );
};



export default Board;
