
export const isDev = import.meta.env.NODE_ENV === 'development'

export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
}
