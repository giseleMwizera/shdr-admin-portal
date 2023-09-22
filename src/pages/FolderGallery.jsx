import React from "react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { fetchOneFolder } from "../services/gallery.service";
import { FadeLoader } from "react-spinners";
import Error from "../components/Error";
import TopBar from "../components/TopBar";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";

const FolderGallery = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState();
  useEffect(() => {
    const fetchFolder = async () => {
      try {
        if (id) {
          const result = await fetchOneFolder(id);
          
            setFolder(result);
            setLoading(false);
          
        }
      } catch (error) {
        console.error("Error getting the folder Data:");
      }
    };
    fetchFolder();
  }, []);
  const Tab1 = () => {
    return (
      <div>
        {folder?.images?.length === 0 ? (
          <Error name="images" />
        ) : (
          <div className=" flex flex-col sm:grid grid-cols-3 gap-5 p-5">
            {folder?.images?.map((image, index) => {
              return <img src={image} alt="" key={index} />;
            })}
          </div>
        )}
      </div>
    );
  };
  const Tab2 = () => {
    return (
      <div>
        {folder?.videos?.length === 0 ? (
          <Error name="videos" />
        ) : (
          <div className="flex flex-col sm:grid grid-cols-3 gap-5 p-5">
            {folder?.videos?.map((videoUrl, index) => {
              return (
                <video controls key={index}>
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              );
            })}
          </div>
        )}
      </div>
    );
  };


const Tab3 = () => {
  return (
    <div>
      {folder?.documents?.length === 0 ? (
        <Error name="documents" />
      ) : (
        <div className="flex flex-col sm:grid grid-cols-3 gap-5 p-5">
          {folder?.documents?.map((documentUrl, index) => {
            return (
              <a href={documentUrl} key={index} download>
                <div className="border border-gray-300 p-2 cursor-pointer">
                  
                  <span className="text-gray-700">{`Document ${index + 1}`}</span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};




  const tabs = [Tab1, Tab2, Tab3];
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-5">
      <Helmet>
        <title>SHDR | {loading ? "Gallery" : `${folder?.name}`}</title>
      </Helmet>
      <div>
        {loading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <FadeLoader color="gray" />
          </div>
        ) : (
          <div>
            {folder ? (
              <div>
                <div className="my-2">
                  <div className="p-3 my-2">
                    <TopBar title={folder?.name}>
                      <Link
                        // to={"/plans/create"}
                        className="flex gap-2 items-center"
                      >
                        <IoIosAddCircle className="h-8 w-8" />
                        <div className="hidden lg:block font-semibold">
                          {activeTab === 0 ? (
                            <button className="text-black">Add Image</button>
                          ) : activeTab === 1 ? (
                            <button className="text-black">Add Video</button>
                          ) : (
                            <button className="text-black">
                              Add Documents
                            </button>
                          )}
                        </div>
                      </Link>
                    </TopBar>
                  </div>
                </div>
               
                <div className="items-center flex justify-center gap-3 pt-12">
                  <button
                    onClick={() => setActiveTab(0)}
                    className={clsx(
                      activeTab === 0 ? " text-[#0000AD]" : "text-black"
                    )}
                  >
                    Images
                  </button>
                  <button
                    onClick={() => setActiveTab(1)}
                    className={clsx(
                      activeTab === 1 ? " text-[#0000AD]" : "text-black"
                    )}
                  >
                    Videos
                  </button>
                  <button
                    onClick={() => setActiveTab(2)}
                    className={clsx(
                      activeTab === 2 ? " text-[#0000AD]" : "text-black"
                    )}
                  >
                    Documents
                  </button>
                </div>
                <div>{tabs[activeTab]()}</div>
              </div>
            ) : (
              <div>
                <p>Error getting info related to the folder</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderGallery;
