import styled from "styled-components";

export const Separator = styled.div`
  height: 1px;
  margin-left: 88px;
  border-top: 1px solid var(--color-separator);
  &:last-child {
    display: none;
  }
`;

export const Container = styled.div`
  min-width: 700px;
  height: 100%;
  margin: 0px 0px 16px;
`;

export const Panel = styled.div`
  background: var(--color-white);
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.2);
  
  &.filter-Panel {
     margin: 52px 0 0px;
     padding: 12px;
     display: flex;
     justify-content: space-between;
     align-items: center;
     min-width: 700px;
  }
  
  &.display-Panel {
        margin: 52px 400px 52px 74px;
        padding: 12px;
        flexShrink: 0;
        justifyContent: space-between;
        alignItems: "center";
        min-width: 600px;
  }
`;