import styled from "styled-components";

export const Container = styled.div`
  margin-top: 8px;

  @media (min-width: 680px) {
    margin-top: 16px;
  }

  > div {
    padding: 15px 40px 50px 12px;

    header {
      display: flex;

      .avatar-skeleton {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 15px;
        flex: 1;

        .row-skeleton {
          height: 12px;

          &:nth-child(1) {
            width: 30%;
          }
          &:nth-child(2) {
            margin-top: 10px;
            width: 55%;
          }
        }
      }
    }
    span {
      display: flex;
      flex-direction: column;
      margin-top: 30px;

      .row-skeleton {
        height: 12px;

        &:nth-child(1) {
          width: 100%;
        }
        &:nth-child(2) {
          margin-top: 10px;
          width: 90%;
        }
      }
    }
  }
`;
