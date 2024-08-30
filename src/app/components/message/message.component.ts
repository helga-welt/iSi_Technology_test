import { Component, input, InputSignal } from '@angular/core';
import { NgClass } from '@angular/common'

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  type: InputSignal<string> = input.required<string>();
  message: InputSignal<string> = input.required<string>();
}
