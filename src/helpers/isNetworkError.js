export function isNetworkError(error) {
    return !!error.isAxiosError && !error.response;
}
