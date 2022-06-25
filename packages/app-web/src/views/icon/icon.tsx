
import './icon.scss'
import { renderClassName, ViewModifiers } from '../../utils/dom'

type SVGProps = React.ComponentPropsWithoutRef<'svg'>

const iconSVGMap = {
  /** Icon by Iconic (https://iconic.app/arrow-up/) */
  arrowUp: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M17.25 10.25L12 4.75L6.75 10.25' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M12 19.25V5.75' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/chevron-down/) */
  chevronDown: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M15.25 10.75L12 14.25L8.75 10.75' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/close/) */
  close: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M17.25 6.75L6.75 17.25' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6.75 6.75L17.25 17.25' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/copy/) */
  copy: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6.5 15.25V15.25C5.5335 15.25 4.75 14.4665 4.75 13.5V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H13.5C14.4665 4.75 15.25 5.5335 15.25 6.5V6.5' />
      <rect width='10.5' height='10.5' x='8.75' y='8.75' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' rx='2' />
    </svg>
  ),
  /** Icon derived from Iconic (https://iconic.app/chevron-down/) */
  doubleChevron: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24'>
      <path d='M15.7603 10.7996C15.4568 11.0814 14.9823 11.0639 14.7004 10.7603L12 7.85221L9.29959 10.7603C9.01774 11.0639 8.54319 11.0814 8.23966 10.7996C7.93613 10.5177 7.91855 10.0432 8.2004 9.73966L11.4504 6.23966C11.5923 6.08684 11.7914 6 12 6C12.2085 6 12.4077 6.08684 12.5496 6.23966L15.7996 9.73966C16.0814 10.0432 16.0639 10.5177 15.7603 10.7996Z' fill='currentColor' />
      <path d='M8.23966 13.2004C8.5432 12.9186 9.01775 12.9361 9.2996 13.2397L12 16.1478L14.7004 13.2397C14.9823 12.9361 15.4568 12.9186 15.7603 13.2004C16.0639 13.4823 16.0815 13.9568 15.7996 14.2603L12.5496 17.7603C12.4077 17.9132 12.2086 18 12 18C11.7915 18 11.5923 17.9132 11.4504 17.7603L8.20041 14.2603C7.91856 13.9568 7.93613 13.4823 8.23966 13.2004Z' fill='currentColor' />
    </svg>
  ),
  /** Icon by Iconic Pro (https://iconic.app/pencil/) */
  edit: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path d='M4.75 19.25L9 18.25L18.9491 8.30083C19.3397 7.9103 19.3397 7.27714 18.9491 6.88661L17.1134 5.05083C16.7228 4.6603 16.0897 4.6603 15.6991 5.05083L5.75 15L4.75 19.25Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M14.0234 7.03906L17.0234 10.0391' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  /** Icon by Iconic Pro (https://iconic.app/alert/) */
  error: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path d='M12 14.25C11.5858 14.25 11.25 14.5858 11.25 15C11.25 15.4142 11.5858 15.75 12 15.75V14.25ZM12.01 15.75C12.4242 15.75 12.76 15.4142 12.76 15C12.76 14.5858 12.4242 14.25 12.01 14.25V15.75ZM12 15.75H12.01V14.25H12V15.75Z' fill='currentColor' />
      <path d='M10.4033 5.41136L10.9337 5.94169L10.4033 5.41136ZM5.41136 10.4033L4.88103 9.87301L4.88103 9.87301L5.41136 10.4033ZM5.41136 13.5967L5.94169 13.0663L5.94169 13.0663L5.41136 13.5967ZM10.4033 18.5886L10.9337 18.0583L10.4033 18.5886ZM13.5967 18.5886L14.127 19.119L14.127 19.119L13.5967 18.5886ZM18.5886 10.4033L19.119 9.87301L19.119 9.87301L18.5886 10.4033ZM13.5967 5.41136L14.127 4.88103L14.127 4.88103L13.5967 5.41136ZM9.87301 4.88103L4.88103 9.87301L5.94169 10.9337L10.9337 5.94169L9.87301 4.88103ZM4.88103 14.127L9.87301 19.119L10.9337 18.0583L5.94169 13.0663L4.88103 14.127ZM14.127 19.119L19.119 14.127L18.0583 13.0663L13.0663 18.0583L14.127 19.119ZM19.119 9.87301L14.127 4.88103L13.0663 5.94169L18.0583 10.9337L19.119 9.87301ZM19.119 14.127C20.2937 12.9523 20.2937 11.0477 19.119 9.87301L18.0583 10.9337C18.6472 11.5226 18.6472 12.4774 18.0583 13.0663L19.119 14.127ZM9.87301 19.119C11.0477 20.2937 12.9523 20.2937 14.127 19.119L13.0663 18.0583C12.4774 18.6472 11.5226 18.6472 10.9337 18.0583L9.87301 19.119ZM4.88103 9.87301C3.70632 11.0477 3.70632 12.9523 4.88103 14.127L5.94169 13.0663C5.35277 12.4774 5.35277 11.5226 5.94169 10.9337L4.88103 9.87301ZM10.9337 5.94169C11.5226 5.35277 12.4774 5.35277 13.0663 5.94169L14.127 4.88103C12.9523 3.70632 11.0477 3.70632 9.87301 4.88103L10.9337 5.94169Z' fill='currentColor' />
      <path d='M12 8.75V12.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/help-circle/) */
  help: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M9.75 10C9.75 10 10 7.75 12 7.75C14 7.75 14.25 9 14.25 10C14.25 10.7513 13.8266 11.5027 12.9798 11.8299C12.4647 12.0289 12 12.4477 12 13V13.25' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' d='M12.5 16C12.5 16.2761 12.2761 16.5 12 16.5C11.7239 16.5 11.5 16.2761 11.5 16C11.5 15.7239 11.7239 15.5 12 15.5C12.2761 15.5 12.5 15.7239 12.5 16Z' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/information/) */
  info: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 13V15' />
      <circle cx='12' cy='9' r='1' fill='currentColor' />
      <circle cx='12' cy='12' r='7.25' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' />
    </svg>
  ),
  /** Icon by Iconic Pro (https://iconic.app/maximize-2/) */
  maximize: (props: SVGProps): JSX.Element => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path d='M4.75 14.75V19.25H9.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M19.25 9.25V4.75H14.75' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M5 19L10.25 13.75' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M19 5L13.75 10.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  /** Icon by Iconic Pro (https://iconic.app/minimize-2/) */
  minimize: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path d='M10.25 18.25V13.75H5.75' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M13.75 5.75V10.25H18.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M4.75 19.25L10.25 13.75' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M19.25 4.75L13.75 10.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/minus/) */
  minus: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M18.25 12.25L5.75 12.25' />
    </svg>
  ),
  /** Custom icon */
  outletPull: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M18.25 12.25L5.75 12.25' />
    </svg>
  ),
  /** Custom icon */
  outletPush: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24'>
      <rect x='6' y='6' width='12' height='12' rx='6' fill='#000000' />
    </svg>
  ),
  /** Custom icon */
  outletUnused: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24'>
      <path fill-rule='evenodd' clip-rule='evenodd' d='M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12ZM12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z' fill='#000000' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/plus/) */
  plus: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M12 5.75V18.25' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M18.25 12L5.75 12' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/redo/) */
  redo: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M14.75 4.75L19.25 9L14.75 13.25' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M19.25 9H8.75C6.54086 9 4.75 10.7909 4.75 13V19.25' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/refresh/) */
  refresh: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M11.25 4.75L8.75 7L11.25 9.25' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M12.75 19.25L15.25 17L12.75 14.75' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75' />
    </svg>
  ),
  /** Icon by Iconic Pro (https://iconic.app/settings-2/) */
  settings: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path d='M5.62117 14.9627L6.72197 15.1351C7.53458 15.2623 8.11491 16.0066 8.05506 16.8451L7.97396 17.9816C7.95034 18.3127 8.12672 18.6244 8.41885 18.7686L9.23303 19.1697C9.52516 19.3139 9.87399 19.2599 10.1126 19.0352L10.9307 18.262C11.5339 17.6917 12.4646 17.6917 13.0685 18.262L13.8866 19.0352C14.1252 19.2608 14.4733 19.3139 14.7662 19.1697L15.5819 18.7678C15.8733 18.6244 16.0489 18.3135 16.0253 17.9833L15.9441 16.8451C15.8843 16.0066 16.4646 15.2623 17.2772 15.1351L18.378 14.9627C18.6985 14.9128 18.9568 14.6671 19.0292 14.3433L19.23 13.4428C19.3025 13.119 19.1741 12.7831 18.9064 12.5962L17.9875 11.9526C17.3095 11.4774 17.1024 10.5495 17.5119 9.82051L18.067 8.83299C18.2284 8.54543 18.2017 8.18538 17.9993 7.92602L17.4363 7.2035C17.2339 6.94413 16.8969 6.83701 16.5867 6.93447L15.5221 7.26794C14.7355 7.51441 13.8969 7.1012 13.5945 6.31908L13.1866 5.26148C13.0669 4.95218 12.7748 4.7492 12.4496 4.75L11.5472 4.75242C11.222 4.75322 10.9307 4.95782 10.8126 5.26793L10.4149 6.31344C10.1157 7.1004 9.27319 7.51683 8.4842 7.26874L7.37553 6.92078C7.0645 6.82251 6.72591 6.93044 6.52355 7.19142L5.96448 7.91474C5.76212 8.17652 5.73771 8.53738 5.90228 8.82493L6.47 9.81487C6.88812 10.5446 6.68339 11.4814 6.00149 11.9591L5.0936 12.5954C4.82588 12.7831 4.69754 13.119 4.76998 13.442L4.97077 14.3425C5.04242 14.6671 5.30069 14.9128 5.62117 14.9627Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M13.5911 10.4089C14.4696 11.2875 14.4696 12.7125 13.5911 13.5911C12.7125 14.4696 11.2875 14.4696 10.4089 13.5911C9.53036 12.7125 9.53036 11.2875 10.4089 10.4089C11.2875 9.53036 12.7125 9.53036 13.5911 10.4089Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/share/) */
  share: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M9.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25V14.75' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M19.25 9.25V4.75H14.75' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M19 5L11.75 12.25' />
    </svg>
  ),
  /** Icon by Iconic Pro (https://iconic.app/switch/) */
  switch: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path d='M12.75 15.75L16 19.25L19.25 15.75' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M4.75 8.25L8 4.75L11.25 8.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M16 8.75V19.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M8 4.75V15.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  /** Icon by Iconic Pro (https://iconic.app/trash-2/) */
  trash: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path d='M5.75 7.75L6.59115 17.4233C6.68102 18.4568 7.54622 19.25 8.58363 19.25H14.4164C15.4538 19.25 16.319 18.4568 16.4088 17.4233L17.25 7.75H5.75Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M9.75 10.75V16.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M13.25 10.75V16.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M8.75 7.75V6.75C8.75 5.64543 9.64543 4.75 10.75 4.75H12.25C13.3546 4.75 14.25 5.64543 14.25 6.75V7.75' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M4.75 7.75H18.25' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/undo/) */
  undo: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M9.25 4.75L4.75 9L9.25 13.25' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M5.5 9H15.25C17.4591 9 19.25 10.7909 19.25 13V19.25' />
    </svg>
  ),
  /** Icon by Iconic (https://iconic.app/warning-triangle/) */
  warn: (props: SVGProps): JSX.Element => (
    <svg {...props} width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M4.9522 16.3536L10.2152 5.85658C10.9531 4.38481 13.0539 4.3852 13.7913 5.85723L19.0495 16.3543C19.7156 17.6841 18.7487 19.25 17.2613 19.25H6.74007C5.25234 19.25 4.2854 17.6835 4.9522 16.3536Z' />
      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 10V12' />
      <circle cx='12' cy='16' r='1' fill='currentColor' />
    </svg>
  )
}

export type Icon = keyof (typeof iconSVGMap)

type IconViewProps = Omit<SVGProps, 'className'> & {
  icon: Icon
  modifiers?: ViewModifiers
}

export default function IconView (props: IconViewProps): JSX.Element {
  const { icon, modifiers, ...viewProps } = props
  const renderSVG = iconSVGMap[icon]
  return renderSVG({ ...viewProps, className: renderClassName('icon', modifiers) })
}
