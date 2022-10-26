
import { Point, Rect } from '@ciphereditor/library'

export interface ScrollbarsLayout {
  verticalScope: number
  verticalSize: number
  verticalPosition: number
  horizontalScope: number
  horizontalSize: number
  horizontalPosition: number
}

/**
 * Merge the given rects to a single rect.
 */
export const mergeRects = (a: Rect, b: Rect): Rect => {
  const leadingX = Math.min(a.x, b.x)
  const topY = Math.min(a.y, b.y)
  const trailingX = Math.max(a.x + a.width, b.x + b.width)
  const bottomY = Math.max(a.y + a.height, b.y + b.height)

  return {
    x: leadingX,
    y: topY,
    width: trailingX - leadingX,
    height: bottomY - topY
  }
}

/**
 * Expand a rect by adding the given value on every side of the rect.
 */
export const expandRect = (rect: Rect, value: number): Rect => {
  return {
    x: rect.x - value,
    y: rect.y - value,
    width: rect.width + value * 2,
    height: rect.height + value * 2
  }
}

/**
 * Compute vertical and horizontal scrollbar sizes and positions (percentages).
 * @param viewportRect Rect of the visible area
 * @param contentRect Rect of the content limits, if any
 */
export const layoutScrollbars = (
  viewportRect: Rect,
  contentRect: Rect
): ScrollbarsLayout => {
  const viewboxRect = mergeRects(viewportRect, expandRect(contentRect, 32))
  const verticalScope = viewboxRect.height - viewportRect.height
  const horizontalScope = viewboxRect.width - viewportRect.width
  return {
    verticalScope,
    verticalSize: Math.min(viewportRect.height / viewboxRect.height, 1),
    verticalPosition: viewboxRect.height > viewportRect.height
      ? ((viewportRect.y - viewboxRect.y) / verticalScope)
      : 0,
    horizontalScope,
    horizontalSize: Math.min(viewportRect.width / viewboxRect.width, 1),
    horizontalPosition: viewboxRect.width > viewportRect.width
      ? ((viewportRect.x - viewboxRect.x) / horizontalScope)
      : 0
  }
}

export const movePointBy = (point: Point, delta: Point): Point => {
  return {
    x: point.x + delta.x,
    y: point.y + delta.y
  }
}
