import styled, {css} from "styled-components";
import {AiFillLike, AiOutlineLike} from "react-icons/ai";
import {Link} from "react-router-dom";
import {RiMessage2Line, RiSendPlaneLine, RiShareForwardLine} from "react-icons/ri";

export const Container = styled.div`
  margin-top: 8px;

  @media (min-width: 680px) {
    margin-top: 16px;
  }
`;

export const Row = styled.div`
  display: flex;
  margin: 0 16px;
  
  &.content {
    padding: 0px 0 8px;
    color: var(--color-black);
    word-break: break-word;
  }

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
  &.likes {
    padding: 8px 0;
    font-size: 12px;
    color: var(--color-gray);

    .thumbsUp {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #1385bd;
    }
    .number {
      margin-left: 8px;
    }
  }
  &.actions {
    justify-content: flex-start;

    button {
      background: none;
      border: none;
      outline: none;
      color: var(--color-gray);
      font-size: 14px;
      font-weight: 600;
      padding: 14px 8px;

      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      span {
        display: none;

        @media (min-width: 680px) {
          display: unset;
        }
      }
    }
  }
`;

export const PostImage = styled.img`
  width: 100%;
`;

export const PostVideo = styled.video`
  width: 100%;
`;

export const PostDocument = styled.iframe`
  width: 100%;
`;

export const StyledLink = styled(Link)`
  &:hover {
    opacity: 0.3;
  }
  color: var(--color-link);
  textDecoration: none;
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  border-top: 1px solid var(--color-separator);
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 8px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const iconCSS = css`
  width: 24px;
  height: 24px;
  margin-right: 4px;
`;

export const OutlineLikeIcon = styled(AiOutlineLike)`
  ${iconCSS}
`;

export const FilledLikeIcon = styled(AiFillLike)`
  ${iconCSS}
`;

export const CommentIcon = styled(RiMessage2Line)`
  ${iconCSS}
`;

export const ShareIcon = styled(RiShareForwardLine)`
  ${iconCSS}
`;

export const SendIcon = styled(RiSendPlaneLine)`
  ${iconCSS}
`;
