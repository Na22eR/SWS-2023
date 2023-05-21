
function init(){
    addListenerCanvas()
    addMoveListenerCanvas()
    addClickListenerCanvas()
    console.log("Init complete")
}


function addListenerCanvas(){

    document.getElementById("canvas").addEventListener("contextmenu", function(e){
        console.log("Event: Canvas right clicked");
        e.preventDefault();
    } );


}

function addMoveListenerCanvas(){

    document.getElementById("canvas").addEventListener("mousemove", function(e){
        var x = e.clientX - 8
        var y = e.clientY - 8
        document.getElementById("coordinates").textContent = "Coordinates: " + x + ", " + y;
        console.log("Event: Mouse moved");
        //console.log("Coordinates: " + x + ", " + y);
        e.preventDefault();
    } );


}


function addClickListenerCanvas(){

    document.getElementById("canvas").addEventListener("click", function(e){
        var x = e.clientX - 8
        var y = e.clientY - 8

        var list = document.getElementById("CordList");
        var listItem = document.createElement("li");
        listItem.textContent = "X-Pos: " + x + ", Y-Pos: " + y
        list.appendChild(listItem)

        console.log("Event: Canvas left clicked");
        e.preventDefault();
    } );


}
