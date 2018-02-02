import {
  PANNING_START,
  ENTER_DOT,
  LEAVE_DOT,
  PANNING_END,
  PANNING,
  RESET_DOT_STATE
} from './actions'
import {
  originalMatrix,
  isAdjacent,
  isOppositeDirection,
  lineDeg,
  removeDots
} from '../../utils/data'
import clone from '../../utils/clone'

const initState = {
  matrix: originalMatrix,
  panningDot: null,
  panDirection: null,
  linePosition: {
    x: 0,
    y: 0
  },
  connectedDots: [],
  connectedLines: []
}

export default (state = initState, action) => {
  const {
    matrix,
    connectedDots,
    connectedLines,
    panningDot,
    panDirection,
    linePosition
  } = state
  switch (action.type) {
    case PANNING_START:
      const newConnectedDots = clone(connectedDots)
      newConnectedDots.push(action.dot)
      return {
        ...state,
        connectedDots: newConnectedDots,
        panningDot: action.dot,
        linePosition: action.position
      }
    case PANNING:
      return {
        ...state,
        panDirection: action.direction
      }
    case ENTER_DOT:
      // if dot is slibing dot with panningDot
      const { adjacent, direction } = isAdjacent(matrix)(panningDot, action.dot)
      if (adjacent) {
        const newConnectedDots = clone(connectedDots)
        const newConnectedLines = clone(connectedLines)
        newConnectedDots.push(action.dot)
        newConnectedLines.push({
          deg: lineDeg[direction],
          color: matrix[panningDot.col][panningDot.row].color,
          ...linePosition
        })
        return {
          ...state,
          connectedDots: newConnectedDots,
          connectedLines: newConnectedLines,
          panningDot: action.dot,
          linePosition: action.position
        }
      }
      return state
    case LEAVE_DOT:
      if (isOppositeDirection(panDirection, action.direction)) {
        const newConnectedDots = clone(connectedDots)
        const newConnectedLines = clone(connectedLines)
        newConnectedDots.pop()
        newConnectedLines.pop()

        return {
          ...state,
          connectedDots: newConnectedDots,
          connectedLines: newConnectedLines,
          panningDot: connectedDots[connectedDots.length - 1]
        }
      } else {
        return state
      }
    case PANNING_END:
      if (connectedDots.length > 1) {
        const newMatrix = clone(matrix)
        removeDots(newMatrix)(connectedDots)
        return {
          ...initState,
          matrix: newMatrix
        }
      } else {
        return initState
      }
    case RESET_DOT_STATE:
      const newMatrix = clone(matrix)
      newMatrix[action.dot.col][action.dot.row].isActive = false
      return {
        ...state,
        matrix: newMatrix
      }
    default:
      return state
  }
}
