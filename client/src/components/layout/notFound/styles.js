import styled from "styled-components";

export const Container = styled.section`
    position: relative;
    height: 100vh;
    > div {
        right: 50%;
        bottom: 50%;
        transform: translate(50%,50%);
        position: absolute;
        text-align: center;
    }
`;

export const Span = styled.span`
  display:table;
  margin: 16px auto;
  align-items: center;
`;

export const Separator = styled.div`
  width: 100%;
  height: 16px;
`;