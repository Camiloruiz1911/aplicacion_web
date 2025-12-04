import { Slot } from 'expo-router';
import React from 'react';
import { UserProvider } from '../src/api/UserContext';

export default function Layout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
