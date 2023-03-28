const {I} = inject();

module.exports = {

    // insert your locators and methods here
    fields: {
        email: 'app-input[formcontrolname="username"] input',
        password: 'app-input[formcontrolname="password"] input',
        confirmPassword: '.confirm-password input',
    },
    url: {
        auth: '/auth/sign-up',
    },

    signUpBtn: 'Sign Up',
    signUp(email, password) {
        I.amOnPage(this.url.auth);
        I.fillField(this.fields.email, email);
        I.fillField(this.fields.password, password);
        I.fillField(this.fields.confirmPassword, password);
        I.click(this.signUpBtn);
        I.waitForNavigation(10);
    },

    createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

};
