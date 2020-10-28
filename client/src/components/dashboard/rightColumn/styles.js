import styled from "styled-components";

export const Container = styled.div`
  width: 312px;

  > div + div {
    margin-top: 8px;
  }
`;
