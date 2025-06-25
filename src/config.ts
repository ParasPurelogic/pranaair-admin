export const siteName = "Prana Air Admin"

export const domainName = "http://localhost:3000"

export const conventions = {
    cookie: {
        adminInfo: "pra-dd-asok98ahs"
    }
}

export const routes = {
    login: {
        id: "login",
        pathname: "/login",
        url: `${domainName}/login`
    },
    home: {
        id: "home",
        pathname: "/",
        url: `${domainName}/`
    }
}

// REGEX CHECKS
export const regexChecks = {
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /.{6,}/,
    phoneNumber: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    simpleStringCheck: /^.*$/,
}
