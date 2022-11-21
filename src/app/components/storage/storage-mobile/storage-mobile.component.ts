import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ItemDisplayModel } from 'src/app/models/item.model';

@Component({
  selector: 'app-storage-mobile',
  templateUrl: './storage-mobile.component.html',
  styleUrls: ['./storage-mobile.component.css']
})
export class StorageMobileComponent implements OnInit {
  @Input() items: ItemDisplayModel[] | undefined;
  
  constructor() { }

  ngOnInit(): void {
  }

}
