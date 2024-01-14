import React from 'react';
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getStatus(expiryDate) {
  switch (expiryDate) {
    case expiryDate < Date.now():
      return 'active';
    case expiryDate - Date.now() > 0 && expiryDate - Date.now() < 2629746000:
      return 'expiring';
    case expiryDate > Date.now():
      return 'expired';
    default:
      return 'active';
  }
}
