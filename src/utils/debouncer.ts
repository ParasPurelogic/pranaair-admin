"use client"

type CallbackFunction<T> = (args: T) => void;

function debouncer<T>(callback: CallbackFunction<T>, time: number): CallbackFunction<T> {
    let timer: number | null = null;

    return (args: T) => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = window.setTimeout(() => {
            callback(args);
            timer = null;
        }, time);
    };
}

export default debouncer