import {
  Component,
  input,
  InputSignal, output, OutputEmitterRef,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IUser } from '../../../../interfaces/user.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    MatTableModule,
    NgClass,
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})
export class UsersTableComponent {
  users: InputSignal<IUser[]> = input.required<IUser[]>();
  selectedUserId: InputSignal<number | undefined> = input<number>();
  selectUser: OutputEmitterRef<number> = output<number>();
  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'type'];

  emitSelectedUser(userId: number): void {
    if (userId !== this.selectedUserId()) {
      this.selectUser.emit(userId)
    }
  }
}
