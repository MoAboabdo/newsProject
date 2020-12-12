import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import {UserService} from "../../services/user.service"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.authStatusSub = this.userService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.userService.createUser(form.value.email, form.value.password,form.value.name);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
