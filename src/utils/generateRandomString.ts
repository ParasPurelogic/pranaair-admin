type Args = {
    length?: number
    prefix?: string
    suffix?: string
}

const generateRandomString = (args?: Args) => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    const length = args?.length ?? 10;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    if (args?.prefix) return `${args?.prefix}-${randomString}`
    else if (args?.suffix) return `${randomString}-${args?.suffix}`
    else return randomString

}

export default generateRandomString