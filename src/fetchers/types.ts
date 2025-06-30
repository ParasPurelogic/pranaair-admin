type CustomerAddress = Partial<{
    is_default: boolean
    address_line1: string
    address_line2: string
    city: string
    state: string
    pin_code: string
    country: string
    _id: string
}>

export type FNGetAllCustomers = Partial<{
    _id: string
    email: string
    billing_Addresses: CustomerAddress[]
    createdAt: string
    first_name: string
    is_email_verified: boolean
    last_name: string
    phone_number: string
    shipping_Addresses: CustomerAddress[]
    updatedAt: string
}>[]

export type API_Response<D> = {
    status: "success" | "failed",
    message: string
    data?: D
}

export type FNGetProductCategories = {
    id: number,
    name: string
}[]

export type FNGetAllProducts = Partial<{
    _id: string
    title: string
    description: string
    category: string
    price: number
    discount_price: number
    currency: string
    images: string[]
    stock: number
    variants: any[]
    tags: any[]
    is_active: boolean
    is_featured: boolean
    createdAt: string
    updatedAt: string
    sku: string
}>[]

