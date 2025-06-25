export default function log(argType: "error" | "log" | "info", title: string, error: unknown): void {
    try {
        const message = error instanceof Error ? error.message : typeof error == "object" ? JSON.stringify(error) : String(error);
        const messageTitle = `:::::::::::::::::::: ${title.toUpperCase()} ::::::::::::::::::::`;

        switch (argType) {
            case "log":
                console.log(messageTitle, message);
                break;
            case "error":
                console.error(messageTitle, message);
                break;
            case "info":
                console.info(messageTitle, message);
                break;
            default:
                console.warn("Invalid log type:", argType);
        }
    } catch (err) {
        console.error("Logging failed:", err);
    }
}
