import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className='form__error-message'>
      {message}
    </p>
  );
};

export default ErrorMessage;
