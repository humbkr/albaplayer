export function immutableRemove(arr: Array<any>, index: number): Array<any> {
  return arr.slice(0, index).concat(arr.slice(index + 1))
}

/**
 * @param duration Duration to format in seconds.
 */
export const formatDuration = (duration: number): string => {
  if (duration === undefined) {
    return ''
  }

  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration - hours * 3600) / 60)
  const seconds = duration - hours * 3600 - minutes * 60

  const minutesToDisplay = minutes < 10 ? `0${minutes}` : minutes.toString(10)
  const secondsToDisplay = seconds < 10 ? `0${seconds}` : seconds.toString(10)

  return `${minutesToDisplay}:${secondsToDisplay}`
}

// Transform a disc number value to a string: 'D000'
const sanitizeDiscNumber = (discNumber: number | string): string => {
  const asString = `${discNumber}`
  const split = asString.split('/')

  return `D${split[0]}`
}

export const sanitizeTrackNumber = (trackNumber: number | string): string => {
  const asString = `${trackNumber}`
  const split = asString.split('/')

  return `T${split[0].padStart(3, '0')}`
}

export const immutableNestedSort = (
  items: Array<any>,
  prop: string,
  order: SortOrder = 'ASC'
): Array<any> => {
  const property = prop.split('.')
  // Get depth.
  const len = property.length

  let result = 0

  return [...items].sort((propA, propB) => {
    // PropA and propB are objects so we need to find the property value to compare.
    // For that we look for an object property given the depth of prop that we were passed.
    let a: any = propA
    let b: any = propB
    let i = 0
    while (i < len) {
      a = a[property[i]]
      b = b[property[i]]
      i++
    }

    // Sort if value type is string.
    if (typeof a === 'string' || a instanceof String) {
      if (order === 'ASC') {
        return a.toLowerCase() > b.toLowerCase() ? 1 : -1
      }
      return a.toLowerCase() < b.toLowerCase() ? 1 : -1
    }

    // Sort if value type is number.
    if (order === 'ASC') {
      result = a > b ? 1 : -1
    } else {
      result = a < b ? 1 : -1
    }

    return result
  })
}

/**
 * Sort function specifically designed for tracks list.
 */
export const immutableSortTracks = (
  items: Array<any>,
  prop: TracksSortOptions
): Array<any> => {
  let result = 0

  return [...items].sort((propA, propB) => {
    // PropA and propB are objects so we need to find the property value to compare.
    // For that we look for an object property given the depth of prop that we were passed.
    let a: any = propA
    let b: any = propB

    if (prop === 'album') {
      // Special case for album: we also need to sort by disc.
      a = `${propA.albumId}${sanitizeDiscNumber(
        propA.disc
      )}${sanitizeTrackNumber(propA.number)}`
      b = `${propB.albumId}${sanitizeDiscNumber(
        propB.disc
      )}${sanitizeTrackNumber(propB.number)}`
    } else if (prop === 'artistId') {
      // Special case for artistId: we need to sort by artistId and then by track number
      // so it doesn't feel weird for the user.
      a = `${propA.artistId}${sanitizeTrackNumber(propA.number)}`
      b = `${propB.artistId}${sanitizeTrackNumber(propB.number)}`
    } else {
      a = a[prop]
      b = b[prop]
    }

    // Sort if value type is string.
    if (typeof a === 'string' || a instanceof String) {
      return a.toLowerCase() > b.toLowerCase() ? 1 : -1
    }

    // Sort if value type is number.
    result = a > b ? 1 : -1

    return result
  })
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min: number, max: number): number => {
  const minVal = Math.ceil(min)
  const maxVal = Math.floor(max)
  return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
}

export function arrayMoveMutable(
  array: unknown[],
  fromIndex: number,
  toIndex: number
): void {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex

    const [item] = array.splice(fromIndex, 1)
    array.splice(endIndex, 0, item)
  }
}

export function arrayMoveImmutable<ValueType>(
  array: readonly ValueType[],
  fromIndex: number,
  toIndex: number
): ValueType[] {
  const newArray = [...array]
  arrayMoveMutable(newArray, fromIndex, toIndex)
  return newArray
}
