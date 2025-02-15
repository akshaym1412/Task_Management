import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Home from "./pages/Home";

const App: React.FC = () => {


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
