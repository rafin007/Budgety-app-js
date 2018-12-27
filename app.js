
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
        }
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

        testing: function() {
            console.log(data);
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
        expensesContainer: '.expenses__list'
    };

    //return the public methods to expose to other controllers
    return {
        getDOMStrings: function() {
            return DOMStrings;
        },

        addListItem: function(object, type) {

            var html, element;

            //create html placeholder string
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the html placeholder with actual data
            newHtml = html.replace('%id%', object.id);
            newHtml = newHtml.replace('%description%', object.description);
            newHtml = newHtml.replace('%value%', object.value);

            //put the html in DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        getInputs: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
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

        //add enter event
        document.addEventListener('keypress', function(event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });
    };


    //add button click/pressed event
    var ctrlAddItem = function() {
        
        //get input from UI
        var inputs = UICtrl.getInputs();
        
        //create a new item 
        var newItem = budgetCtrl.addItem(inputs.type, inputs.description, inputs.value);

        //pass the item to UI
        UICtrl.addListItem(newItem, inputs.type);

    };

    return {
        //the initialization function
        init: function() {
            console.log("App has started...")
            setupEventListeners();
        }
    };

})(budgetController, UIController);

//app starter
appController.init();