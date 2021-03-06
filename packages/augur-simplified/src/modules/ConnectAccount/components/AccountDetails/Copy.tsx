import React from 'react'
import { CheckCircle, Copy } from 'react-feather'
import { useCopyClipboard } from '../../hooks'

const CopyIcon = ({ darkMode, onClick, children }) => (
  <button onClick={onClick} className="LinkStyledButton" style={{
    color: `${darkMode ? '#C3C5CB' : '#565A69'}`
  }}>
    {children}
  </button>
)

const TransactionStatusText = ({ children }) => (
  <span style={{
    marginLeft: '0.25rem',
    fontSize: '0.825rem',
    alignItems: 'center',
  }}>
    {children}
  </span>
)

export default function CopyHelper(props: { darkMode: boolean, toCopy: string; children?: React.ReactNode }) {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <CopyIcon darkMode={props.darkMode} onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <CheckCircle size={'16'} />
          <TransactionStatusText>Copied</TransactionStatusText>
        </TransactionStatusText>
      ) : (
        <TransactionStatusText>
          <Copy size={'16'} />
        </TransactionStatusText>
      )}
      {isCopied ? '' : props.children}
    </CopyIcon>
  )
}
