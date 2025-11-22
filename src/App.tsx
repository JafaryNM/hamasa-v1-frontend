import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Client from "@/pages/Client/Clients";
import ProjectCategories from "@/pages/ProjectCategories/ProjectCategories";
import MediaCategories from "@/pages/MediaCategories/MediaCategories";
import Media from "@/pages/Media/Media";
import Projects from "@/pages/Project/Projects";
import AddProject from "@/pages/Project/AddProject";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/dashboard" element={<Home />} />
            <Route index path="/system/system-clients" element={<Client />} />
            <Route
              index
              path="/system/system-project-categories"
              element={<ProjectCategories />}
            />
            <Route
              index
              path="/system/system-project-categories"
              element={<ProjectCategories />}
            />
            <Route
              index
              path="/system/system-media-categories"
              element={<MediaCategories />}
            />
            <Route
              index
              path="/system/system-media-categories"
              element={<MediaCategories />}
            />
            <Route index path="/system/system-medias" element={<Media />} />
            <Route index path="/projects" element={<Projects />} />
            <Route path="/addproject" element={<AddProject />} />
          </Route>
        </Route>

        {/* Auth Layout */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
