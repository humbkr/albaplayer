export declare global {
  type QueueItem = {
    // Identifies the item in the queue, the same track can be queued twice.
    id: string
    track: Track
  }
}
