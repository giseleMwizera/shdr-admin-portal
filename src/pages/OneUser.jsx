import React from "react";
import { useEffect, useState } from "react";
import { fetchOneUser } from "../services/user.service";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import { FadeLoader } from "react-spinners";
import { fireUser } from "../services/user.service";
import clsx from "clsx";
import Error from "../components/Error";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";

const OneUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isUserFired = user && user.status === "FIRED";
  const handleFireUser =async (id) => {
      try {
      const user = await fireUser(id, {status: "FIRED"});
      
        toast.success("Successfully fired user");
        
        navigate(`/users`);
      
    } catch (error) {
        console.log(error);
      toast.error("Error firing user");
    }
  }
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (id) {
          const result = await fetchOneUser(id);
          setUser(result);
          setLoading(false);
          console.log(result);
        }
      } catch (error) {
        toast.error("Error Getting  Info about User");
      }
    };
    fetchUsers();
  }, []);
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-5">
      <Helmet>
        <title>SHDR | </title>
      </Helmet>
      <div className="p-3">
        <div className="my-2">
          <div className="p-3 my-2">
            <TopBar title="Users">
              <button
                onClick={handleFireUser}
                className={clsx(
                  "flex gap-2 items-center px-4 py-2 rounded-lg",
                  {
                    "bg-red-500": !isUserFired,
                    "bg-gray-300 cursor-not-allowed": isUserFired,
                  }
                )}
                disabled={isUserFired}
              >
                <p
                  className={clsx("text-white font-semibold", {
                    "text-gray-400": isUserFired,
                  })}
                >
                  Fire User
                </p>
              </button>
            </TopBar>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <FadeLoader color="gray" />
            </div>
          ) : (
            <div>
              {user?.projects.length === 0 ? (
                <Error name="projects for this user" />
              ) : (
                <div
                  className={clsx(
                    "mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 h-fit",
                    `grid-rows-${Math.floor(user?.projects?.length / 4)}`
                  )}
                >
                  {user?.projects.map((project) => (
                    <Link
                      to={`/plans/${project._id}`}
                      key={project._id}
                      className="border-2 rounded-lg   shadow-md"
                    >
                      <img
                        src={project.images[0]}
                        alt={project._id}
                        className="w-full object-cover mb-2 rounded-t-lg"
                      />
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold ">
                            {project.name}
                          </p>
                          <p></p>
                        </div>
                        <p className=" font-semibold  text-xs text-[#898989]">
                          ${project.planPrice.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OneUser;
