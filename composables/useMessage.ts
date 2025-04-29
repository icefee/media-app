function useMessage() {
    const toast = useToast()
    const showError = (errText: string) => {
        toast.add({
            color: 'error',
            icon: 'i-heroicons-x-circle-20-solid',
            title: errText
        })
    }
    return {
        showError
    }
}

export default useMessage