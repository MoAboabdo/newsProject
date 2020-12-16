import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule }   from '@angular/forms';


import { CreateSportsComponent } from "./create-sports/create-sports.component";
import { AngularMaterialModule } from "../../angular-material.module";

@NgModule({
  declarations: [CreateSportsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule
  ]
})
export class PostsModule {}
