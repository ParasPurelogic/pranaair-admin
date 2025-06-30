import { API_Response, FNGetProductCategories } from "./types"

type Args = {
    onFetching?: () => void
    onError?: (error: string) => void
    onSuccess?: (data: FNGetProductCategories) => void
    onFinally?: () => void
    options: {
        token: string
    }
}

const getProductCategories = async (args: Args): Promise<FNGetProductCategories | undefined> => {
    try {
        // Run onFetching FN
        args?.onFetching?.();

        // Make API call
        const response: API_Response<FNGetProductCategories> = await (await fetch("https://myserver.aqi.in/pranaAir/getAllProducts", {
            headers: {
                "authorization": `Bearer ${args.options.token}`,
            }
        }))?.json();;

        // If response fails
        if (!response?.data?.length) {
            throw new Error(response.message)
        }

        // 
        const data = [
            {
                id: 1,
                name: "Air Monitors"
            },
            {
                id: 2,
                name: "Air Purifiers"
            },
            {
                id: 3,
                name: "Air Masks"
            }
        ]

        // if data received
        args?.onSuccess?.(data)
        return data

    } catch (error: any) {
        args?.onError?.(error.message)
    } finally {
        args?.onFinally?.();
    }
}

export default getProductCategories