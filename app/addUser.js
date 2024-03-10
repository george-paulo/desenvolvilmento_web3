const getAdminController = require('./controllers/AdminController');

// Função para adicionar um usuário
async function addUser(adminController) {
    // Define os detalhes do usuário
    const userDetails = {
        body: {
            nome: 'George',
            senha: '123456'
        }
    };

    // Define uma resposta falsa
    const fakeRes = {
        redirect: () => {}
    };

    // Tenta criar o usuário
    try {
        await adminController.create(userDetails, fakeRes);
        console.log('Usuário criado com sucesso');
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
}

// Obtém a instância do AdminController e chama a função para adicionar o usuário
getAdminController().then(adminController => {
    addUser(adminController);
});