import Cookies from 'js-cookie'

export function getToken(): string | undefined {
    return Cookies.get('tm-token')
}

export function setToken(token: string): void {
    Cookies.set('tm-token', token, { expires: 2 })
}

export function removeToken(): void {
    Cookies.remove('tm-token')
}
