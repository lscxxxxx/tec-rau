// /middleware/auth.global.ts

export default defineNuxtRouteMiddleware(async (to, from) => {
    // 1. Pega o estado global do usuário, não o cookie!
    const { user } = useAuth();

    // 2. Define as rotas públicas de admin
    const adminPublicas = [
        '/admin/login',
        '/admin/esqueci-senha',
        '/admin/redefinir-senha',
    ];

    // 3. Se a rota NÃO é de admin, permite o acesso (para /explorar, /sobre, etc.)
    if (!to.path.startsWith('/admin')) {
        return;
    }

    // 4. Se é uma rota PÚBLICA de admin (como /login), permite o acesso
    if (adminPublicas.includes(to.path)) {
        return;
    }

    // 5. Se chegou aqui, é uma rota de admin PROTEGIDA.
    //    Verifica se o usuário está no estado global.
    if (!user.value) {
        // Se o usuário é nulo, redireciona para o login.
        return navigateTo('/admin/login', { replace: true });
    }

    // 6. Se o usuário existe no estado, permite o acesso.
});