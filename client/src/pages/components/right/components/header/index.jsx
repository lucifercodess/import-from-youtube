import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImportIcon } from "lucide-react";
import { MdArrowDropDown } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlaylist } from "@/context/PlaylistContext";
import PL from "../playlist-container";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const { playlists, setPlaylists } = usePlaylist();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaylistVideos, setSelectedPlaylistVideos] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const navigate = useNavigate();

  const initiateOAuth = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const redirectUri = encodeURIComponent("http://localhost:5173");
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/youtube.readonly"
    );

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=token` +
      `&scope=${scope}` +
      `&include_granted_scopes=true` +
      `&state=pass-through-value`;

    window.location.href = authUrl;
  };

  // note for me check the redirectUri 
  
  const getAccessTokenFromHash = () => {
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      return params.get("access_token");
    }
    return null;
  };

  const fetchUserPlaylists = async () => {
    let accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      accessToken = getAccessTokenFromHash();
      if (accessToken) {
        sessionStorage.setItem("accessToken", accessToken);
        window.history.replaceState({}, document.title, "http://localhost:5173");
      } else {
        console.error("No access token available");
        toast({
          type: "error",
          title: "Authentication error",
          description: "Please try logging in again",
          duration: 5000,
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data.items)) {
        setPlaylists(data.items);
        console.log("Fetched playlists:", data.items);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast({
        type: "error",
        title: "Error fetching playlists",
        description: error.message,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlaylistVideos = async (playlistId) => {
    const accessToken =
      sessionStorage.getItem("accessToken") || getAccessTokenFromHash();

    if (!accessToken) {
      console.error("No access token available");
      return;
    }

    setIsLoading(true);
    setSelectedPlaylistId(playlistId);
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched videos:", data);
      if (Array.isArray(data.items)) {
        setSelectedPlaylistVideos(data.items);
      }
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
      toast({
        type: "error",
        title: "Error fetching videos",
        description: error.message,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = getAccessTokenFromHash();
    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
      window.history.replaceState({}, document.title, "http://localhost:5173");
      fetchUserPlaylists();
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        toast({
          type: "success",
          title: "Logged out successfully",
          duration: 5000,
        });
        navigate("/auth");

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.removeItem("accessToken");
      }
    } catch (error) {
      toast({
        type: "error",
        title: error.response?.data?.message || "Error logging out",
        duration: 5000,
      });
    }
  };

  return (
    <div className="bg-[#27272F] min-h-screen my-5 mt-3 mb-10 py-8 px-6 rounded-2xl shadow-lg flex flex-col w-full max-w-7xl mx-auto items-center">
      <header className="flex justify-between items-center w-full">
        <h1 className="text-white text-2xl font-bold hidden sm:block mr-10">
          YouTube Playlists
        </h1>
        <div className="flex items-center gap-6">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none hidden sm:block"
          />
          <Button
            onClick={initiateOAuth}
            disabled={isLoading}
            className="px-5 py-3 text-white flex items-center bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            <p className="hidden sm:block">
              {isLoading ? "Loading..." : "Import from YouTube"}
            </p>
            <ImportIcon className="ml-2" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-white hidden sm:block">Ayush Dubey</span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MdArrowDropDown className="text-white text-lg" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      {isLoading ? (
        <div className="text-white text-center mt-20">Loading...</div>
      ) : (
        <PL
          playlists={playlists}
          selectedPlaylistVideos={selectedPlaylistVideos}
          selectedPlaylistId={selectedPlaylistId}
          handlePlaylistClick={fetchPlaylistVideos}
        />
      )}
    </div>
  );
};

export default Header;
