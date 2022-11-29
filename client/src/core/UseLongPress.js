import { useCallback } from "react";

function UseLongPress(
    onLongPress,
    { shouldPreventDefault = true, delay = 300 } = {}
) {
    const start = useCallback(
        event => {
            setTimeout(() => {
                onLongPress(event);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    return {
        onMouseDown: e => start(e),
        onTouchStart: e => start(e)
    };
};

const isTouchEvent = event => {
return "touches" in event;
};

const preventDefault = event => {
if (!isTouchEvent(event)) return;

if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
}
};

export default UseLongPress;