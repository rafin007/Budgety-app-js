
//BUDGET CONTROLLER
var budgetController = (function() {

    //models
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    //calculate total for expense and income
    var calculateTotal = function(type) {
        
        var sum = 0;

        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });

        data.totals[type] = sum;

    };

    return {

        //add item to data
        addItem: function(type, description, value) {
            
            var newItem, ID;

            //generate id for either income or expense
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            //instantiate new item for either income or expense
            if (type === 'exp') {
                newItem = new Expense(ID, description, value);
            }
            else if (type === 'inc') {
                newItem = new Income(ID, description, value);
            }

            //push newItem to either income or expense
            data.allItems[type].push(newItem);

            //return the newItem
            return newItem;

        },

        deleteItem: function(type, ID) {

            var index, ids;
            
            //iterate the income/expense array of objects and store all the ids in a seperate array
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            //find the item to delete by ID
            index = ids.indexOf(ID);

            //if the id exist then delete it
            if (index !== -1) {

                data.allItems[type].splice(index, 1);

            }

        },

        testing: function() {

            console.log(data);

        },

        //handles the budget calculations
        calculateBudget: function() {

            //calculate the total expense and income
            calculateTotal('inc');
            calculateTotal('exp');

            //calculate the budget (income - expense)
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that is spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }

        },

        calculateIndividualExpensePercentage: function(ID) {

            var percentage, expenses = [];

            expenses = data.allItems.exp.map(function (current) {
                return current.value;
            });
    
            ID > 0 ? percentage = Math.round((expenses[ID]/data.totals.exp) * 100) : percentage = 100;
    
            return percentage;

        },

        //return budget related info
        getBudget: function() {
            return {

                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp

            };
        }

    }

})();



//UI CONTROLLER
var UIController = (function() {

    //set all the dom classes in one object
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    //return the public methods to expose them to other controllers
    return {
        getDOMStrings: function() {
            return DOMStrings;
        },

        //add new row to either income or expense part
        addListItem: function(object, type, individualExpense) {

            var html, element, newHtml;

            //create html placeholder string
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%expPercentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
            }

            //replace the html placeholder with actual data
            newHtml = html.replace('%id%', object.id);
            newHtml = newHtml.replace('%description%', object.description);
            newHtml = newHtml.replace('%value%', object.value);

            if (type === 'exp') {
                newHtml = newHtml.replace('%expPercentage%', individualExpense + "%");
            }

            //put the html in DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        //delete a row from either income or expense based on id
        deleteListItem: function(selectorID) {

            /*
                weird javascript fact: you cannot remove an element from DOM, you can only remove a child element from DOM. So we traverse to the desired element's parent and then select it back again to delete it. LOL 🤣
            */

            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);

        },

        //clear both description and value field upon entering an entry
        clearFields: function() {
            //obvious way
            /*
            document.querySelector(DOMStrings.inputDescription).value = "";
            document.querySelector(DOMStrings.inputValue).value = "";

            document.querySelector(DOMStrings.inputDescription).focus();
            */

            //efficient way
            var fields, fieldsArray;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();

        },

        getInputs: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        //display budget to UI
        displayBudget: function(budgetObj) {

            document.querySelector(DOMStrings.budgetLabel).textContent = budgetObj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = budgetObj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = budgetObj.totalExp;
            
            if (budgetObj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = budgetObj.percentage + "%";
            }
            else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }

        }
    };



})();



//GLOBAL APP CONTROLLER
var appController = (function(budgetCtrl, UICtrl) {

    //all the event listeners
    var setupEventListeners = function() {

        var DOMStrings = UICtrl.getDOMStrings();

        //add click event
        document.querySelector(DOMStrings.inputButton).addEventListener('click', ctrlAddItem);

        //add enter/return key event
        document.addEventListener('keypress', function(event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });

        //delete item
        document.querySelector(DOMStrings.container).addEventListener('click', crtlDeleteItem);


    };


    //add button click/pressed event
    var ctrlAddItem = function() {
        
        //get input from UI
        var inputs = UICtrl.getInputs();

        if (inputs.description !== "" && !isNaN(inputs.value) && inputs.value > 0) {
            
            //create a new item 
            var newItem = budgetCtrl.addItem(inputs.type, inputs.description, inputs.value);

            var individualExpense;

            if (inputs.type === 'exp') {

                individualExpense = budgetCtrl.calculateIndividualExpensePercentage(newItem.id);

            }
    
            //pass the item to UI
            UICtrl.addListItem(newItem, inputs.type, individualExpense);
    
            //clear the input field
            UICtrl.clearFields();
    
            //update the budget
            updateBudget();
        }

    };

    //delete item
    var crtlDeleteItem = function(event) {

        var itemID, splitID, type, ID;

        //traverse DOM from the button upto the parent element of the row and get its id
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            //split the type and id
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete the item from data
            budgetCtrl.deleteItem(type, ID);

            // delete the row from UI
            UICtrl.deleteListItem(itemID);

            //reupdate the budget
            updateBudget();

        }


    };

    //updates the main budget
    var updateBudget = function() {

        //calculate the budget
        budgetCtrl.calculateBudget();

        //get the budget
        var budget = budgetCtrl.getBudget();

        //update the budget in UI
        UICtrl.displayBudget(budget);

    };

    return {
        //the initialization function
        init: function() {
            console.log("App has started...");
            UICtrl.displayBudget({

                budget: 0,
                percentage: 0,
                totalInc: 0,
                totalExp: 0

            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

//app starter
appController.init();