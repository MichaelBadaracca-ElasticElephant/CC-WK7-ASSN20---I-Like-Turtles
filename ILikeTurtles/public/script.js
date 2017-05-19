$(document).ready(function () {

    /*
        Function to get the turtles from the server
    */
    function getTurtles() {
        // get request to get the turtles
        // I've rewritten this as an $.ajax call to handle the error state
        $.ajax({
            method: "GET",
            url: '/api/turtles',
            success: function (turtles) {
                // when we get a response, wipe out all of the turtle divs
                $('#output').empty();
                for (turtle of turtles) {
                    buildAndDisplayTurtleHtml(turtle);
                }
            },
            error: function (err) {
                // On an error (unable to get the turtles), show the login form
                $('.login-form').show();
            }
        });
    }

    function buildAndDisplayTurtleHtml(turtle) {
        //build turtle html
            //creates a buy pizza button with a dynamically created Id
            //creates a delete turtle button with a dynamically created data- attribute storing the turtle id
        var turtleHtml = `<div class="col-md-3">
                                <div class="turtle">
                                    <h3 class="turtle_name">${turtle.name}</h3>
                                    <p class="turtle_weapon">${turtle.weapon}</p>
                                    <p id="numPizzas${turtle._id}">Pizzas: ${turtle.numberOfPizzas}</p>
                                    <span>
                                        <button id="${turtle._id}" class="btn btn-warning buy_pizza">Buy Pizza</button>
                                        <button class="delete-turtle btn btn-danger" data-killId="${turtle._id}">Kill</button>
                                    </span>
                                </div>
                            </div>`;
        //display turtle html
        $('#output').append(turtleHtml);
        //create click listent for newly created pizza button
        createBuyPizzaClickListener(turtle._id);
    }

    //One approach to click handling - attach a listener to each new buy pizza button that is created
    function createBuyPizzaClickListener(turtleId) {
        $('#' + turtleId).click(function () {
            $.post('api/buyPizza/', { turtleId: turtleId }, function (data) {
                //update the number of pizzas
                $(`#numPizzas${turtleId}`).text(`Pizzas: ${data}`);
            });
        });
    }

    //Another approach to a click listener - add a class to delete buttons and a data attribute with the turtle id. Then look for clicks on anything with that class and extract the data attribute
    $(document).on('click', '.delete-turtle', function () {
        var turtleId = this.dataset.killid;
        var turtleDeleteButton = this;
        //Using the params routing approach - I know this is inconsistent with previous post 
        //Methodology, but I am trying to get practice with different approaches
        $.post(`/api/killTurtle/${turtleId}`, function (data) {
            $(turtleDeleteButton).closest(".turtle").remove();
        });
    });

    /*
        Click listener for adding a new turtle
    */
    $('#newTurtleSubmit').click(function () {
        // post the turtle
        // todo: add some validation here
        $.post('/api/newTurtle', {
            name: $('#newTurtleName').val(),
            color: $('#newTurtleColor').val(),
            weapon: $('#newTurtleWeapon').val()
        }, function () {
            // on success, clear out the existing turtle inputs
            $('#newTurtleName').val('');
            $('#newTurtleColor').val('');
            $('#newTurtleWeapon').val('');
            // and re-build the turtles div from the database
            getTurtles();
        });
    });
    // get the turtles on page load

    getTurtles();


    /*
        Click listener for the login button
    */
    $('#login').click(function () {
        // post to the login api
        $.post('/api/login', {
            username: $('#username').val(),
            password: $('#password').val()
        }, function (res) {
            // If we haven't logged in, display an error
            if (res === "error") {
                $('#login-error').text('Error: Username or password incorrect.');
            } else {
                // Otherwise, hide the login form and get the turtles
                $('.login-form').hide();
                getTurtles();
            }
        });
    });

    /*
        Click listener for registering a user
    */
    $('#register').click(function () {
        // todo: add validation
        $.post('/api/register', {
            username: $('#username').val(),
            password: $('#password').val()
        }, function (res) {
            // Display the result to the user
            if (res === "error") {
                $('#login-error').text('Error: Could not register user.');
            } else {
                $('#login-error').text('Registered! Try logging in...');
            }
        });
    });
})
