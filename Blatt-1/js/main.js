
console.log("Init complete")


function test(){

    document.getElementById("halloLink").addEventListener("click", function(){
        console.log("Link geklickt");
        //e.preventDefault();

    } );
}


function test2(){

    document.getElementById("halloLink").addEventListener("contextmenu", function(){
        console.log("Link geklickt"); } );


}