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
        url: "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
        method: 'GET',
    })
    .done(function(response) {
        console.log(response);
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
        console.log(event);
        console.log(event.target.id);
        var query = event.target.id;
        var queryUrl = `https://api.giphy.com/v1/gifs/search?api_key=Rg9Rfrh8KQEOzilbobJEVYSckFcwRfEN&q=${query}&limit=10&offset=0&lang=en`;
        
        $.ajax({
            url: queryUrl,
            method: 'GET',
        })
        .done(function(response) {
            $('#imagesDiv').empty();
            console.log(response);
            response.data.forEach(element => {
                var url = element.images.preview_gif.url;
                var rating = element.rating.toUpperCase();
                
                var image = $('<img>').attr('src',url).addClass('giphyImg');
                var caption = $('<figcaption>').text(`Rating: ${rating}`)
                var newDiv = $('<div>').append(caption).append(image);
                $('#imagesDiv').append(newDiv);
                
            });
        })
        
    });
    function addButton(element) {
        var button=$('<button>').text(element);
        $(button).attr('id',element);
        $(button).addClass('topicButton');
        $('#buttonsDiv').append(button);
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
        console.log(userInput.value);
        var newTopic = userInput.value;
        $('#userInput').val('');
        
        if (! aNum.test(newTopic)) {
            console.log(`${newTopic} not alphanumeric`);
            return
        };
        if (newTopic == '') {
            console.log('blank topic');
            return
        };
        if (topics.indexOf(newTopic) >= 0) {
            console.log(`Topic ${newTopic} already exists`);
            return
        };
        topics.push(newTopic);
        addButton(newTopic);
    });
});
