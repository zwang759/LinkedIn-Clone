import styled from "styled-components";
import {Link} from "react-router-dom";

export const StyledLink = styled(Link)`
  &:hover {
    opacity: 0.3;
  }
`;

export const Row = styled.div`
  display: flex;
  margin: 0 16px;
  &.heading {
    padding: 12px 0 8px;

    h3 {
      font-size: 14px;
      color: var(--color-black);
    }
    h4,
    time {
      font-size: 12px;
      font-weight: normal;
      color: var(--color-gray);
    }
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-right: 8px;
`;