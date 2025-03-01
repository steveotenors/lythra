import React from 'react';
import { Alert, AlertTitle, AlertDescription } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
};

export default meta;

export const Default = () => (
  <Alert>
    <AlertTitle>Default Alert</AlertTitle>
    <AlertDescription>
      This is a default alert message that provides information.
    </AlertDescription>
  </Alert>
);

export const Destructive = () => (
  <Alert variant="destructive">
    <AlertTitle>Error Alert</AlertTitle>
    <AlertDescription>
      Something went wrong! Please try again later.
    </AlertDescription>
  </Alert>
);

export const WithoutTitle = () => (
  <Alert>
    <AlertDescription>
      This is an alert with only a description.
    </AlertDescription>
  </Alert>
);

export const DestructiveWithoutTitle = () => (
  <Alert variant="destructive">
    <AlertDescription>
      Error: Something went wrong!
    </AlertDescription>
  </Alert>
); 