import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { fetchAllProjects } from "../services/project.service";
import { FadeLoader } from "react-spinners";
import { api } from "../config/axios";
import Error from "../components/Error";
import TopBar from "../components/TopBar";
import { IoIosAddCircle } from "react-icons/io";

const Plan = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await fetchAllProjects();
        if (Array.isArray(result)) {
          setProjects(result);
          setCurrentProject(result[0]);
          setLoading(false);
        }
      } catch (error) {
        toast.error("Error Getting All Projects");
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
          fetchCurrentUser();
        });
    };
    fetchCurrentUser();
  });

 

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-5">
      <Helmet>
        <title>SHDR | Plan</title>
      </Helmet>
      <div className="my-2">
        <div className="p-3 my-2">
          <TopBar title="Plans">
            <Link to={"/plans/create"} className="flex gap-2 items-center">
             <IoIosAddCircle className="h-8 w-8"/>
              <p className="hidden md:block text-[#555555] font-semibold">Add Plan</p>
            </Link>
          </TopBar>
        </div>
      </div>
      {loading ? (
        <div className="w-full h-[400px] flex items-center justify-center sm:pl-8 mt-12">
          <FadeLoader color="gray" />
        </div>
      ) : (
        <div className="sm:pl-8 mt-12">
          {user?.role != "ADMIN" ? (
            <div className="">
              {projects.filter((p) => p.uploadedBy._id == user?._id)?.length ===
              0 ? (
                <Error name="plans" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-4 gap-5 mt-4">
                  {projects
                    ?.filter((p) => p.uploadedBy._id == user?._id)
                    .map((project) => {
                      return (
                        <Link
                          to={`/plans/${project._id}`}
                          key={project._id}
                          className="border-2 rounded-lg shadow-md"
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
                      );
                    })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {projects?.length === 0 ? (
                <Error name="plans" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[40vh] gap-5 mt-4 ml-4">
                  {projects?.map((project) => {
                    return (
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
                          <div className="flex flex-col sm:flex-row  h-[5vh]  justify-between sm:items-center mb-3">
                            <p className="text-sm font-semibold ">
                              {project.name}
                            </p>
                          
                            <p
                              className={clsx(
                                "text-[12px] font-semibold",
                                project.stage === "COMPLETE" &&
                                  "text-[#3DDF05]",
                                project.stage === "CONSTRUCTION" &&
                                  "text-[#9760ff]",
                                project.stage === "DESIGN" && "text-[#1371ff]",
                                project.stage === "ON HOLD" && "text-[#FFC0CB]"
                              )}
                            >
                              &bull; {project.stage}
                            </p>
                          </div>
                          <p className="text-xs text-right  text-[#BFBEBE] ">
                            Uploaded by{" "}
                            {project.uploadedBy._id === user._id
                              ? "You"
                              : project.uploadedBy.fullName}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Plan;
