import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";


import { WorldService } from "../world.service";
import { World } from "../world.model";
import { mimeType } from "./mime-type.validator";
import { UserService } from "../../../services/user.service";
@Component({
  selector: 'app-news-create',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.css']
})
export class NewsCreateComponent implements OnInit, OnDestroy {

  enteredTitle = "";
  enteredDescription = "";
  enteredArticle = "";
  world: World;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private worldId: string;
  private authStatusSub: Subscription;

  constructor(
    public worldService: WorldService,
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
        if (paramMap.has("worldId")) {
          this.mode = "edit";
          this.worldId = paramMap.get("worldId");
          this.isLoading = true;
          this.worldService.getWorld(this.worldId).subscribe(worldData => {
            this.isLoading = false;
            this.world = {
              id: worldData._id,
              title: worldData.title,
              description: worldData.description,
              article: worldData.article,
              imagePath: worldData.imagePath,
              creator: worldData.creator
            };
            this.form.setValue({
              title: this.world.title,
              description: this.world.description,
              article: this.world.article,
              image: this.world.imagePath
            });
          });
        } else {
          this.mode = "create";
          this.worldId = null;
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
  
    onSaveWorld() {
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      if (this.mode === "create") {
        this.worldService.addWorld(
          this.form.value.title,
          this.form.value.description,
          this.form.value.article,
          this.form.value.image
        );
      } else {
        this.worldService.updateWorld(
          this.worldId,
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
