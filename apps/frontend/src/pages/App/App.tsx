import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div style={{ padding: '40px 0' }}>
      <Outlet />
    </div>
  );
}

export default App;
