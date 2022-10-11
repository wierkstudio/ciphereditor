
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface ScrollbarsLayout {
  verticalSize: number
  verticalPosition: number
  horizontalSize: number
  horizontalPosition: number
}

/**
 * Merge the given rects to a single rect.
 */
export const mergeRects = (a: Rect, b: Rect | undefined): Rect => {
  if (b === undefined) {
    return a
  }

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
 * Compute vertical and horizontal scrollbar sizes and positions (percentages).
 * @param viewportRect Rect of the visible area
 * @param contentRect Rect of the content limits, if any
 */
export const layoutScrollbars = (
  viewportRect: Rect,
  contentRect: Rect | undefined
): ScrollbarsLayout => {
  const viewboxRect = mergeRects(viewportRect, contentRect)
  return {
    verticalSize: Math.min(viewportRect.height / viewboxRect.height, 1),
    verticalPosition: viewboxRect.height > viewportRect.height
      ? ((viewportRect.y - viewboxRect.y) / (viewboxRect.height - viewportRect.height))
      : 0,
    horizontalSize: Math.min(viewportRect.width / viewboxRect.width, 1),
    horizontalPosition: viewboxRect.width > viewportRect.width
      ? ((viewportRect.x - viewboxRect.x) / (viewboxRect.width - viewportRect.width))
      : 0
  }
}
