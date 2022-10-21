
import './button.scss'
import IconView, { Icon } from '../../views/icon/icon'
import { mergeModifiers, renderClassName, ViewModifiers } from '../../lib/utils/dom'
import { labelKeyCombination } from '../../lib/utils/keyboard'

type ButtonViewProps =
  Omit<React.ComponentPropsWithoutRef<'button'>, 'className'> &
  {
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

  return (
    <button
      className={renderClassName('button', buttonModifiers)}
      title={titleWithKeyCombination}
      {...buttonProps}
    >
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
    </button>
  )
}
