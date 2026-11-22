'use client';
// A Client Component: the same icons, switching between line and fill on click.
import { useState } from 'react';
import { Bell } from 'plume-icons/react';

export function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button id="client" type="button" onClick={() => setOn(!on)} aria-pressed={on} style={{ color: 'inherit', background: 'none', border: '1px solid #444', borderRadius: 8, padding: 8 }}>
      <Bell variant={on ? 'fill' : 'line'} size={20} /> Notifications
    </button>
  );
}
