const isObject = (obj) => {
    return  typeof obj === 'object' &&
            !Array.isArray(obj) &&
            obj !== null
}


export { isObject };