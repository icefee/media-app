import { inject, watchEffect, type Ref } from 'vue'
import { provideLoading } from '~/util/keys'

export function useLoading(bindValue?: Ref<boolean>) {
    const { showLoading, hideLoading } = inject<LoadingModel>(provideLoading)
    if (bindValue) {
        watchEffect(
            () => {
                bindValue.value ? showLoading() : hideLoading()
            }
        )
    }
    return {
        showLoading,
        hideLoading
    }
}