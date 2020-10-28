import styled, {css} from "styled-components";
import {BsPencilSquare} from "react-icons/bs";
import {AiOutlineCamera, AiOutlineFileText, AiOutlineVideoCamera} from "react-icons/ai";

export const Container = styled.div`
  color: var(--color-gray);
  margin-top: 57px;
  @media (min-width: 680px) {
    margin-top: 0px;
  }

  .write {
    margin-left: 14px;
    display: flex;
    padding: 16px 0;
    align-items: center;
    > span {
      margin-left: 4px;
      font-weight: 600;
    }
  }
  
  .upload {
    display: flex;
    padding: 12px 0;
    align-items: center;
    > span {
      font-weight: 600;
    }
  }
  
  .attachment {
    display: none;

    @media (min-width: 680px) {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      height: 100%;
      border-top: 1px solid var(--color-separator);
    }
  }
`;

const iconCSS = css`
  width: 24px;
  height: 24px;
  margin-right: 4px;
`;

export const WriteIcon = styled(BsPencilSquare)`
  ${iconCSS}
`;

export const CameraIcon = styled(AiOutlineCamera)`
  ${iconCSS}
  color: #33aada;
`;

export const VideoCameraIcon = styled(AiOutlineVideoCamera)`
  ${iconCSS}
  color: #9896f2;
`;

export const DocumentIcon = styled(AiOutlineFileText)`
  ${iconCSS}
  color: #17afb8;
`;
