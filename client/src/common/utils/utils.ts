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

export function isMobileBrowser() {
  let check = false;
  (function(a){
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
      check = true
    }
    // @ts-ignore
  })(navigator.userAgent||navigator.vendor||window.opera)

  return check
}