import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";



import { AdminsService } from "../admins.service";
import { Admin } from "../admins.model";
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-admins-create',
  templateUrl: './admins-create.component.html',
  styleUrls: ['./admins-create.component.css']
})
export class AdminsCreateComponent implements OnInit, OnDestroy {

  enteredName = "";
  enteredEmail = "";
  enteredType = "";
  enteredPassword = "";
  admin: Admin;
  isLoading = false;
  form: FormGroup;
  private mode = "create";
  private adminId: string;
  private authStatusSub: Subscription;

  constructor( 
    public adminService: AdminsService,
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
        email: new FormControl(null, { validators: [Validators.required] }),
        type: new FormControl(null, { validators: [Validators.required] }),
        password: new FormControl(null, { validators: [Validators.required] })
      });

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has("adminId")) {
          this.mode = "edit";
          this.adminId = paramMap.get("adminId");
          this.isLoading = true;
          this.adminService.getAdmin(this.adminId).subscribe(adminData => {
            this.isLoading = false;
            this.admin = {
              id: adminData._id,
              name: adminData.name,
              email: adminData.email,
              type: adminData.type,
              password: adminData.password,
              avatar: adminData.avatar,

            };
            this.form.setValue({
              name: this.admin.name,
              email: this.admin.email,
              password: this.admin.password,
              type: this.admin.type
            });
          });
        } else {
          this.mode = "create";
          this.adminId = null;
        }
      });
    }

    onSaveAdmin() {
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      if (this.mode === "create") {
        this.adminService.addAdmin(
          this.form.value.name,
          this.form.value.email,
          this.form.value.password,
          this.form.value.type
        );
      } else {
        this.adminService.updateAdmin(
          this.adminId,
          this.form.value.name,
          this.form.value.email,
          this.form.value.password,
          this.form.value.type
        );
      }
      this.form.reset();
    }
  
    ngOnDestroy() {
      this.authStatusSub.unsubscribe();
    }

}
