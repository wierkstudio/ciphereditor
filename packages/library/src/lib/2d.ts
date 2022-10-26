
import { Point, Rect } from '../schema/2d'

/**
 * Move the given point by delta coordinates
 */
export const movePointBy = (point: Point, delta: Point): Point => ({
  x: point.x + delta.x,
  y: point.y + delta.y
})

/**
 * Move the given point to the next integer coordinates
 */
export const roundPoint = (point: Point): Point => ({
  x: Math.round(point.x),
  y: Math.round(point.y)
})

/**
 * Return true, if the given points are equal
 */
export const pointEqualTo = (a: Point, b: Point): boolean =>
  a.x === b.x && a.y === b.y

/**
 * Merge the given rects to a single rect
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
 * Move the given rect to the next integer coordinates
 */
export const roundRect = (rect: Rect): Rect => ({
  x: Math.round(rect.x),
  y: Math.round(rect.y),
  width: Math.round(rect.width),
  height: Math.round(rect.height)
})

/**
 * Expand a rect by adding the given value on every side of the rect
 */
export const expandRect = (rect: Rect, value: number): Rect => ({
  x: rect.x - value,
  y: rect.y - value,
  width: rect.width + value * 2,
  height: rect.height + value * 2
})

/**
 * Return true, if the given rects are equal
 */
export const rectEqualTo = (a: Rect, b: Rect): boolean =>
  a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
