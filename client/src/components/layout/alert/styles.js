import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  position: fixed;
  top: 52px;
  left: 0;
  right: 0;
  padding: 30px;
  margin: 0;
 
  opacity: 0.8;
  background: var(--color-blue);
  text-align: center;
  color: #333;
    &.primary {
        background: var(--color-blue);
        color: var(--color-white);
    }
    
    &.dark {
        background: var(--color-black);
        color: var(--color-white);
    }
    
    &.danger {
        background: var(--color-danger);
        color: var(--color-white);
    }
    
    &.success {
        background: var(--color-success);
        color: var(--color-white);
    }
`;
