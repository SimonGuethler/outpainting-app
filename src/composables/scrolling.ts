export enum ScrollDirection {
    Left,
    Right,
}

let requestId = 0;

export const enableHorizontalScroll = () => {
    const scrollable = document.getElementById("scrollable");
    scrollable?.addEventListener("wheel", (event) => {
        // event.preventDefault();
        const scrollAmount = event.deltaY || event.deltaX;
        scrollable.scrollLeft += scrollAmount;
    }, { passive: true });
}

export const scrollToRight = () => {
    const scrollable = document.getElementById("scrollable");
    if (!scrollable) return;
    scrollable.scrollLeft = scrollable.scrollWidth;
}

export const scrollToLeft = () => {
    const scrollable = document.getElementById("scrollable");
    if (!scrollable) return;
    scrollable.scrollLeft = 0;
}

export const scrollAmount = (amount: number) => {
    const scrollable = document.getElementById("scrollable");
    if (!scrollable) return;
    scrollable.scrollLeft += amount;
}

export const startScroll = (direction: ScrollDirection) => {
    if (requestId) return;

    const container = document.getElementById("scrollable")!;
    const scrollAmount = 1;

    const scroll = () => {
        if (direction === ScrollDirection.Left) {
            container.scrollLeft -= scrollAmount;
        } else if (direction === ScrollDirection.Right) {
            container.scrollLeft += scrollAmount;
        }
        requestId = requestAnimationFrame(scroll);
    }

    scroll();
}

export function stopScroll() {
    cancelAnimationFrame(requestId);
    requestId = 0;
}
