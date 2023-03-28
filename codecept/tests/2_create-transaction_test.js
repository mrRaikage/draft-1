Feature('create-transaction');


Before(({loginPage}) => {
    loginPage.login('test2@bothworlds.co.nz', '12345678')
});

function openModal(I) {
    I.waitForElement({css: 'app-button-drop-down'}, 10)
    I.click('Add Transaction');
    I.wait(1)
    I.click('Record New custom');
}

function fillCashTransaction(I) {
    I.click('app-select-opt-autocomplete[label="Cash Account"] input')
    I.click('mat-option:nth-child(1)')
    I.click('.direction mat-radio-button[value="Sent"]')
    I.click('app-date-picker[label="Date"] .trigger')
    I.click('.mat-calendar-body-today')
    I.fillField('app-input[label="Other Party"] input', 'Other Party Text')
    I.fillField('app-input[label="Reference"] input', 'TESTREFNO')
    I.fillField('app-textarea[label="Details"] textarea', 'Details test text')
    I.click('app-select-opt[label="Amounts are"] .select-opt')
    I.click('mat-option:nth-child(1)')
    I.fillField('app-input[formcontrolname="description"] input', 'Description Test Text')
    I.click('app-select-opt-group-quick-add[formcontrolname="account"] input')
    I.click('mat-option')
    I.click('app-select-tax-rate[formcontrolname="taxRate"] .mat-select')
    I.click('mat-option:nth-child(1)')
    I.fillField('app-input-amount[formcontrolname="amount"] input', 777)
    I.click('Save')
    I.waitForElement('#toast-container', 3)
    I.see('Transaction Created!', '#toast-container')
    I.click('Cancel')
}

Scenario('should fill mentioned fields and save transaction', ({I}) => {
    openModal(I)
    fillCashTransaction(I)
})
