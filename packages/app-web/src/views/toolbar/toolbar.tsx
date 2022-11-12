
import { renderClassName, ViewModifiers } from '../../lib/utils/dom'
import LogoView from '../logo/logo'
import './toolbar.scss'

export default function ToolbarView (props: {
  children: JSX.Element | Array<JSX.Element | false>
}): JSX.Element {
  return (
    <div className='toolbar' role='toolbar'>
      {Array.isArray(props.children)
        ? (props.children.filter(child => child !== false) as JSX.Element[])
            .map((child, index) => {
              if (child.type === BrandView || child.type === SpacerView) {
                return child
              }
              return (
                <div key={index} className='toolbar__button'>
                  {child}
                </div>
              )
            })
        : (
          <div className='toolbar__button'>
            {props.children}
          </div>
          )}
    </div>
  )
}

const BrandView = (): JSX.Element => {
  return (
    <div className='toolbar__brand'>
      <LogoView />
    </div>
  )
}

const GroupView = (props: {
  children: Array<JSX.Element | false>
  modifiers?: ViewModifiers
}): JSX.Element => {
  return (
    <div className={renderClassName('toolbar__group', props.modifiers)}>
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

const SpacerView = (): JSX.Element => {
  return (
    <div className='toolbar__spacer' />
  )
}

ToolbarView.BrandView = BrandView
ToolbarView.GroupView = GroupView
ToolbarView.SpacerView = SpacerView
