import styled from "styled-components";

export const Container = styled.div`
  .row + .row {
    margin-top: 23px;
  }
  .row {
    display: flex;
    align-items: center;

    .square-skeleton {
      width: 48px;
      height: 48px;
      border-radius: 2px;
    }

    .column {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding-left: 10px;

      .row-skeleton {
        height: 12px;

        &:nth-child(1) {
          width: 50%;
        }
        &:nth-child(2) {
          margin-top: 10px;
          width: 100%;
        }
      }
    }
  }
`;
