console.log("starting script");

$.getJSON("easter_bunny_peep.json", function(json) {
    console.log(json);
    loadPattern(json)
});

var checkboxes = [];

function loadPattern(data_json){
    console.log(data_json);
    document.getElementById("pattern-title").innerHTML = data_json["title"];
    document.getElementById("pattern-subtitle").innerHTML = data_json["subtitle"];
    
    loadFeaturedImages(data_json);
    loadMaterials(data_json);
    loadCrochetTerms(data_json);
    
    document.getElementById("pattern-finished-size").innerHTML = data_json["finished_size"];

    loadNotes(data_json);

    document.getElementById("pattern-disclaimer").innerHTML = `****This pattern is for personal use only. Please do not copy, share or distribute 
                                                                any portion of the pattern. Pattern made by Benny Buds. You can sell the bunny you made! 
                                                                Just give credit for the pattern to Benny Buds.****`;
    
    loadSteps(data_json);

    loadPatternImages(data_json);

    doCheckboxStuff();

}

function loadFeaturedImages(data_json){
    var images = data_json["featured_images"];
    for (var i = 0; i < images.length; i++){
        var img = document.createElement("img");
        console.log(data_json["featured_images"][i])
        img.setAttribute("src", data_json["featured_images"][i]);
        img.setAttribute("class", "featured-images");
        document.getElementById("pattern-featured-images").appendChild(img);
    }
}

function loadMaterials(data_json){
    var materials = data_json["materials"];
    var materialsList = document.createElement("ul");
    for (var i = 0; i < materials.length; i++){
        var materialItem = document.createElement("li");
        materialItem.innerHTML = data_json["materials"][i];
        materialsList.appendChild(materialItem);
    }
    document.getElementById("pattern-materials-list").appendChild(materialsList);
}

function loadCrochetTerms(data_json){
    var crochetTerms = data_json["crochet_terms"];
    var crochetTermsList = document.createElement("ul");
    for (var i = 0; i < crochetTerms.length; i++){
        var crochetTermItem = document.createElement("li");
        crochetTermItem.innerHTML = data_json["crochet_terms"][i];
        crochetTermsList.appendChild(crochetTermItem);
    }
    document.getElementById("pattern-crochet-terms-list").appendChild(crochetTermsList);
}

function loadNotes(data_json){
    var notes = data_json["notes"];
    var notesList = document.createElement("ul");
    for (var i = 0; i < notes.length; i++){
        var notesItem = document.createElement("li");
        notesItem.innerHTML = data_json["notes"][i];
        notesList.appendChild(notesItem);
    }
    document.getElementById("pattern-notes-list").appendChild(notesList);
}

function loadSteps(data_json){
    var sections = data_json["pattern"];
    var sectionsDiv = document.createElement("div");

    for (var i = 0; i < sections.length; i++){
        var sectionDiv = document.createElement("div");

        var sectionTitle = document.createElement("div");
        sectionTitle.setAttribute("class", "section-title");
        sectionTitle.innerHTML = toTitleCase(sections[i]["section_name"]);
        sectionDiv.appendChild(sectionTitle);

        if(sections[i]["quantity"] > 1){
            var sectionQuantity = document.createElement("div");
            sectionQuantity.setAttribute("class", "section-quantity");
            sectionQuantity.innerHTML = "(make " + sections[i]["quantity"] + ")";
            sectionDiv.appendChild(sectionQuantity);
        }

        var stepsDiv = document.createElement("div");
        stepsDiv.setAttribute("class", "steps-container")
        var steps = sections[i]["steps"];
        for (var o = 0; o < steps.length; o++){
            if(steps[o]["type"] == "row"){
                var checkboxDiv = document.createElement("div");
                checkboxDiv.setAttribute("class", "checkbox-div");

                var checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");

                var id = steps[o]["value"].split(":")[0];
                //console.log("id: " + id);
                checkbox.setAttribute("id", id);
                checkboxDiv.appendChild(checkbox);

                var label = document.createElement("label");
                label.setAttribute("for", id)
                label.innerHTML = steps[o]["value"];
                checkboxDiv.appendChild(label);


                stepsDiv.appendChild(checkboxDiv);
            }
            else if(steps[o]["type"] == "note"){
                var note = document.createElement("div");
                note.setAttribute("class", "step-note");
                note.innerHTML = steps[o]["value"];
                stepsDiv.appendChild(note);
            }
            else if(steps[o]["type"] == "image"){
                var imgDiv = document.createElement("div");
                var img = document.createElement("img");
                img.setAttribute("class", "step-image");
                img.setAttribute("src", steps[o]["value"]);
                imgDiv.appendChild(img);
                stepsDiv.appendChild(imgDiv);
            }
        }
        sectionDiv.appendChild(stepsDiv);
        sectionsDiv.appendChild(sectionDiv);
    }
    document.getElementById("pattern-steps").appendChild(sectionsDiv);
}

function loadPatternImages(data_json){
    var images = data_json["pattern_images"];
    for (var i = 0; i < images.length; i++){
        var img = document.createElement("img");
        console.log(data_json["pattern_images"][i])
        img.setAttribute("src", data_json["pattern_images"][i]);
        img.setAttribute("class", "pattern-images");
        document.getElementById("pattern-images").appendChild(img);
    }
}

var checkboxes = [];

function doCheckboxStuff(){
    var previous = localStorage.getItem(window.location);
    var json = JSON.parse(previous);
    //console.log(json);

    var allInputs = document.getElementsByTagName("input");
    console.log(allInputs);
    
    for (var i = 0, max = allInputs.length; i < max; i++){
        if (allInputs[i].type === 'checkbox'){
            checkboxes.push(allInputs[i]);
            allInputs[i].addEventListener('change', checkboxChanged);
            if(json != null){
                for(var o = 0;o < json.length; o++){
                    if(allInputs[i].id == json[o].id){
                        allInputs[i].checked = json[o].checked;
                    }
                }
            }
        }
    }
}

function checkboxChanged(evt){
    var checkboxArray = [];
    
    checkboxes.forEach(function(checkbox){
        var obj = {};
        obj.id = checkbox.id;
        obj.checked = checkbox.checked;
        checkboxArray.push(obj);
    })
    console.log(checkboxArray);
    saveToLocalStorage(checkboxArray);
}

function saveToLocalStorage(arr){
    localStorage.setItem(window.location, JSON.stringify(arr));
    console.log("saved to local storage");
}

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}