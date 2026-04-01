'use client'

import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  :root {
    margin: 0;
    padding: 0;
    height: 100%;
    --bg: #fafafa;
    --maintext: #33323d;
    --accentcyan: #5fb4a2;
  }

  body {
    background: var(--bg);
    color: var(--maintext);
    font-family: var(--font-montserrat), sans-serif;
    font-weight: 400;
    font-size: 16px;
  }
`

export default GlobalStyles
