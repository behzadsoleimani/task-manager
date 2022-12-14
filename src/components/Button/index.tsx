import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(46, 68, 78);
  line-height: 18px;
  border: none;
  transition-duration: 0.085s;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: ${({variant} : any) => (variant === 'list' ? '5px' : '3px')};
  font-weight: ${({variant} : any) => (variant === 'list' ? '600' : '500')};
  font-size: ${({variant} : any) => (['list', 'board', 'example'].includes(variant) && '14px') || '13px'};
  margin: ${({variant} : any) => (variant === 'list' ? '8px' : '0')};
  width: ${({variant} : any) => (variant === 'list' && '268px') || (variant === 'board' && '70px') || 'auto'};
  height: ${({variant} : any) =>
    (variant === 'list' && '48px') || (['board', 'example'].includes(variant) && '34px') || 'auto'};
  transition-timing-function: ease-in;
  background-color: ${({variant} : any) =>
    (variant === 'card' && '#fcd1f0') ||
    (variant === 'list' && '#fcddd1') ||
    (variant === 'board' && '#d1f7c4') ||
    (variant === 'add' && '#d1f7c4') ||
    (variant === 'example' && '#fcb400') ||
    '#fff'};

  &:hover,
  &:focus,
  &:active {
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.2);
  }
  &:disabled {
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Button = ({text, ...props}: any) => {
  return <StyledButton {...props}>{text}</StyledButton>;
};



export default Button;
