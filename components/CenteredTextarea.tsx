'use client'

import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`

const StyledTextarea = styled.textarea`
  font-family: inherit;
  font-size: 16px;
  padding: 12px 16px;
  width: 400px;
  min-height: 120px;
  background: var(--bg);
  color: var(--maintext);
  border: 2px solid var(--accentcyan);
  border-radius: 8px;

  &:focus {
    outline: none;
    border-color: hsl(205, 41%, 31%);
  }
`

export default function CenteredTextarea({ ref, ...props }: React.ComponentPropsWithRef<'textarea'>) {
  return (
    <Wrapper>
      <StyledTextarea ref={ref} {...props} />
    </Wrapper>
  )
}
