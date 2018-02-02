import {
  COLOR_BLUE,
  COLOR_YELLOW,
  COLOR_RED,
  COLOR_PURPLE,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
  DIRECTION_UP,
  DIRECTION_RIGHT,
  DOT_TYPE_DOT,
  DOT_TYPE_EMPTY
} from './constants'

import random from './random-index'

/**
 * Generate new dots
 *
 * Defferent level have different dot generation method,how to generate dots is the key of
 * this game
 *
 * possible variable:
 *  num,
 *  colors,
 *  dotTypes,
 *  column odd or even,
 *  matrix potential connectable dots
 *
 * @param {*} num
 * @param {*} colors
 * @param {*} dotTypes
 */
export const genrateDots = (
  { colors, dotTypes = [DOT_TYPE_DOT] } = {
    colors: [COLOR_BLUE, COLOR_YELLOW, COLOR_RED, COLOR_PURPLE],
    dotTypes: [DOT_TYPE_DOT]
  }
) => num => {
  return Array.from({ length: num }).map((e, i) => {
    return {
      type: dotTypes[random(dotTypes.length)],
      color: colors[random(colors.length)],
      isActive: false // for animate effect
    }
  })
}

/**
 *  Remove connected dots and add new dots
 *
 * @param {*} matrix
 * @param {*} connectedDots
 */
export const removeDots = matrix => connectedDots => {
  connectedDots.map(e => e.col).forEach(col => {
    const dots = connectedDots.filter(e => e.col === col)
    dots.sort((a, b) => a - b)
    if (dots.length > 1 && dots[1].row - dots[0].row !== 1) {
      // not adjacent
      dots.forEach(d => matrix[col].splice(d.row, 1))
    } else {
      matrix[col].splice(dots[0].row, dots.length)
    }
    // TODO: add new dots
    // matrix[col].push(...genrateDots()(dots.length))
  })
}

export const blueCol = genrateDots({ colors: [COLOR_BLUE] })(5)
export const yellowCol = genrateDots({ colors: [COLOR_YELLOW] })(5)
export const redCol = genrateDots({ colors: [COLOR_RED] })(5)
export const purpleCol = genrateDots({ colors: [COLOR_PURPLE] })(5)

const colA = [
  {
    type: DOT_TYPE_DOT,
    color: COLOR_YELLOW
  },
  {
    type: DOT_TYPE_DOT,
    color: COLOR_YELLOW
  },
  {
    type: DOT_TYPE_DOT,
    color: COLOR_YELLOW
  },
  {
    type: DOT_TYPE_DOT,
    color: COLOR_YELLOW
  },
  {
    type: DOT_TYPE_DOT,
    color: COLOR_BLUE
  }
]
const colB = [
  {
    type: DOT_TYPE_DOT,
    color: COLOR_RED
  },
  {
    type: DOT_TYPE_DOT,
    color: COLOR_RED
  },
  {
    type: DOT_TYPE_DOT,
    color: COLOR_RED
  },
  {
    type: DOT_TYPE_DOT,
    color: COLOR_RED
  },
  {
    type: DOT_TYPE_DOT,
    color: COLOR_PURPLE
  }
]

export const originalMatrix = [blueCol, colA, colB, purpleCol, redCol]

/**
 * if is same color and same type
 *
 *  dotA: start
 *  dotB: end
 *
 * @param {*} matrix
 */
export const isAdjacent = matrix => (dotA, dotB) => {
  const pointA = matrix[dotA.col][dotA.row]
  const pointB = matrix[dotB.col][dotB.row]
  if (
    pointA.type === DOT_TYPE_DOT &&
    pointA.type === pointB.type &&
    pointA.color === pointB.color
  ) {
    if (dotA.col - 1 === dotB.col) {
      return {
        adjacent: true,
        direction: DIRECTION_LEFT
      }
    } else if (dotA.col + 1 === dotB.col) {
      return {
        adjacent: true,
        direction: DIRECTION_RIGHT
      }
    } else if (dotA.row - 1 === dotB.row) {
      return {
        adjacent: true,
        direction: DIRECTION_DOWN
      }
    } else if (dotA.row + 1 === dotB.row) {
      return {
        adjacent: true,
        direction: DIRECTION_UP
      }
    }
    return {
      adjacent: false
    }
  }
  return false
}

export const isOppositeDirection = (directA, directB) => {
  switch (directA) {
    case DIRECTION_UP:
      return directB === DIRECTION_DOWN
    case DIRECTION_DOWN:
      return directB === DIRECTION_UP
    case DIRECTION_LEFT:
      return directB === DIRECTION_RIGHT
    case DIRECTION_RIGHT:
      return directB === DIRECTION_LEFT
    default:
      return false
  }
}

export const lineDeg = {
  DIRECTION_UP: 270,
  DIRECTION_LEFT: 180,
  DIRECTION_DOWN: 90,
  DIRECTION_RIGHT: 0
}
