import { API_Response, FNGetAllProducts } from "./types"

type Args = {
    onFetching?: () => void
    onError?: (error: string) => void
    onSuccess?: (data: FNGetAllProducts) => void
    onFinally?: () => void
    options: {
        token: string
    }
}

const getAllProducts = async (args: Args): Promise<FNGetAllProducts | undefined> => {
    try {
        // Run onFetching FN
        args?.onFetching?.();

        // Make API call
        const response: API_Response<FNGetAllProducts> = await (await fetch("https://myserver.aqi.in/pranaAir/getAllProducts", {
            headers: {
                "authorization": `Bearer ${args.options.token}`,
            }
        }))?.json();;

        // If response fails
        if (!response?.data?.length) {
            throw new Error(response.message)
        }

        // if data received
        args?.onSuccess?.(response.data)
        return response.data

    } catch (error: any) {
        args?.onError?.(error.message)
    } finally {
        args?.onFinally?.();
    }
}

export default getAllProducts