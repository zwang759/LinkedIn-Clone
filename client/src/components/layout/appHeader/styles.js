import styled, {css} from "styled-components";
import {GrLinkedin} from "react-icons/gr";
import {AiFillCaretDown, AiFillHome, AiOutlineBell} from "react-icons/ai";
import {BsFillPeopleFill} from "react-icons/bs";

export const Container = styled.div`
  background: var(--color-header);
  padding: 0 30px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: block;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  max-width: 1128px;
  margin: 0;
  height: 52px;

  .left,
  .right nav {
    display: flex;
    align-items: center;
  }

  .right nav {
    height: 100%;

    button {
      background: none;
      border: 0;
      outline: 0;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 90px;
      min-height: 100%;

      color: var(--color-icons);
      cursor: pointer;
      &:hover {
        color: var(--color-white);
      }
      &.active {
        border-bottom: 2px solid var(--color-white);
      }
    }
  }
`;

export const LinkedInIcon = styled(GrLinkedin)`
  height: 34px;
  width: 34px;
  color: var(--color-linkedin);
  background-color: #fff;
  border-radius: 4px;
`;

export const SearchInput = styled.input`
  margin-left: 12px;

  background: var(--color-input);
  color: var(--color-black);
  font-size: 14px;
  padding: 7.5px 8px;
  border: none;
  outline: none;
  border-radius: 2px;
  width: 300px;

  &:focus {
    background: var(--color-white);
  }
`;

const generalIconCSS = css`
  width: 24px;
  height: 24px;
`;

export const HomeIcon = styled(AiFillHome)`
  ${generalIconCSS}
`;

export const NotificationsIcon = styled(AiOutlineBell)`
  ${generalIconCSS}
`;

export const NetworkIcon = styled(BsFillPeopleFill)`
  ${generalIconCSS}
`;

export const ProfileCircle = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--color-icons);
`;

export const CaretDownIcon = styled(AiFillCaretDown)`
  width: 16px;
  height: 16px;
`;
