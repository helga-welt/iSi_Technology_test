import { Directive, ElementRef, inject, Input, OnChanges } from '@angular/core';
import { ValidationErrors } from "@angular/forms";
import { ERROR_MESSAGES } from "../shared/validation-error-messages";

@Directive({
  selector: '[appValidationError]',
  standalone: true
})
export class ValidationErrorDirective implements OnChanges {
  private elementRef = inject(ElementRef);
  private defaultErrorMessages = ERROR_MESSAGES;

  @Input('appValidationError') errors!: ValidationErrors | null | undefined;

  ngOnChanges() {
    this.updateErrorMessage()
  }

  private updateErrorMessage() {
    this.elementRef.nativeElement.textContent = this.generateErrorMessage();
  }

  private generateErrorMessage() {
    if (!this.errors) return '';

    return Object.entries(this.errors)
    .map(([key, value]) => {
      return this.getErrorMessage(key, value);
    })
      .join('. ');
  }

  private getErrorMessage(key: string, value: any): string {
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }

    return this.defaultErrorMessages[key]  || this.defaultErrorMessages['unknown'];
  }
}
