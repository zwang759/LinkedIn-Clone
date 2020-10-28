import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  
  @media (min-width: 680px) {

    > main {
      margin: 80px 0px 30px;
      padding: 20px 0;
      display: flex;
      justify-content: center;
      min-width: 1200px;
    }
  }

  .left-column,
  .right-column {
    display: none;
  }

  @media (min-width: 680px) {
    .left-column,
    .right-column {
      min-width: 200px;
      display: unset;
    }

    .middle-column {
      margin: 0 25px 16px;
    }
  }
`;
