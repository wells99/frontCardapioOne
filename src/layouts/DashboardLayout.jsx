import { Outlet } from "react-router";
import Header from "../components/Header";

const DashboardLayout = () => {
    return (
      <>
          <div className="h-screen flex">
            <Header />
            <div className="flex-1 bg-green-200 h-screen overflow-auto p-4 lg:p-[60px]">
                <Outlet />
            </div>
        </div>
      </>
    );
}

export default DashboardLayout;