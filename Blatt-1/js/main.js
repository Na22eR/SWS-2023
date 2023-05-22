import {MenuApi} from "./menuApi.js";
import {Menu} from "./menu.js";


export function init(){
    addRClickListenerCanvas()
    addMoveListenerCanvas()
    addClickListenerCanvas()
    console.log("Init complete")
}

function setupContextMenu ( menuApi ) {
    const menu = menuApi.createMenu () ;
    const mItem1 = menuApi.createItem ( "I1", function(m) {
        console.log("I1"); // Imagine we would do something great here
        m.hide(); // hide the menu , so m === menu
    }) ;
    const mItem2 = menuApi.createItem ( "I2", function() {
        console.log ("I2"); // Imagine we would do something great here as well
    }) ;
    const mT1 = menuApi.createSeparator () ;
    const mItem3 = menuApi.createItem ( "I3" , function(m){
        m.hide () ; // Here , we just want to hide the menu
    }) ;
    menu.addItem(mItem1)
    //menu.addItems(mItem1, mItem2);
    menu.addItem(mT1);
    menu.addItem(mItem3);
    return menu;
}


function addRClickListenerCanvas(){

    document.getElementById("canvas").addEventListener("contextmenu", function(e){
        e.preventDefault();

        /*
        let menu = MenuApi.createMenu();
        let item = MenuApi.createItem("Test", function(){console.log("Info: Test clicked"); } )

        menu.addItem(item)
        menu.show(e.clientX,e.clientY)
        */

        const menu = setupContextMenu(MenuApi);
        menu.show(e.clientX,e.clientY)

        console.log("Event: Canvas right clicked");

    } );


}

function addMoveListenerCanvas(){

    document.getElementById("canvas").addEventListener("mousemove", function(e){
        let x = e.clientX - 8
        let y = e.clientY - 8
        document.getElementById("coordinates").textContent = "Coordinates: " + x + ", " + y;
        console.log("Event: Mouse moved");
        //console.log("Coordinates: " + x + ", " + y);
        e.preventDefault();
    } );


}


function addClickListenerCanvas(){

    document.getElementById("canvas").addEventListener("click", function(e){
        let x = e.clientX - 8
        let y = e.clientY - 8

        let list = document.getElementById("CordList");
        let listItem = document.createElement("li");
        listItem.textContent = "X-Pos: " + x + ", Y-Pos: " + y
        list.appendChild(listItem)

        console.log("Event: Canvas left clicked");
        e.preventDefault();
    } );

}


init()