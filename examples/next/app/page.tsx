// A Server Component: Plume icons render on the server with no client JavaScript.
import { Search, Dashboard, Gear, Icon } from 'plume-icons/react';
import { iconNames } from 'plume-icons';
import { Toggle } from './toggle';

export default function Page() {
  return (
    <main>
      <h1>Plume Icons in Next.js</h1>
      <p id="server">
        <Search size={18} title="Search" /> <Dashboard variant="fill" /> <Dashboard variant="fill" /> <Gear strokeWidth={1.4} />
      </p>
      <Toggle />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12 }}>
        {iconNames.map((name) => (
          <div key={name} title={name}>
            <Icon name={name} /> <Icon name={name} variant="fill" />
          </div>
        ))}
      </div>
    </main>
  );
}
