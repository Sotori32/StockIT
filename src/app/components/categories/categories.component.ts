import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CategoryDisplayModel, CategoryModel } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category/category.service';
import { AddCategoryComponent } from './add-category/add-category.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  private subs: Subscription = new Subscription();

  constructor(private categoryService: CategoryService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subs.add(this.categoryService.getAllOrganizationCategoriesSync().subscribe(categories => {
      this.categories = categories.map(c => c.map(c => {return {id: c.payload.doc.id, name: c.payload.doc.data()?.name!}})).flat()
    }))
  }

  displayedColumns: string[] = ['name', 'actions'];
  categories: CategoryDisplayModel[] = [];
 
  addCategory() {
    this.dialog.open(AddCategoryComponent)
  }

  editCategory(category: CategoryDisplayModel){
    this.dialog.open(AddCategoryComponent, {data: category})
  }

  deleteCategory(id: string){
    this.categoryService.deleteCategory(id)
  }
}