export type AdminInfo = {
    email: string
    token: string
    loggedInAt: string
}

export type TypeAction<D = undefined> = {
    status: boolean
    message: string
    data?: D
}