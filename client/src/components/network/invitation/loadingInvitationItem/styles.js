import styled from "styled-components";

export const LoadingContainer = styled.div`

  > div {
    padding: 12px;

    header {
      display: flex;

      .avatar-skeleton {
        width: 72px;
        height: 72px;
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
            width: 30%;
          }
          &:nth-child(2) {
            margin-top: 14px;
            width: 15%;
          }
        }
      }
    }
  }
`;