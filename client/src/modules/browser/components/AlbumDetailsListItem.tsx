import TrackTeaser from 'modules/browser/components/TrackTeaser'
import DiscSeparator from 'modules/browser/components/DiscSeparator'

type Props = {
  type?: string
  item: any
  selected?: boolean
  index: number
  onContextMenu: (itemId: string, index: number) => void
}

export default function AlbumDetailsListItem({
  type,
  item,
  selected,
  index,
  onContextMenu,
}: Props) {
  if (type === 'disc') {
    return (
      <DiscSeparator
        index={index}
        discNumber={item.disc}
        selected={selected}
        onContextMenu={onContextMenu}
      />
    )
  }

  return (
    <TrackTeaser
      index={index}
      item={item}
      selected={selected}
      onContextMenu={onContextMenu}
    />
  )
}
