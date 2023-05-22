import {Menu, MenuItem, Separator} from "./menu.js";

export class MenuApi{

    static createMenu(){
        return new Menu()
    }

    static createItem(name, method){
        return new MenuItem(name, method)
    }

    static createSeparator(){
        return new Separator()
    }

}