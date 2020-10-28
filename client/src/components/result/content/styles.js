import styled from "styled-components";

export const Container = styled.div`
  min-width: 700px;
  height: 100%;
  margin: 55px 70px 50px;
`;

export const Panel = styled.div`
  background: var(--color-white);
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.2);
  
  &.filter-Panel {
     margin: 52px 0 0px;
     padding: 12px;
     display: "flex";
     justify-content: "space-between";
     align-items: "center";
     min-width: 700px;
  }
`;