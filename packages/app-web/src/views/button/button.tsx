
import './button.scss'
import IconView, { Icon } from '../../views/icon/icon'
import { mergeModifiers, renderClassName, ViewModifiers } from '../../lib/utils/dom'
import { labelKeyCombination } from '../../lib/utils/keyboard'

type ButtonViewProps =
  Omit<React.ComponentPropsWithoutRef<'button'>, 'className'> &
  Omit<React.ComponentPropsWithoutRef<'a'>, 'className'> &
  {
    as?: 'button' | 'a'
    icon?: Icon
    modifiers?: ViewModifiers
    keyCombination?: string
  }

/**
 * Button component with an optional icon and label (via children).
 */
export default function ButtonView (props: ButtonViewProps): JSX.Element {
  const {
    children,
    icon,
    keyCombination,
    modifiers = [],
    title,
    ...buttonProps
  } = props

  const buttonModifiers = icon !== undefined
    ? mergeModifiers(modifiers, ['icon'])
    : modifiers

  let titleWithKeyCombination = title
  if (keyCombination !== undefined) {
    const keyCombinationLabel = labelKeyCombination(keyCombination)
    if (titleWithKeyCombination === undefined) {
      titleWithKeyCombination = keyCombinationLabel
    } else {
      titleWithKeyCombination += ` (${keyCombinationLabel})`
    }
  }

  const inner = (
    <>
      {icon !== undefined && (
        <div className='button__icon'>
          <IconView icon={icon} />
        </div>
      )}
      {children !== undefined && (
        <span className='button__label'>
          {children}
        </span>
      )}
    </>
  )

  if (props.as === 'a') {
    return (
      <a
        className={renderClassName('button', buttonModifiers)}
        title={titleWithKeyCombination}
        {...buttonProps}
      >
        {inner}
      </a>
    )
  } else {
    return (
      <button
        className={renderClassName('button', buttonModifiers)}
        title={titleWithKeyCombination}
        {...buttonProps}
      >
        {inner}
      </button>
    )
  }
}
