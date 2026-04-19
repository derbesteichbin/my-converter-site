import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CommandPalette from './components/CommandPalette.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <CommandPalette />
      <Outlet />
    </>
  );
}
