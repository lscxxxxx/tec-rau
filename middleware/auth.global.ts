// /middleware/auth.ts  <-- O que está na raiz do projeto

export default defineNuxtRouteMiddleware((to, from) => {
    // ADICIONE ESTAS DUAS LINHAS:
    console.log(`--- INICIANDO MIDDLEWARE DE ROTA PARA: ${to.path} ---`);
    console.log(`Executando no lado do: ${process.server ? 'SERVIDOR' : 'CLIENTE'}`);

    // O resto do seu código de verificação aqui...
    // (Pode deixar o código que sugeri na última mensagem, ele está correto)

    // Se o código estiver rodando no lado do servidor, não faz nada. <<-- REMOVA ESTA LÓGICA POR ENQUANTO PARA TESTAR
    // if (process.server) {
    //     return;
    // }

    const token = useCookie('token');
    console.log(`Valor do cookie 'token' encontrado: ${token.value ? 'Existe' : 'NULO'}`);


    const isAdminRoute = to.path.startsWith('/admin');
    const adminPublicas = [
        '/admin/login',
        '/admin/esqueci-senha',
        '/admin/redefinir-senha',
    ];

    if (isAdminRoute && !adminPublicas.includes(to.path) && !token.value) {
        console.log('❌ ACESSO NEGADO! Redirecionando para /admin/login...');
        return navigateTo('/admin/login', { replace: true });
    }

    console.log('✅ Acesso permitido pela rota.');
});