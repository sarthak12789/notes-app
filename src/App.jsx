import './App.css';
import Navbar from './components/header';
import { BookIconComponent } from './components/addicon';

function App() {
  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Create Icon positioned 20px below navbar */}
      <div className="create-icon-container">
        <BookIconComponent />
      </div>
    </div>
  );
}

export default App;
