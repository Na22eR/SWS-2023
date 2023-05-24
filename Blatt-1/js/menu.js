export class Menu {
    items = [];
    menuDOM;
    helperDiv;

    constructor() {
        this.menuDOM = document.createElement("ul");
        this.helperDiv = document.createElement("div");

        this.helperDiv.setAttribute("class", "helperDiv");
        this.menuDOM.setAttribute("class", "ulMenu");
    }

    addItem(item) {
        this.items.push(item);
        this.menuDOM.appendChild(item.render());
    }

    //Check if parameter is array & iterate over it
    addItems(items) {
        if (Array.isArray(items)) {
            items.forEach(item => {
                this.items.push(item);
                this.menuDOM.appendChild(item.render());
            });
        } else {
            console.error('Items is not an array.');
        }
    }

    hide() {
        this.menuDOM.setAttribute("style", "display:none");
        //Removes all children of menuDom
        while (this.menuDOM.firstChild) {
            this.menuDOM.removeChild(this.menuDOM.firstChild);
        }
        //Removes the helperDiv with has the menuDom as child
        document.body.removeChild(this.helperDiv);
    }

    show(x, y) {

        //First append the helperDiv then the menuDom
        document.body.appendChild(this.helperDiv);
        this.helperDiv.appendChild(this.menuDOM);

        this.menuDOM.style.display = "block";
        this.helperDiv.style.display = "block";

        this.menuDOM.style.left = (x) + "px";
        this.menuDOM.style.top = (y) + "px";

        //Disable right click when menu is shown
        this.helperDiv.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });

        //Remove the menu when left click occurs
        this.helperDiv.addEventListener("click", () => {
                document.body.removeChild(this.helperDiv);
            }
        );
    }

}

export class MenuItem {
    id;
    domRepresentation;
    name;
    method;

    //Constructor sets given attributes
    constructor(name, method) {
        this.id = Math.random();
        this.name = name;
        this.method = method;
        this.domRepresentation = document.createElement("li");
        this.domRepresentation.setAttribute("class", "menuItem");
        this.domRepresentation.textContent = name;
        this.domRepresentation.addEventListener("click", method);
    }

    //Returns the domRepresentation
    render() {
        return this.domRepresentation;
    }
}

//Extends menu item, domRepresentation is set to horizontal rule instead of list
export class Separator extends MenuItem {
    constructor() {
        super();
        this.domRepresentation = document.createElement("hr");
    }
}
