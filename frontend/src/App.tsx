import { SessionProvider } from './context/SessionProvider';

/**
 * App — Root component, wraps application with session context provider.
 *
 * Full routing and ErrorBoundary wiring in task 8.4.
 */
function App() {
  return (
    <SessionProvider>
      <div>
        <h1>Music Group App</h1>
      </div>
    </SessionProvider>
  );
}

export default App;
