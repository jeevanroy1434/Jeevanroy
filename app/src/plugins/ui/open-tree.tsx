import React, { useState, useRef, useEffect } from 'react'
import { Octicon } from '../../ui/octicons'
import * as octicons from '../../ui/octicons/octicons.generated'
import { Button } from '../../ui/lib/button'
import { OpenTreePopup } from './open-tree-popup'
import { openTreeService } from '../lib/opentree-service'
import { Repository } from '../../models/repository'
import './changes/_open-tree.scss'

interface OpenTreeProps {
  isCommitting: boolean | undefined
  repository: Repository
}

export const OpenTree: React.FC<OpenTreeProps> = ({
  isCommitting,
  repository,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize the OpenTree service when the component mounts
    openTreeService.initialize(repository)
  }, [repository])

  const handleAnalyzeClick = () => {
    setIsPopupOpen(true)
  }

  const handleAcceptCommit = (commitId: string) => {
    // Will be implemented later
    console.log('Accepted commit:', commitId)
  }

  const handleRejectCommit = (commitId: string) => {
    // Will be implemented later
    console.log('Rejected commit:', commitId)
  }

  return (
    <div
      ref={containerRef}
      className="open-tree-container"
      role="complementary"
      aria-label="OpenTree AI Assistant"
    >
      <div className="open-tree-header">
        <Octicon symbol={octicons.star} className="ai-icon" />
        <span className="open-tree-title">OpenTree AI</span>
      </div>

      <Button
        className="open-tree-button"
        type="button"
        onClick={handleAnalyzeClick}
        disabled={isCommitting}
        tooltip="View AI suggestions"
      >
        <div className="button-content">
          <Octicon symbol={octicons.lightBulb} />
          <span>View Suggestions</span>
        </div>
      </Button>

      {isPopupOpen && (
        <OpenTreePopup
          onClose={() => setIsPopupOpen(false)}
          onAcceptCommit={handleAcceptCommit}
          onRejectCommit={handleRejectCommit}
          anchorElement={containerRef.current}
        />
      )}
    </div>
  )
}
