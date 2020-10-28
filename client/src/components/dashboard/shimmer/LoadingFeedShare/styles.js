import styled from "styled-components";

export const Container = styled.div`
  > div {
    padding: 40px 40px 40px 12px;

    display: flex;
    flex-direction: column;

    .row-skeleton {
      height: 12px;

      &:nth-child(1) {
        width: 100%;
      }
      &:nth-child(2) {
        width: 90%;
        margin-top: 20px;
      }
    }
  }
`;
