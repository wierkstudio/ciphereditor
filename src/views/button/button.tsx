
import './button.scss'
import IconView, { Icon } from 'views/icon/icon'
import useClassName, { ViewModifiers } from 'hooks/useClassName'

type ButtonViewProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'className'> & {
  icon?: Icon,
  modifiers?: ViewModifiers,
}

/**
 * Button component with an optional icon and label (via children).
 */
export default function ButtonView(props: ButtonViewProps) {
  const { icon, modifiers, children, ...buttonProps } = props
  return (
    <button className={useClassName('button', modifiers)} {...buttonProps}>
      {icon && (
        <div className="button__icon">
          <IconView icon={icon} />
        </div>
      )}
      {children && (
        <span className="button__label">
          {children}
        </span>
      )}
    </button>
  )
}
