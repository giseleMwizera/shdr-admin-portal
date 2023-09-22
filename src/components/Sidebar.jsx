import React from "react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../config/axios";
import { BiSolidDashboard } from "react-icons/bi";
import { MdNotifications } from "react-icons/md";
import {FaRegUser} from "react-icons/fa"
import { RiGalleryLine } from "react-icons/ri";
import { GiHouse } from "react-icons/gi";
import {BiLogOut} from "react-icons/bi"

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = async () => {
    await localStorage.removeItem("uid");
    navigate("/login");
  };
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const id = await localStorage.getItem("uid");
      api
        .get(`/users/${id}`)
        .then((res) => {
          setUser(res.data.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchCurrentUser();
  });
  return (
    <div className="bg-[#BCD4E6]  w-[80px] transition-all duration-500 lg:w-[20%] border-r-[#E5E4E2]   h-screen overflow-hidden  flex flex-col  justify-center items-center ">
      <div className="flex flex-col justify-between h-[95vh] w-[80%] ">
        <div className="flex flex-col gap-2  justify-center align-center ">
          <div className="flex gap-2 justify-center items-center">
            <img
              src="/images/logo.png"
              alt="Logo"
              className=" sm:w-[60%] sm:h-[80%]"
            />
            <p className="hidden lg:block text-2xl font-bold"></p>
          </div>

          <div className="flex flex-col justify-between gap-2 my-12 sm:my-2 h-[30vh] ">
            <Link
              to={"/"}
              className={clsx(
                "flex items-center gap-2 hover:bg-[#4682B4] p-2 sm:px-4  transition-all duration-150 sm:py-2 rounded-sm",
                location.pathname === "/" && "bg-[#36454F] text-white"
              )}
            >
              <BiSolidDashboard className="w-20 w-20 sm:w-5 sm:h-5" />

              <p className="hidden lg:block font-medium  pl-4">Analytics</p>
            </Link>
            <Link
              to={"/notifications"}
              className={clsx(
                "flex items-center gap-2 hover:bg-[#4682B4] px-4  transition-all duration-150 py-2",
                location.pathname === "/notifications" &&
                  "bg-[#36454F] text-white"
              )}
            >
              <MdNotifications className="w-20 w-20 sm:w-5 sm:h-5" />

              <p className="hidden lg:block font-medium  pl-4">Notifications</p>
            </Link>
            <Link
              to={"/plans"}
              className={clsx(
                "   flex items-center gap-2 hover:bg-[#4682B4] px-4  transition-all duration-150 py-2 ",
                location.pathname.includes("/plans") && "bg-[#36454F] text-white"
              )}
            >
              <GiHouse className="w-20 w-20 sm:w-5 sm:h-5" />
              <p className="hidden lg:block font-medium  pl-4">Plans</p>
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                to={"/users"}
                className={clsx(
                  "flex items-center gap-2 hover:bg-[#4682B4] px-4  transition-all duration-150 py-2",
                  location.pathname.includes("/users") && "bg-[#36454F] text-white"
                )}
              >
                <FaRegUser className="w-20 w-20 sm:w-5 sm:h-5" />
                <p className="hidden lg:block font-medium pl-4 ">
                  User Profiles
                </p>
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <Link
                to={"/gallery"}
                className={clsx(
                  "flex items-center gap-2 hover:bg-[#4682B4] px-4  transition-all duration-150 py-2 ",
                  location.pathname.includes("/gallery") && "bg-[#36454F] text-white"
                )}
              >
                <RiGalleryLine className="w-20 w-20 sm:w-5 sm:h-5" />
                <p className="hidden lg:block font-medium  pl-4">Gallery</p>
              </Link>
            )}
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 hover:bg-[#4682B4] px-4 py-2 "
        >
          <BiLogOut className="w-20 w-20 sm:w-5 sm:h-5" />
          <p className="hidden lg:block font-medium ">Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
