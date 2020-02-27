//Set apiURL to base URL, append/concat string to call specific endpoint.
const apiURL = 'https://backendforassessment20200225040432.azurewebsites.net/api/'

//Create constants for the incoming AccountStatus enums to avoid 'magic numbers'
const activeAccount = 0;
const inactiveAccount = 1;
const overdueAccount = 2;

//Get accounts data after DOM is ready.
$().ready(function () {
    GetAccountsData();
});

//Accounts variable to store incoming accounts data
var accounts = null;

//Categorized accounts by AccountStatusEnum
var activeAccounts = [];
var overdueAccounts = [];
var inactiveAccounts = [];

//GET call to retrieve accounts data.
function GetAccountsData() { 
     axios({
     method: 'get',
     url: apiURL.concat('accounts'),
     responseType: 'json'
   })
         .then(function (response) {
             accounts = response.data;
             //Create Vue after receiving & sorting data;
             console.log(accounts);
             ParseAccounts();
             CreateVue();
     });
}

//Create accounts vue
function CreateVue() {
    new Vue({
        el: '#accounts-app',
        data: {
            activeAccounts: activeAccounts,
            overdueAccounts: overdueAccounts,
            inactiveAccounts: inactiveAccounts
        }
    });
}

//Parse accounts into their respective account type variables.
function ParseAccounts() {
    accounts.forEach(account => {
        //Format data before assigning account to account type variable.
        account.PhoneNumber = FormatPhoneNumber(account.PhoneNumber);
        //Utilized moment.js to format date.
        account.PaymentDueDate = account.PaymentDueDate !== null ? moment(account.PaymentDueDate).format('MM-DD-YYYY') : 'N/A';
        //Format AmountDue
        account.AmountDue = account.AmountDue.toFixed(2);

        switch (account.AccountStatusId) {
            case activeAccount:
                activeAccounts.push(account);
                break;
            case inactiveAccount:
                inactiveAccounts.push(account);
                break;
            case overdueAccount:
                overdueAccounts.push(account);
                break;
        }

    });
}

//Formats phone number
function FormatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1)-$2-$3");
}