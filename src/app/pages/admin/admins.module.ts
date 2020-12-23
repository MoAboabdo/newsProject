import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule }   from '@angular/forms';


import { AdminsCreateComponent } from "./admins-create/admins-create.component";
import { AngularMaterialModule } from "../../angular-material.module";

@NgModule({
  declarations: [AdminsCreateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule
  ]
})
export class PostsModule {}
