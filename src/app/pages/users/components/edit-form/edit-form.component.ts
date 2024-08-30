import {
  Component,
  effect,
  inject,
  input,
  InputSignal, OnInit, output, OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core'
import { IUser } from '../../../../interfaces/user.interface';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidatorFn,
  Validators,
} from '@angular/forms'
import { UserService } from '../../../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationErrorDirective } from '../../../../directives/validation-form.directive';
import { MatSelectModule } from '@angular/material/select';
import { NgClass } from '@angular/common'

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ValidationErrorDirective,
    NgClass,
  ],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.scss'
})
export class EditFormComponent implements OnInit {
  mode: InputSignal<number> = input.required<number>();
  userId: InputSignal<number | undefined> = input<number>();
  user: WritableSignal<IUser | undefined> = signal(undefined);
  closeForm: OutputEmitterRef<boolean> = output<boolean>();
  saveData: OutputEmitterRef<IUser> = output<IUser>();
  deleteUser: OutputEmitterRef<boolean> = output<boolean>();
  userForm!: FormGroup;

  userService = inject(UserService);
  fb = inject(FormBuilder);

  constructor() {
    effect(() => {
      if (this.userId()) {
        this.getUserInfo();
      } else {
        this.user.set(undefined);

        this.userForm.reset();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    this.saveData.emit(this.userForm.value);
  }

  onDelete(): void {
    this.deleteUser.emit(true);
  }

  private initForm(): void {
    const passwordRegex: RegExp = new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/);

    this.userForm = this.fb.group({
      username: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      type: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(passwordRegex)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(passwordRegex)]),
    },
      {
        validators: this.matchValidator('password', 'confirmPassword')
      });
  }

  private matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
        return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    }
  }

  private getUserInfo(): void {
    this.userService.getUser(this.userId()!).subscribe({
      next: (response: IUser): void => {
        this.user.set(response);

        this.userForm.patchValue({
          username: this.user()?.username,
          firstName: this.user()?.firstName,
          lastName: this.user()?.lastName,
          email: this.user()?.email,
          type: this.user()?.type,
          password: this.user()?.password,
          confirmPassword: this.user()?.password
        });
      }
    });
  }
}
