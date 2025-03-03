 
import 'react';

declare module 'react' {
  interface HTMLAttributes<T extends HTMLElement> {
    'data-testid'?: T extends HTMLElement ? string : never;
  }
  
  interface LabelHTMLAttributes<T extends HTMLLabelElement> {
    'data-testid'?: T extends HTMLLabelElement ? string : never;
  }
  
  interface TextareaHTMLAttributes<T extends HTMLTextAreaElement> {
    'data-testid'?: T extends HTMLTextAreaElement ? string : never;
  }
  
  // Add for other element types as needed
  interface InputHTMLAttributes<T extends HTMLInputElement> {
    'data-testid'?: T extends HTMLInputElement ? string : never;
  }
  
  interface ButtonHTMLAttributes<T extends HTMLButtonElement> {
    'data-testid'?: T extends HTMLButtonElement ? string : never;
  }
}

// This is a special comment to force ESLint to ignore this file
 