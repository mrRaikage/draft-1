Feature('invite-user');

let token = null;
let guid = null;
let user = null;
let userBob = null;
let orgName = null;
let password = '11111111';

Before(({signupPage}) => {
    guid = signupPage.createGuid();
    user = `alice-testuser-${guid}@testbothworlds.co.nz`;
    userBob = `bob-testuser-${guid}@testbothworlds.co.nz`;
    orgName = `Acme-TestOrg-${guid}`;
});

function newUser(I, signupPage, user) {
    signupPage.signUp(user, password);
}

function newOrganization(I) {
    I.waitForElement({css: 'app-input[label="Organization"] input'}, 30);
    I.fillField('app-input[label="Organization"] input', orgName);
    I.click('app-button[label="Let’s get started"]');
}

function openModal(I) {
    I.waitForElement({css: 'app-button-drop-down'}, 30);
    I.click('Add Transaction');
    I.wait(1);
    I.click('Record New custom');
}

function fillCashTransaction(I) {
    I.click('app-select-opt-autocomplete[label="Cash Account"] input');
    I.click('mat-option:nth-child(1)');
    I.click('.direction mat-radio-button[value="Sent"]');
    I.click('app-date-picker[label="Date"] .trigger');
    I.click('.mat-calendar-body-today');
    I.fillField('app-input[label="Other Party"] input', 'Other Party Text');
    I.fillField('app-input[label="Reference"] input', 'TESTREFNO');
    I.fillField('app-textarea[label="Details"] textarea', guid);
    I.click('app-select-opt[label="Amounts are"] .select-opt');
    I.click('mat-option:nth-child(1)');
    I.fillField('app-input[formcontrolname="description"] input', 'Description Test Text');
    I.click('app-select-opt-group-quick-add[formcontrolname="account"] input');
    I.click('mat-option');
    I.click('app-select-tax-rate[formcontrolname="taxRate"] .mat-select');
    I.click('mat-option:nth-child(1)');
    I.fillField('app-input-amount[formcontrolname="amount"] input', 777);
    I.click('Save');
    I.waitForElement('#toast-container', 3);
    I.see('Transaction Created!', '#toast-container');
    I.click('Cancel');
}

function inviteUser(I) {
    I.amOnPage('/content/settings');
    I.click('User');
    I.waitForElement('app-button[label="Add"]', 3);
    I.click('app-button[label="Add"]');
    I.wait(1);
    I.fillField(locate('app-input[formcontrolname="email"] input').last(), userBob);
    I.click('Invite');
    I.waitForElement('#toast-container', 3);
    I.see('Invitation Has Been Sent', '#toast-container');
}

function logout(I, loginPage) {
    loginPage.logout();
}

function watchTransactionDetails(I) {
    I.amOnPage('/content/transactions');
    I.click('.mat-row');
    I.see('View Transaction', 'app-button');
    I.click('View Transaction');
    I.see('Details', 'app-textarea');
    I.see(guid, 'app-textarea p');
}

async function deleteTestUser(I) {
    I.amOnPage('/content/transactions');
    const token = await I.executeScript(() => {
        return localStorage.getItem('access_token');
    });
    I.sendDeleteRequest(`/napi/Utility/Test/CleanUp?testCorrelationId=${guid}`,
        {
            Authorization: 'Bearer ' + token
        }).then(res => {
        console.log('status: ', res.status);
        console.log('statusText: ', res.statusText);
    });
}

Scenario('invite-user', ({I, loginPage, signupPage}) => {
    newUser(I, signupPage, user);
    newOrganization(I);
    openModal(I);
    fillCashTransaction(I);
    inviteUser(I);
    logout(I, loginPage);
    newUser(I, signupPage, userBob);
    watchTransactionDetails(I);
    deleteTestUser(I);
});
