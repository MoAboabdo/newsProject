import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { MiddleEastService } from "../middle-east.service";
import { MiddleEast } from "../middleEast.model";
import { mimeType } from "./mime-type.validator";
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-news-create',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.css']
})
export class NewsCreateComponent implements OnInit {

  enteredTitle = "";
  enteredDescription = "";
  enteredArticle = "";
  middleEast: MiddleEast;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private middleEastId: string;
  private authStatusSub: Subscription;

  constructor(
    public middleEastService: MiddleEastService,
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
        title: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(3)]
        }),
        description: new FormControl(null, { validators: [Validators.required] }),
        article: new FormControl(null, { validators: [Validators.required] }),
        image: new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        })
      });
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has("middleEastId")) {
          this.mode = "edit";
          this.middleEastId = paramMap.get("middleEastId");
          this.isLoading = true;
          this.middleEastService.getMiddleEast(this.middleEastId).subscribe(middleEastData => {
            this.isLoading = false;
            this.middleEast = {
              id: middleEastData._id,
              title: middleEastData.title,
              description: middleEastData.description,
              article: middleEastData.article,
              imagePath: middleEastData.imagePath,
              creator: middleEastData.creator
            };
            this.form.setValue({
              title: this.middleEast.title,
              description: this.middleEast.description,
              article: this.middleEast.article,
              image: this.middleEast.imagePath
            });
          });
        } else {
          this.mode = "create";
          this.middleEastId = null;
        }
      });
  
  
  
    }
  
    onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({ image: file });
      this.form.get("image").updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string ;
      };
      reader.readAsDataURL(file);
    }
  
    onSaveMiddleEast() {
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      if (this.mode === "create") {
        this.middleEastService.addMiddleEast(
          this.form.value.title,
          this.form.value.description,
          this.form.value.article,
          this.form.value.image
        );
      } else {
        this.middleEastService.updateMiddleEast(
          this.middleEastId,
          this.form.value.title,
          this.form.value.description,
          this.form.value.article,
          this.form.value.image
        );
      }
      this.form.reset();
    }
  
    ngOnDestroy() {
      this.authStatusSub.unsubscribe();
    }
}
