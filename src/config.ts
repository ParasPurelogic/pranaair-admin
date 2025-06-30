export const siteName = "Prana Air Admin"

export const domainName = process.env.NODE_ENV === "production" ? "https://dash.pranaair.com" : "http://localhost:3000"

export const conventions = {
    cookie: {
        adminInfo: "pra-dd-asok98ahs"
    }
}

export const routes = {
    login: {
        id: "login",
        name: "Login",
        pathname: "/login",
        url: `${domainName}/login`
    },
    dashboard: {
        id: "dashboard",
        name: "Dashboard",
        pathname: "/",
        url: `${domainName}/`
    },
    customers: {
        id: "customers",
        name: "Customers",
        pathname: "/customers",
        url: `${domainName}/customers`
    },
    orders: {
        id: "orders",
        name: "Orders",
        pathname: "/orders",
        url: `${domainName}/orders`
    },
    products: {
        id: "products",
        name: "Products",
        pathname: "/products",
        url: `${domainName}/products`
    }
}

// REGEX CHECKS
export const regexChecks = {
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /.{6,}/,
    phoneNumber: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    simpleStringCheck: /^.*$/,
}
