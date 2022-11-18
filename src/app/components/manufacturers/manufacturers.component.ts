import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ManufacturerDisplayModel } from 'src/app/models/manufacturer.model';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import { AddManufacturersComponent } from './add-manufacturers/add-manufacturers.component';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})
export class ManufacturersComponent implements OnInit {
  
  private subs: Subscription = new Subscription();
  
  public loading = false;
  
  displayedColumns: string[] = ['name', 'edit-button', 'delete-button'];
  
  public manufacturers = new MatTableDataSource<ManufacturerDisplayModel>([]);

  constructor(private manufacturerServices: ManufacturerService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    this.subs.add(this.manufacturerServices.getAllManufacturersInOrganizationSync()
      .subscribe(manufacturers => {
        this.loading = false;
        this.manufacturers = new MatTableDataSource(manufacturers.map(m => m.map(m => {
          return {id: m.payload.doc.id, name: m.payload.doc.data()?.name!}})).flat()
    )}))
  }

  addManufacturer() {
    this.dialog.open(AddManufacturersComponent)
  }

  editManufacturer(manufacturer: ManufacturerDisplayModel) {
    this.dialog.open(AddManufacturersComponent, { data: manufacturer })
  }

  deleteManufacturer(id: string) {
    this.manufacturerServices.deleteManufacturer(id)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.manufacturers.filter = filterValue.trim().toLocaleLowerCase();
  }

}