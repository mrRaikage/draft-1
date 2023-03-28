const { I } = inject();

module.exports = {

  // insert your locators and methods here
    fields: {
        email: '#email input',
        password: '#password input',
    },
    url: {
        auth: '/auth/sign-in',
        mainPage: '/content/transactions'
    },

    signInBtn: '#signIn',
    logOutBtn: '.list-item.logout',

    login(email, password) {
        I.amOnPage(this.url.auth);
        I.fillField(this.fields.email, email);
        I.fillField(this.fields.password, password);
        I.click(this.signInBtn);
        I.waitForNavigation(10);
        I.waitInUrl('transactions');
    },

    logout() {
        I.amOnPage(this.url.mainPage);
        I.see('Logout')
        I.click(this.logOutBtn);
    }

}
