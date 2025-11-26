import type { Position } from '../types'

export const constrainPosition = (
  y: number,
  containerHeight: number
): number => {
  const maxY = window.innerHeight - containerHeight
  return Math.max(0, Math.min(y, maxY))
}

export const calculateNewPosition = (
  clientY: number,
  dragStart: number
): Position => ({
  y: clientY - dragStart,
})
