import {MenuApi} from "./menuApi.js";


function init(){
    addRClickListenerCanvas()
    addMoveListenerCanvas()
    addClickListenerCanvas()
    console.log("Init complete")
}

function setupContextMenu ( menuApi ) {
    const menu = menuApi.createMenu () ;
    const mItem1 = menuApi.createItem ( "I1", function() {
        console.log("I1"); //Imagine we would do something great here
        menu.hide(); //hide the menu
    }) ;
    const mItem2 = menuApi.createItem ( "I2", function() {
        console.log ("I2"); //Imagine we would do something great here as well
    }) ;
    const mT1 = menuApi.createSeparator () ;
    const mItem3 = menuApi.createItem ( "I3" , function(){
        menu.hide () ; //Here, we just want to hide the menu
    }) ;
    let itemArray = [mItem1, mItem2]
    menu.addItems(itemArray);
    menu.addItem(mT1);
    menu.addItem(mItem3);
    return menu;
}

//Adding Listener for right click events
function addRClickListenerCanvas(){

    document.getElementById("canvas").addEventListener("contextmenu", function(e){
        e.preventDefault();

        const menu = setupContextMenu(MenuApi);
        menu.show(e.clientX,e.clientY)

        console.log("Event: canvas right clicked");
    } );

}

//Adding Listener for mouse movements
function addMoveListenerCanvas(){

    document.getElementById("canvas").addEventListener("mousemove", function(e){
        e.preventDefault();

        let x = e.clientX - document.getElementById("canvas").offsetLeft
        let y = e.clientY - document.getElementById("canvas").offsetTop

        document.getElementById("coordinates").textContent = "Coordinates: x:" + x + ", y: " + y;

        console.log("Event: Mouse moved");
    } );

}

//Adding Listener for left click events
function addClickListenerCanvas(){

    document.getElementById("canvas").addEventListener("click", function(e){
        e.preventDefault();

        let x = e.clientX - document.getElementById("canvas").offsetLeft
        let y = e.clientY - document.getElementById("canvas").offsetTop

        let list = document.getElementById("CordList");
        let listItem = document.createElement("li");
        listItem.textContent = "X-Pos: " + x + ", Y-Pos: " + y
        list.appendChild(listItem)

        console.log("Event: canvas left clicked");
    } );

}

//Calling init method to add all listeners
init()