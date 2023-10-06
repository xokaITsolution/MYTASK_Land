import { Component, Input, OnInit } from "@angular/core";
import { TreeNode } from "primeng/api";

@Component({
  selector: "app-tree-component",
  templateUrl: "./tree-component.component.html",
  styleUrls: ["./tree-component.component.css"],
})
export class TreeComponentComponent implements OnInit {
  constructor() {}
  @Input() nodes: TreeNode[] = [];
  ngOnInit() {}
}
