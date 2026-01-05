import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import AllFoods from "../pages/AllFoods";
import AboutUs from "../pages/AboutUs";
import DashboardHome from "../dashboard/DashboardComponents/DashboardHome";
import Error from "../pages/Error";
import DashboardLayout from "../dashboard/DashboardLayout";
import MyDishes from "../dashboard/DashboardComponents/MyDishes";
import AddDish from "../dashboard/DashboardComponents/AddDish";
import Profile from "../dashboard/DashboardComponents/Profile";
import Orders from "../dashboard/DashboardComponents/Orders";
import MyOrders from "../dashboard/DashboardComponents/MyOrders";
import Community from "../dashboard/DashboardComponents/Community";
import CooksReview from "../dashboard/DashboardComponents/CooksReview";



export const routes = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <Error />,

    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/all-foods",
        Component: AllFoods,
      },
      {
        path: "/about",
        Component: AboutUs,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/signup",
        Component: SignUp,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "/dashboard/my-dishes",
        Component: MyDishes,
      },
      {
        path: "/dashboard/add-dish",
        Component: AddDish,
      },
      {
        path: "/dashboard/orders",
        Component: Orders,
      },
      {
        path: "/dashboard/my-orders",
        Component: MyOrders,
      },
      {
        path: "/dashboard/community",
        Component: Community,
      },
      {
        path: "/dashboard/profile",
        Component: Profile,
      },
      {
        path: "/dashboard/cooksreview",
        Component: CooksReview,
      },
    ],
  },
]);
