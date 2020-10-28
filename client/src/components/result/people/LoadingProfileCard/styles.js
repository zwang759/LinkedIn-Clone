import styled from "styled-components";

export const Container = styled.div`

  > div {
    padding: 12px;

    header {
      display: flex;

      .avatar-skeleton {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 8px;
        flex: 1;

        .row-skeleton {
          height: 12px;

          &:nth-child(1) {
            width: 15%;
          }
          &:nth-child(2) {
            margin-top: 8px;
            width: 30%;
          }
          &:nth-child(3) {
            margin-top: 8px;
            width: 15%;
          }
        }
      }
    }
  }
`;
