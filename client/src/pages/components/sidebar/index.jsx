import Logo from "../../../assets/logo.png";
import Revenue from "../../../assets/increase.png";
import Story from "../../../assets/writing.png";
import Gallery from "../../../assets/gallery.png";
import picture from "../../../assets/picture.png";
import Video from "../../../assets/video-camera.png";
import Tap from "../../../assets/tap.png";
import Setting from "../../../assets/setting.png";
import { useState } from "react";
const Sidebar = () => {
  const [isSelected, setIsSelected] = useState(null);
  const sidebarItems = [
    {
      title: "Revenue",
      logo: Revenue,
    },
    {
      title: "Story",
      logo: Story,
    },
    {
      title: "Gallery",
      logo: picture,
    },
    {
      title: "Video",
      logo: Video,
    },
    {
      title: "Playlist Manager",
      logo: picture,
    },
    {
      title: "One Click Post",
      logo: Tap,
    },
    {
      title: "Hire Influencer",
      logo: Setting,
    },
  ];
  return (
    <div className="h-[calc(100vh-20px)] bg-[#27272F] mx-5 fixed top-3 w-[100px] sm:w-[250px] rounded-lg">
      <div className="top-[20px] left-[30px] my-7 mx-7 hidden sm:block">
        <img src={Logo} alt="" className="w-[90px] h-[30px]" />
      </div>
      <div className="mt-10 text-gray-500 font-semibold">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => setIsSelected(item.title)}
            className={`py-3 px-3 hover:rounded-xl cursor-pointer hover:bg-[#333338] hover:text-[#ffffff] flex items-center my-6 mx-7 transition-all duration-200 ease-in-out ${
              isSelected === item.title ? "bg-[#333338] text-[#ffffff] rounded-xl" : ""
            }`}
          >
            <img src={item.logo} alt="" className="w-[20px] h-[20px] mr-3" />
           <p className="hidden sm:block"> {item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
