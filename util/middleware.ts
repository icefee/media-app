export const createPayload = <T = unknown>(data: T) => {
    return {
        code: 0,
        data,
        msg: '成功'
    }
}

export const createErrorPayload = (error: any = '失败') => {
    return {
        code: -1,
        data: null,
        msg: error
    }
}

export const parseQueryValue = <T = any>(value: T | T[]) => {
    return String(Array.isArray(value) ? value[0] : value)
}

export const fileNotFound = 'file not found.'