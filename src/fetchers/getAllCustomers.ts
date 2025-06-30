import { API_Response, FNGetAllCustomers } from "./types"

type Args = {
    onFetching?: () => void
    onError?: (error: string) => void
    onSuccess?: (data: FNGetAllCustomers) => void
    onFinally?: () => void
    options: {
        token: string
    }
}

const getAllCustomers = async (args: Args): Promise<FNGetAllCustomers | undefined> => {
    try {
        // Run onFetching FN
        args?.onFetching?.();

        // Make API call
        const response: API_Response<FNGetAllCustomers> = await (await fetch("https://myserver.aqi.in/pranaAir/getAllCustomers", {
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

export default getAllCustomers