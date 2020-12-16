import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import {AdminCreateService} from "../admin-create.service";
import { Admin } from "../admin.model";
import { UserService } from "../../services/user.service"


@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.css']
})
export class AdminCreateComponent implements OnInit, OnDestroy {

  enteredName = "";
  enteredEmail = "";
  enteredPassword = "";
  enteredType = "";
  admin: Admin;
  isLoading = false;
  form: FormGroup;
  private mode = "create";
  private adminId: string;
  private authStatusSub: Subscription;

  constructor(
    public adminsService: AdminCreateService,
    public route: ActivatedRoute,
    private authService: UserService
    ) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      type: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(1)]
      }),
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("adminId")) {
        this.mode = "edit";
        this.adminId = paramMap.get("adminId");
        this.isLoading = true;
        this.adminsService.getAdmin(this.adminId).subscribe(adminData => {
          this.isLoading = false;
          this.admin = {
            id: adminData._id,
            name: adminData.name,
            email: adminData.email,
            password: adminData.password,
            type:adminData.type,
            creator:adminData.creator
          };
          this.form.setValue({
            name: this.admin.name,
            email: this.admin.email,
            password: this.admin.password
          });
        });
      } else {
        this.mode = "create";
        this.adminId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.adminsService.addAdmin(
        this.form.value.name,
        this.form.value.type,
        this.form.value.email,
        this.form.value.password
      );
    } else {
      this.adminsService.updateAdmin(
        this.adminId,
        this.form.value.name,
        this.form.value.email,
        this.form.value.type,
        this.form.value.password,

      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
