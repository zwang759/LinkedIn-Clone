import {createGlobalStyle} from "styled-components";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body, #root {
    height: auto;
    width: 100%;
    background: var(--color-background);
  }
  *, button, input {
    font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Fira Sans,Ubuntu,Oxygen,Oxygen Sans,Cantarell,Droid Sans,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Lucida Grande,Helvetica,Arial,sans-serif;
  }
  :root {
    --color-header: #283e4a;
    --color-linkedin: #0077b5;
    --color-input: #e1e9ee;
    --color-icons: #c7d1d8;
    --color-hashtag: #7a8b98;
    --color-background: #f5f5f5;
    --color-success: #28a745;
    --color-danger: #dc3545;
    --color-link: #0073b1;
    --color-blue: #2dc0f4;
    --color-black: rgba(0,0,0,.9);
    --color-gray: rgba(0,0,0,.6);
    --color-separator: rgba(0,0,0,0.15);
    --color-white: #fff;
  }
`;
