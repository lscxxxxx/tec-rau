export default defineEventHandler((event) => {
    deleteCookie(event, 'token', {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
    })

    return { message: 'Logout realizado com sucesso!' }
})