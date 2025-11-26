import { useState, useCallback, useRef } from 'react'
import type { Position } from '../types.ts'
import { calculateNewPosition, constrainPosition } from '../utils/position'

interface UseDragProps {
  containerHeight?: number
}

export const useDrag = ({ containerHeight = 300 }: UseDragProps = {}) => {
  const [position, setPosition] = useState<Position>({ y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef(0)

  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      dragStartRef.current = e.clientY - position.y
    },
    [position.y]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return

      const newPos = calculateNewPosition(e.clientY, dragStartRef.current)
      const constrainedY = constrainPosition(newPos.y, containerHeight)
      setPosition({ y: constrainedY })
    },
    [isDragging, containerHeight]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  return {
    position,
    isDragging,
    handlers: {
      onHeaderMouseDown: handleHeaderMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  }
}
