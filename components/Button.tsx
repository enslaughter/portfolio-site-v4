'use client'

import styled from 'styled-components'

const Button = styled.button`
  border: none;
  color: var(--bg);
  font-size: 16px;
  font-family: inherit;
  letter-spacing: 2px;
  max-width: 200px;
  padding: 16px 24px;
  background: hsl(205, 41%, 21%);

  &:hover {
    background-color: hsl(205, 41%, 31%);
    cursor: pointer;
  }
`

export default Button
