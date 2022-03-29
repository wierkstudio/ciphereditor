
import './toolbar.scss'
import { ReactNode } from 'react'

export default function ToolbarView (props: {
  items: Array<ReactNode|ReactNode[]>
}): JSX.Element {
  return (
    <div className='toolbar' role='toolbar'>
      {props.items.map((item, index) =>
        !Array.isArray(item)
          ? (
            <div key={index} className='toolbar__button'>
              {item}
            </div>
            )
          : (
            <div key={index} className='toolbar__group'>
              {item.map((item, index) => (
                <div key={index} className='toolbar__button'>
                  {item}
                </div>
              ))}
            </div>
            ))}
    </div>
  )
}
