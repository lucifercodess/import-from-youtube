import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ImportIcon, Save } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const DRAG_TYPE = "PLAYLIST";

const PlaylistItem = ({
  playlist,
  index,
  movePlaylist,
  onPlaylistClick,
  isSelected,
}) => {
  const [, ref] = useDrag({
    type: DRAG_TYPE,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: DRAG_TYPE,
    hover: (item) => {
      if (item.index !== index) {
        movePlaylist(item.index, index);
        item.index = index;
      }
    },
  });

  const getThumbnailUrl = (thumbnails) => {
    return thumbnails?.maxres?.url || 
           thumbnails?.medium?.url || 
           thumbnails?.default?.url || 
           'placeholder-image-url';
  };

  return (
    <div
      ref={(node) => drop(ref(node))}
      className={`rounded-lg cursor-pointer hover:scale-105 transition transform duration-200 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => onPlaylistClick(playlist.id)}
    >
      <img
        src={getThumbnailUrl(playlist.snippet.thumbnails)}
        alt={playlist.snippet.title}
        className="rounded-lg w-full h-40 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'fallback-image-url';
        }}
      />
      <h2 className="text-white text-lg font-medium mt-2">
        {playlist.snippet.title}
      </h2>
    </div>
  );
};

const VideoItem = ({ video }) => {
  const getThumbnailUrl = (thumbnails) => {
    return thumbnails?.maxres?.url || 
           thumbnails?.medium?.url || 
           thumbnails?.default?.url || 
           'placeholder-image-url';
  };

  return (
    <div className="rounded-lg p-4 bg-gray-800">
      <img
        src={getThumbnailUrl(video.snippet.thumbnails)}
        alt={video.snippet.title}
        className="rounded-lg w-full h-32 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'fallback-image-url';
        }}
      />
      <h3 className="text-white text-md font-medium mt-2">
        {video.snippet.title}
      </h3>
    </div>
  );
};

const PL = ({
  playlists,
  selectedPlaylistVideos,
  selectedPlaylistId,
  handlePlaylistClick,
}) => {
  const [cards, setCards] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(playlists)) {
      setCards(playlists);
    }
  }, [playlists]);

  const movePlaylist = (fromIndex, toIndex) => {
    const updatedPlaylists = [...cards];
    const [removed] = updatedPlaylists.splice(fromIndex, 1);
    updatedPlaylists.splice(toIndex, 0, removed);
    setCards(updatedPlaylists);
  };

  const handleSaveLayout = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const formattedLayout = cards.map((card, index) => ({
        id: card.id,
        position: index,
        snippet: {
          title: card.snippet.title,
          thumbnails: {
            maxres: { url: card.snippet.thumbnails?.maxres?.url },
            medium: { url: card.snippet.thumbnails?.medium?.url },
            default: { url: card.snippet.thumbnails?.default?.url }
          }
        }
      }));

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "http://localhost:3000/api/auth/save-layout",
        { layout: formattedLayout },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.code === 1) {
        toast({
          type: "success",
          title: "Layout saved successfully",
          duration: 3000,
        });
      } else {
        throw new Error(response.data.message || "Failed to save layout");
      }
    } catch (error) {
      console.error("Error saving layout:", error);
      toast({
        type: "error",
        title: "Failed to save layout",
        description: error.message || "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadLayout = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        "http://localhost:3000/api/auth/load-layout",
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.code === 1 && Array.isArray(response.data.layout)) {
        const sortedLayout = [...response.data.layout].sort(
          (a, b) => a.position - b.position
        );
        setCards(sortedLayout);
        toast({
          type: "success",
          title: "Layout loaded successfully",
          duration: 3000,
        });
      } else {
        throw new Error("Invalid layout data received");
      }
    } catch (error) {
      console.error("Error loading layout:", error);
      toast({
        type: "error",
        title: "Failed to load layout",
        description: error.message || "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 w-full">
      <div className="mb-10">
        <h1 className="text-white font-bold text-3xl">Your Playlists</h1>
      </div>

      <div className="flex flex-col gap-8">
        <section className="overflow-x-auto">
          <div className="flex gap-6 pb-4" style={{ minWidth: "min-content" }}>
            {cards && cards.length > 0 ? (
              cards.map((playlist, index) => (
                <div key={playlist.id} className="w-[300px] flex-shrink-0">
                  <PlaylistItem
                    playlist={playlist}
                    index={index}
                    movePlaylist={movePlaylist}
                    onPlaylistClick={handlePlaylistClick}
                    isSelected={playlist.id === selectedPlaylistId}
                  />
                </div>
              ))
            ) : (
              <p className="text-white text-center">
                No playlists found. Import your playlists using the button above.
              </p>
            )}
          </div>
        </section>

        {selectedPlaylistVideos && selectedPlaylistVideos.length > 0 && (
          <section className="w-full">
            <h2 className="text-white font-bold text-2xl mb-4">
              Playlist Videos
            </h2>
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ minWidth: "min-content" }}>
                {selectedPlaylistVideos.map((video) => (
                  <div key={video.id} className="w-[300px] flex-shrink-0">
                    <VideoItem video={video} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="flex gap-3 rounded-xl items-center font-bold mt-4">
        <button
          className="bg-green-600 rounded-xl p-2 px-4 text-white flex items-center gap-2 disabled:opacity-50"
          onClick={handleSaveLayout}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"} <Save className="w-4 h-4" />
        </button>
        <button
          className="bg-yellow-500 rounded-xl p-2 px-4 text-white flex items-center gap-2 disabled:opacity-50"
          onClick={handleLoadLayout}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load"} <ImportIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PL;