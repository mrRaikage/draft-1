Feature('login');

function login(I, loginPage) {
    loginPage.login('test2@bothworlds.co.nz', '12345678')
}

function logout(I, loginPage) {
    loginPage.logout()
}

Scenario('login', ({I, loginPage}) => {
    login(I, loginPage);
    logout(I, loginPage);
});
