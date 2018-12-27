
//BUDGET CONTROLLER
var budgetController = (function() {

    



})();



//UI CONTROLLER
var UIController = (function() {

    //set all the dom classes in one object
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };

    //return the public methods to expose to other controllers
    return {
        getDOMStrings: function() {
            return DOMStrings;
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
        
        var inputs = UICtrl.getInputs();
        console.log(inputs);

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