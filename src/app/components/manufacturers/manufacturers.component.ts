import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(private manufacturerServices: ManufacturerService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subs.add(this.manufacturerServices.getAllManufacturersInOrganizationSync().subscribe(manufacturers => {
      this.manufacturers = manufacturers.map(c => { return { id: c.payload.doc.id, name: c.payload.doc.data()?.name! } })
    }))
  }

  displayedColumns: string[] = ['name', 'actions'];
  manufacturers: ManufacturerDisplayModel[] = [];

  addManufacturer() {
    this.dialog.open(AddManufacturersComponent)
  }

  editManufacturer(manufacturer: ManufacturerDisplayModel) {
    this.dialog.open(AddManufacturersComponent, { data: manufacturer })
  }

  deleteManufacturer(id: string) {
    this.manufacturerServices.deleteManufacturer(id)
  }
}