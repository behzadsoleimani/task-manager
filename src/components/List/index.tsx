import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Button from '../Button';
import ListCard from '../ListCard';
import ListTitleButton from '../ListTitleButton';
import DeleteListButton from '../DeleteListButton';
import DeleteCardButton from '../DeleteCardButton';
import EditCardButton from '../EditCardButton';
import CardTextarea from '../CardTextarea';
import ListTitleTextarea from '../ListTitleTextarea';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { addCard, editListTitle, deleteList, deleteCard, editCardTitle } from '../../redux/board';
import { ICard } from '../../types/global-types';


const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0 10px;
`;

const ListTitleTextareaWrapper = styled.div`
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
`;

const CardTextareaWrapper = styled(TextareaWrapper)`
  margin: 0 10px 10px 10px;
`;

const ComposerWrapper = styled.div`
  display: flex;
  justify-content: center;
  background: #f8f8f8;
  padding: 0 0 10px 0;
  border: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const ListTitle = styled.div`
  display: flex;
  flex-shrink: 0;
  height: 48px;
  align-items: center;
  color: rgb(46, 68, 78);
`;

const CardTitle = styled.div`
  background: white;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.1);
  margin: 0 10px 10px 10px;
  padding: 8px;
  border-radius: 5px;
  position: relative;
  overflow-wrap: break-word;
  overflow: visible;
  word-wrap: break-word;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover,
  &:active,
  &:focus {
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.3);
  }
`;

const ButtonWrapper = styled.div`
  height: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const List = ({ boardId, list }: any) => {
  const [newCardFormIsOpen, setNewCardFormIsOpen] = useState(false);
  const [isListTitleInEdit, setIsListTitleInEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cardInEdit, setCardInEdit] = useState("");
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [tempCardTitle, setTempCardTitle] = useState('');
  const dispatch = useAppDispatch();
  const boards = useAppSelector(state => state.boards);
  const currentBoard = boards.filter(board => board.id === boardId);
  const currentList = currentBoard[0]!.list!.filter(l => l.id === list.id);
  const cards = currentList![0]!.cards;
  const toggleCardComposer = () => setNewCardFormIsOpen(!newCardFormIsOpen);

  const handleCardComposerChange = (event: any) => {
    setNewCardTitle(event.target.value);
  };

  const handleKeyDown = (callback: any) => (event: any) => {
    if (event.key === 'Enter') {
      callback(event);
    }
  };

  const handleSubmitCard = (event: any) => {
    event.preventDefault();
    setNewCardFormIsOpen(false);
    if (newCardTitle.length < 1) return;
    onSubmitCard();
  };

  const openCardEditor = (event: any, card: ICard) => {
    event.preventDefault();
    setCardInEdit(card.id);
    setTempCardTitle(card.title);
  };

  const handleCardEditorChange = (event: any) => {
    setTempCardTitle(event.target.value);
  };

  const handleListTitleEditorChange = (event: any) => {
    setNewListTitle(event.target.value);
  };

  const handleCardEdit = async (e: any) => {
    e.preventDefault();
    if (tempCardTitle.length < 1) {
      onDeleteCard(cardInEdit);
    } else {
      onEditCard();
    }
  };

  const handleDeleteCard = (cardId: string) => (event: any) => {
    event.preventDefault();
    onDeleteCard(cardId);
  };

  const openTitleEditor = () => {
    setIsListTitleInEdit(true);
    setNewListTitle(list.title);
  };

  const handleSubmitListTitle = () => {
    if (newListTitle.length < 1) {
      setIsListTitleInEdit(false);
      return;
    }
    onEditListTitle(newListTitle.trim(), list.id, boardId);
  };

  const handleDeleteListButtonClick = (event: any) => {
    event.preventDefault();
    onDeleteList(list.id, boardId);
  };

  const onSubmitCard = async () => {
    setIsLoading(true);
    await dispatch(addCard({ cardTitle: newCardTitle, listId: list.id, boardId }));
    setIsLoading(false);
    setNewCardTitle('');
  };

  const onEditCard = async () => {
    await dispatch(
      editCardTitle({
        cardTitle: tempCardTitle.trim(),
        cardId: cardInEdit,
        listId: list.id,
        boardId
      })
    )
      setTempCardTitle('');
      setCardInEdit('');
  };

  const onDeleteCard = (cardId: any) => {
    dispatch(deleteCard({ cardId, listId: list.id, boardId }));
  };

  const onEditListTitle = async (listTitle: string, listId: string, boardId: string) => {
    setIsListTitleInEdit(true);
    await dispatch(editListTitle({ listTitle, listId, boardId }))
    setNewListTitle('');
    setIsListTitleInEdit(false);
  };

  const onDeleteList = (listId: string, boardId: string) => {
    dispatch(deleteList({ listId, boardId }));
  };


  return (
    <ListCard>
      {isListTitleInEdit ? (
        <ListTitleTextareaWrapper>
          <ListTitleTextarea
            value={newListTitle}
            onChange={handleListTitleEditorChange}
            onKeyDown={handleKeyDown(handleSubmitListTitle)}
            onBlur={handleSubmitListTitle}
          />
        </ListTitleTextareaWrapper>
      ) : (
        <ListTitle>
          <ListTitleButton onFocus={openTitleEditor} onClick={openTitleEditor} text={list.title} />
          <DeleteListButton onClick={(e: any) => handleDeleteListButtonClick(e)} />
        </ListTitle>
      )}
      <Droppable droppableId={list.id}>
        {(provided) => (
          <div ref={provided.innerRef}>
            {(cards || []).map((card: any, index: any) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {({ innerRef, draggableProps, dragHandleProps, placeholder }: any) => (
                  <div>
                    {cardInEdit !== card.id ? (
                      <CardTitle
                        ref={innerRef}
                        {...draggableProps}
                        {...dragHandleProps}
                        data-react-beautiful-dnd-draggable="0"
                        data-react-beautiful-dnd-drag-handle="0">
                        {card.title}
                        <ButtonWrapper>
                          <DeleteCardButton onClick={handleDeleteCard(card.id)} />
                          <EditCardButton onClick={(e: any) => openCardEditor(e, card)} />
                        </ButtonWrapper>
                      </CardTitle>
                    ) : (
                      <TextareaWrapper ref={innerRef} {...draggableProps} {...dragHandleProps}>
                        <CardTextarea
                          value={tempCardTitle}
                          onChange={handleCardEditorChange}
                          onKeyDown={handleKeyDown(handleCardEdit)}
                          onBlur={handleCardEdit}
                        />
                      </TextareaWrapper>
                    )}
                    {placeholder}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {(newCardFormIsOpen || isLoading) && (
              <CardTextareaWrapper>
                <CardTextarea
                  value={newCardTitle}
                  onChange={handleCardComposerChange}
                  onKeyDown={handleKeyDown(handleSubmitCard)}
                  onBlur={handleSubmitCard}
                />
                <Button variant="add" onClick={handleSubmitCard} text="Add" disabled={newCardTitle === ''} />
              </CardTextareaWrapper>
            )}
            {!newCardFormIsOpen &&
              !isLoading && (
                <ComposerWrapper>
                  <Button variant="card" text="Add new card" onClick={toggleCardComposer}>
                    Add new card
                  </Button>
                </ComposerWrapper>
              )}
          </div>
        )}
      </Droppable>
    </ListCard>
  );
};


export default List;
