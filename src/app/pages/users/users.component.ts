import {
  Component, inject,
  OnInit, signal, WritableSignal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { IUser } from '../../interfaces/user.interface';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { MessageComponent } from '../../components/message/message.component'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTableModule,
    UsersTableComponent,
    EditFormComponent,
    MessageComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: WritableSignal<IUser[]> = signal([]);
  user: WritableSignal<IUser | undefined> = signal(undefined);
  /*
    1 - users list
    2 - create user
    3 - update user
  */
  mode: number = 1;
  message = {
    hidden: true,
    type: '',
    message: ''
  }
  timer: ReturnType<typeof setTimeout> | null = null;

  userService = inject(UserService);

  ngOnInit(): void {
    this.getUsers();
  }

  openCreateMode(): void {
    this.user.set(undefined);
    this.mode = 2;
  }

  selectUser(userId: number): void {
    if (!this.user() || (this.user()!.id !== userId)) {
      this.user.set(this.users().filter(user => user.id === userId)[0]);
      this.mode = 3;
    }
  }

  closeForm(): void {
    this.user.set(undefined);
    this.mode = 1;
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response): void => {
        this.users.set(response);
      },
      error: (err): void => {
        this.showMessage('error', err.error);
      }
    });
  }

  saveUser(userData: IUser) {
    if (this.mode === 2) {
      this.createUser(userData);
    } else {
      this.updateUser(userData);
    }
  }

  createUser(userData: IUser): void {
    this.userService.createUser(userData).subscribe({
      next: (response): void => {
        this.users.update(users => {
          return [...users, response];
        });

        this.closeForm();

        this.showMessage('message', 'User created successfully');
      },
      error: (err): void => {
        this.showMessage('error', err.error);
      }
    });
  }

  updateUser(userData: IUser): void {
    this.userService.updateUser(this.user()!.id, userData).subscribe({
      next: (response): void => {
        this.users.update(users => {
          return users.flatMap(user => user.id === this.user()!.id ? response : user);
        });

        this.closeForm();

        this.showMessage('message', 'User updated successfully');
      },
      error: (err): void => {
        this.showMessage('error', err.error);
      }
    });
  }

  deleteUser(): void {
    this.userService.deleteUser(this.user()!.id).subscribe({
      next: (): void => {
        this.users.update(users => {
          return users.filter(user => user.id !== this.user()!.id);
        });

        this.closeForm();

        this.showMessage('message', 'User deleted successfully');
      },
      error: (err): void => {
        this.showMessage('error', err.error);
      }
    });
  }

  private showMessage(type: string, message: string) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.message = {
      hidden: false,
      type,
      message
    }

    this.timer = setTimeout(() => {
      this.message = {
        hidden: true,
        type: '',
        message: ''
      }
    }, 3000);
  }
}
