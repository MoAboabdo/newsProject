import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule }   from '@angular/forms';


import { AdminCreateComponent } from "./admin-create/admin-create.component";
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  declarations: [AdminCreateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule
  ]
})
export class PostsModule {}
