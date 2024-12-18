/** @jsxImportSource @emotion/react */
import { Global, css } from "@emotion/react";
import Table from "./components/Table";

const globalStyles = css`
  html,
  body,
  #root {
    min-height: 100vh;
  }

  body {
    font-family: "Inter", serif;
    background-color: #161925;
    color: #f1f1f1;
  }
`;

export default function App() {
  return (
    <div
      css={css`
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      `}
    >
      <Global styles={globalStyles} />
      <h1
        css={css`
          text-align: center;
          font-weight: 200;
        `}
      >
        Тестовое задание | Mirror App
      </h1>

      <Table />
    </div>
  );
}
