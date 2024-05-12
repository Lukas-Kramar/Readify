import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ManageBooks from './views/admin/ManageBooks';
import Layout from './components/layout/Layout ';
import Dashboard from './views/dashboard/Dashboard';
import ReadingListDetail from './views/reading-list-detail/ReadingListDetail';
import ManageBookGenres from './views/admin/ManageBookGenres';
import NotFoundPage from './views/not-found/NotFound';
import Explore from './views/explore/Explore';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="/admin/manage-books" element={<ManageBooks />} />
          <Route path="/admin/manage-book-genres" element={<ManageBookGenres />} />

          <Route path="/reading-list-detail" element={<ReadingListDetail />} />
          <Route path="/explore" element={<Explore />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
