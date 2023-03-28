import { Validators } from '@angular/forms';

export const validatorsPattern = {
  email: Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
};