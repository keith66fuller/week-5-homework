$('document').ready( function() {
    var topics = [
        "president",
        "car",
        "robot",
        "tree",
        "goblin",
        "candy",
        "ship"
    ];

    $.ajax({
        url: "https://api.wordnik.com:443/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
        method: 'GET',
    })
    .done(function(response) {
        response.forEach(element => {
            topics.push(element.word);
        });
        renderButtons();
    })


    var aNum = new RegExp(/^[A-Za-z0-9 ]+$/);
    
    // For each topic, create a button.  The button will be a static giphy image.


    
    // Without this, my dynamically generated buttons would not respond to clicks
    // http://learn.jquery.com/events/event-delegation/
    $('#buttonsDiv').on('click', '.topicButton', function(event) {
        var query = event.target.id;
        var queryUrl = `https://api.giphy.com/v1/gifs/search?api_key=Rg9Rfrh8KQEOzilbobJEVYSckFcwRfEN&q=${query}&limit=10&offset=0&lang=en`;
        
        $.ajax({
            url: queryUrl,
            method: 'GET',
        })
        .done(function(response) {
            $('#imagesDiv').empty();
            response.data.forEach(element => {
                var url1 = element.images.downsized_still.url;
                var url2 = element.images.preview_gif.url;
                var rating = element.rating.toUpperCase();
                var image = $('<img>').attr('src',url1).addClass('giphyImg').data('url1',url1).data('url2',url2);

                var caption = $('<figcaption>').text(`Rating: ${rating}`)
                var newDiv = $('<div>').append(caption).append(image);
                $('#imagesDiv').append(newDiv);
                
            });
        })
        
    });
    $('#imagesDiv').on('click', '.giphyImg', function(event) {
        if ($(event.target).attr('src') == $(event.target).data('url1')) {
            $(event.target).attr('src', $(event.target).data('url2'))
        } else {
            $(event.target).attr('src', $(event.target).data('url1'))
        }
    });
    function addButton(element) {
        var button=$('<button>').text(element);
        $(button).attr('id',element);
        $(button).addClass('topicButton');
        $('#buttonsDiv').append(button);
        // Return the button reference so that we can simulate a click on it elsewhere.
        return button;
    }
    function renderButtons() {
        topics.forEach(element => {
            addButton(element);
        });
    }

    // renderButtons();

    $('#userForm').on('submit', function(event) {
        //So that the submit event does not reload the page, which resets the value of the topics array and wipes
        //out our buttons.
        event.preventDefault();
        var newTopic = userInput.value;
        $('#userInput').val('');
        
        if (! aNum.test(newTopic)) { return };
        if (newTopic == '') { return };
        if (topics.indexOf(newTopic) >= 0) { return };
        topics.push(newTopic);
        // Simulate a click on the newly added button in order to populate with the new images.
        addButton(newTopic).click();
    });
});
