import { Component, AfterViewInit } from "@angular/core";
import { ShortcutInput } from "ng-keyboard-shortcuts";

@Component({
  selector: "nested-component",
  template: `<ng-keyboard-shortcuts [shortcuts]="shortcuts"></ng-keyboard-shortcuts>`
})
export class NestedComponent implements AfterViewInit {
  title = "Angular Router Demo";
  shortcuts: ShortcutInput[] = [];
  ngAfterViewInit() {
    this.shortcuts.push({
      key: ["cmd + g"],
      label: "Help",
      description: "Command + G",
      command: e => console.log(e),
      preventDefault: true
    });
  }
}
