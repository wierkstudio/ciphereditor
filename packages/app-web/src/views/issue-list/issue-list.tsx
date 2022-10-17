
import './issue-list.scss'
import IconView from '../../views/icon/icon'
import { OperationIssue } from '@ciphereditor/library'
import { renderClassName } from '../../lib/utils/dom'

export default function IssueListView (props: {
  issues: OperationIssue[]
}): JSX.Element {
  return (
    <ul className='issue-list'>
      {props.issues.map((issue, index) => (
        <li
          className={renderClassName('issue-list__item', issue.level)}
          key={index}
        >
          <span className='issue-list__item-icon'>
            <IconView icon={issue.level} />
          </span>
          <span className='issue-list__item-detail'>
            <span className='issue-list__item-message'>
              {issue.message}
            </span>
            {issue.description !== undefined && (
              <span className='issue-list__item-description'>
                {issue.description}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}
