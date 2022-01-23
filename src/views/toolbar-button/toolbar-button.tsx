
import { MouseEventHandler, ReactNode } from 'react'
import './toolbar-button.scss'

export default function ToolbarButtonView(props: {
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  icon: ReactNode
  title?: string
}) {
  return (
    <button {...props} className="toolbar-button">
      {props.icon}
    </button>
  )
}
