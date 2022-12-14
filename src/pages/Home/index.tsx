import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaTimesCircle } from 'react-icons/fa';
import Button from '../../components/Button';
import EditCardButton from '../../components/EditCardButton';
import BoardTextarea from '../../components/CardTextarea';
import { addBoard, deleteBoard, generateExampleBoard, editBoardTitle } from '../../redux/board';
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { IBoard } from '../../types/global-types';

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0 10px;
`;

const HomeTitle = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ButtonWrapper = styled.div`
  height: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledLink = styled(Link)`
  &:hover,
  &:focus,
  &:active {
    opacity: 0.85;
  }
`;

const StyledForm = styled.form`
  margin: 12px 0 0 0;
  width: 100%;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledOr = styled.div`
  margin: 8px 0;
  font-size: 14px;
  font-weight: 500;
`;

const StyledInput = styled.input`
  width: 400px;
  color: rgb(46, 68, 78);
  border-radius: 4px;
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 8px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-family: inherit;
  outline: none;
  resize: none;
  font-size: 16px;
  margin-right: 12px;

  &:hover,
  &:focus,
  &:active {
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.3);
  }
`;

const List = styled.div`
  margin: 1rem 0;
  padding: 12px 12px 12px;
  background: #f8f8f8;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  width: 500px;

  @media (max-width: 768px) {
    width: 320px;
    font-size: 14px;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px 0;
`;

const StyledDeleteBoardButton = styled.button`
  border: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: transparent;
  color: rgb(46, 68, 78);
  cursor: pointer;
  font-size: 16px;
  opacity: 0.8;

  &:hover,
  &:focus,
  &:active {
    color: #da3849;
    opacity: 1;
  }
`;

const Home = () => {
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [boardInEdit, setBoardInEdit] = useState("");
  const [tempBoardTitle, setTempBoardTitle] = useState('');
  const dispatch = useAppDispatch();
  const boards = useAppSelector(state => state.boards);


  const handleTitleChange = (event: any) => setNewBoardTitle(event.target.value);

  const handleAddBoard = (boardTitle: string) => (event: any) => {
    event.preventDefault();
    onAddBoard(boardTitle);
  };

  const handleDeleteBoard = (boardId: string) => (event: any) => {
    event.preventDefault();
    onDeleteBoard(boardId);
  };

  const handleGenerateExampleBoard = (event: any) => {
    event.preventDefault();
    onGenerateExampleBoard();
  };

  const onAddBoard = async (boardTitle: string) => {
    setIsLoading(true);
    dispatch(addBoard({ title: boardTitle, id: `${new Date().getTime()}` }));
    setNewBoardTitle('')
    setIsLoading(false);
  };

  const onDeleteBoard = async (boardId: string) => {
    setIsLoading(true);
    dispatch(deleteBoard(boardId))
    setIsLoading(false);
  };

  const openBoardEditor = (event: any, board: IBoard) => {
    event.preventDefault();
    setBoardInEdit(board.id);
    setTempBoardTitle(board.title);
  };

  const handleBoardEditorChange = (event: any) => {
    setTempBoardTitle(event.target.value);
  };

  const handleBoardEdit = async (e: any) => {
    e.preventDefault();
    if (tempBoardTitle.length < 1) {
      onDeleteBoard(boardInEdit);
    } else {
      onEditBoard();
    }
  };

  const onEditBoard = async () => {
    await dispatch(
      editBoardTitle({
        boardTitle: tempBoardTitle.trim(),
        boardId: boardInEdit,
      })
    )
      setTempBoardTitle('');
      setBoardInEdit('');
  };

  const handleKeyDown = (callback: any) => (event: any) => {
    if (event.key === 'Enter') {
      callback(event);
    }
  };

  const onGenerateExampleBoard = async () => {
    setIsLoading(true);
    dispatch(generateExampleBoard())
    setIsLoading(false);
  };



  return (
    <StyledHome>
      <HomeTitle>Pick a board...</HomeTitle>
      <List>
        {boards.map((board: any) => (
          <Row key={`row-${board.id}`}>
            {boardInEdit !== board.id ? (
              <>
            <StyledLink to={`board/${board.id}`}>{board.title}</StyledLink>
            <ButtonWrapper>
            <StyledDeleteBoardButton onClick={handleDeleteBoard(board.id)}>
              <FaTimesCircle size={18} />
            </StyledDeleteBoardButton>
            <EditCardButton onClick={(e: any) => openBoardEditor(e, board)} />
            </ButtonWrapper>
            </>) : (
              <TextareaWrapper >
                <BoardTextarea
                  value={tempBoardTitle}
                  onChange={handleBoardEditorChange}
                  onKeyDown={handleKeyDown(handleBoardEdit)}
                  onBlur={handleBoardEdit}
                />
              </TextareaWrapper>)}

          </Row>
        ))}
        <StyledForm onSubmit={handleAddBoard(newBoardTitle)}>
          <FormRow>
            <StyledInput value={newBoardTitle} onChange={handleTitleChange} placeholder="Add a new board" />
            <Button variant="board" type="submit" value="Submit" text="Add" disabled={!newBoardTitle || isLoading}
              data-testid="addButton" />
          </FormRow>
          <StyledOr>or</StyledOr>
          <Button
            variant="example"
            text="Generate Example Board"
            onClick={handleGenerateExampleBoard}
            disabled={isLoading}
          />
        </StyledForm>
      </List>
    </StyledHome>
  );
};



export default Home;
