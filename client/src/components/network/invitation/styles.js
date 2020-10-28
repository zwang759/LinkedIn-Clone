import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  min-width: 600px;
  max-width: 800px;
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  border-top: 1px solid var(--color-separator);
  &:last-child {
    display: none;
  }
`;
