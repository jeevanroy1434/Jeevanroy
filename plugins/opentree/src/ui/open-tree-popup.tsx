import * as React from 'react'
import { Octicon } from '../../../../app/src/ui/octicons'
import * as octicons from '../../../../app/src/ui/octicons/octicons.generated'
import { Button } from '../../../../app/src/ui/lib/button'
import {
  Popover,
  PopoverAnchorPosition,
} from '../../../../app/src/ui/lib/popover'

interface ISuggestedCommit {
  id: string
  title: string
  description: string
  status: 'pending' | 'accepted' | 'rejected'
  timestamp: string
}

interface IOpenTreePopupProps {
  onClose: () => void
  onAcceptCommit: (commitId: string) => void
  onRejectCommit: (commitId: string) => void
  anchorElement: HTMLElement | null
}

export const OpenTreePopup: React.FC<IOpenTreePopupProps> = ({
  onClose,
  onAcceptCommit,
  onRejectCommit,
  anchorElement,
}) => {
  // Mock data - will be replaced with real data later
  const suggestedCommits: ISuggestedCommit[] = [
    {
      id: '1',
      title: 'feat: add user authentication',
      description: 'Implemented OAuth flow and user session management',
      status: 'pending',
      timestamp: '2 minutes ago',
    },
    {
      id: '2',
      title: 'fix: resolve memory leak in WebSocket connection',
      description: 'Fixed connection cleanup in disconnect handler',
      status: 'accepted',
      timestamp: '5 minutes ago',
    },
    {
      id: '3',
      title: 'refactor: optimize database queries',
      description: 'Added indexes and improved query performance',
      status: 'rejected',
      timestamp: '10 minutes ago',
    },
  ]

  return (
    <Popover
      anchor={anchorElement}
      anchorPosition={PopoverAnchorPosition.BottomLeft}
      onClickOutside={onClose}
      className="open-tree-popup"
    >
      <div className="open-tree-popup-header">
        <Octicon symbol={octicons.sync} className="spin" />
        <span className="title">OpenTree Activity</span>
        <Button className="close-button" onClick={onClose}>
          <Octicon symbol={octicons.x} />
        </Button>
      </div>

      <div className="open-tree-popup-content">
        <div className="activity-status">
          <Octicon symbol={octicons.pulse} />
          <span>Analyzing repository changes...</span>
        </div>

        <div className="suggested-commits">
          {suggestedCommits.map(commit => (
            <div
              key={commit.id}
              className={`commit-suggestion ${commit.status}`}
              role="listitem"
            >
              <div className="commit-header">
                <Octicon
                  symbol={
                    commit.status === 'accepted'
                      ? octicons.check
                      : commit.status === 'rejected'
                      ? octicons.x
                      : octicons.gitCommit
                  }
                  className="status-icon"
                />
                <span className="commit-title">{commit.title}</span>
                <span className="timestamp">{commit.timestamp}</span>
              </div>

              <p className="commit-description">{commit.description}</p>

              {commit.status === 'pending' && (
                <div className="commit-actions">
                  <Button
                    onClick={() => onAcceptCommit(commit.id)}
                    className="accept-button"
                    tooltip="Accept this suggestion"
                  >
                    <Octicon symbol={octicons.check} />
                    <span>Accept</span>
                  </Button>
                  <Button
                    onClick={() => onRejectCommit(commit.id)}
                    className="reject-button"
                    tooltip="Reject this suggestion"
                  >
                    <Octicon symbol={octicons.x} />
                    <span>Reject</span>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Popover>
  )
}
