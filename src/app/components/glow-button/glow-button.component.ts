import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-glow-button',
  standalone: true,
  imports: [],
  templateUrl: './glow-button.component.html',
  styles: ``,
})
export class GlowButtonComponent {
  color$ = input.required<'green' | 'yellow' | 'red'>();
  active$ = input.required<boolean>();

  colors$ = computed(() => {
    switch (this.color$()) {
      case 'green': {
        return {
          container: '#A6F3A6',
          inner: this.active$()
            ? 'radial-gradient(circle,rgba(0,0,0,.15) 0,#4AF94A 100%)'
            : 'radial-gradient(circle,rgba(0,0,0,.55) 0,rgba(0,0,0,.95) 100%)',
          border: '#16a34a',
        };
      }
      case 'yellow': {
        return {
          container: '#F3F3A6',
          inner: this.active$()
            ? 'radial-gradient(circle,rgba(0,0,0,.15) 0,#4AF94A 100%)'
            : 'radial-gradient(circle,rgba(0,0,0,.55) 0,rgba(0,0,0,.95) 100%)',
          border: '#16a34a',
        };
      }
      case 'red': {
        return {
          container: '#F3A6A6',
          inner: this.active$()
            ? 'radial-gradient(circle,rgba(0,0,0,.15) 0,#4AF94A 100%)'
            : 'radial-gradient(circle,rgba(0,0,0,.55) 0,rgba(0,0,0,.95) 100%)',
          border: '#16a34a',
        };
      }
      default: {
        return {
          container: '#A6F3A6',
          inner: this.active$()
            ? 'radial-gradient(circle,rgba(0,0,0,.15) 0,#4AF94A 100%)'
            : 'radial-gradient(circle,rgba(0,0,0,.55) 0,rgba(0,0,0,.95) 100%)',
          border: '#16a34a',
        };
      }
    }
  });
}
