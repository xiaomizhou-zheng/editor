import { isPerformanceAPIAvailable } from './is-performance-api-available';

/**
 * Measures time it takes to render a frame including -> style, paint, layout and composition.
 *
 * How does it work:
 * 1. We mark the beginning of a render with the `startMark`
 * 2. We schedule `requestAnimationFrame` callback for the next frame
 * 3. Framework (e.g. prosemirror) does its magic and mounts dom nodes "synchronously"
 * 4. When the main thread is unblocked our callback gets executed and onMeasureComplete is being called
 *
 * Why does it work:
 * | javascript (framework)           | style | layout | paint | composite | javascript  | ...
 *  | startMark + scheduling rAF |                                                       | rAF callback, endMark
 */
export function measureRender(
  /**
   * Unique name for the measurement
   *
   * Important: if multiple measureRender events are fired at the same time
   * with the same measure name -- the result will not be correct.
   */
  measureName: string,
  /**
   * Call back fired when the measurement completes.
   *
   * Note: when this function is called when the Document.visibilityState is not
   * visible -- the duration is likely to be misleading/inaccurate. This is due
   * to the measurements use of the `requestAnimationFrame` api which only fires
   * when the Document.visibilityState is visible.
   */
  onMeasureComplete: ({
    duration,
    startTime,
    distortedDuration,
  }: {
    duration: number;
    startTime: number;
    /**
     * Will be true when the measurement takes place in a background tab or some
     * other case which results in the Document.visibilityState not being visible.
     *
     * When true -- the duration value is not useful to provide to consumers. See
     * onMeasureComplete description for more details.
     */
    distortedDuration: boolean;
  }) => void,
) {
  if (!isPerformanceAPIAvailable()) {
    return;
  }

  const startMark = `[START]: ${measureName}`;
  const endMark = `[END]: ${measureName}`;
  const startTime = performance.now();

  performance.mark(startMark);

  // If an editor is rendered when the document is not visible -- the callback passed to
  // requestAnimationFrame will not fire until the document becomes visible again.
  //
  // For the purposes of using performance measurement -- this behaviour means the events
  // which have been fired in the background are not useful -- and lead to other events
  // being hard to draw conclusions from.
  //
  // To mitigate this -- we detect this state -- and fire a seperate callback when the
  // measurement has occured when the render was in the backgroun
  let distortedDuration = document.visibilityState !== 'visible';

  function handleVisibilityChange() {
    if (document.visibilityState !== 'visible') {
      distortedDuration = true;
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      performance.mark(endMark);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      const duration = performance.now() - startTime;

      try {
        performance.measure(measureName, startMark, endMark);
        const entry = performance.getEntriesByName(measureName).pop();

        if (!entry) {
          onMeasureComplete({ duration, startTime, distortedDuration });
        } else {
          onMeasureComplete({
            duration: entry.duration,
            startTime: entry.startTime,
            distortedDuration,
          });
        }
      } catch (e) {
        onMeasureComplete({ duration, startTime, distortedDuration });
      }

      performance.clearMeasures(measureName);
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
    });
  });
}
