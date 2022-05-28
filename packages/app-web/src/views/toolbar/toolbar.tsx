
import './toolbar.scss'

export default function ToolbarView (props: {
  children: JSX.Element | Array<JSX.Element | false>
}): JSX.Element {
  return (
    <div className='toolbar' role='toolbar'>
      {Array.isArray(props.children)
        ? props.children
          .filter(button => button !== false)
          .map((button, index) => (
            <div key={index} className='toolbar__button'>
              {button}
            </div>
          ))
        : (
          <div className='toolbar__button'>
            {props.children}
          </div>
          )}
    </div>
  )
}

const GroupView = (props: {
  children: Array<JSX.Element | false>
}): JSX.Element => {
  return (
    <div className='toolbar__group'>
      {props.children
        .filter(button => button !== false)
        .map((button, index) => (
          <div key={index} className='toolbar__button'>
            {button}
          </div>
        ))}
    </div>
  )
}

ToolbarView.GroupView = GroupView
