"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Image from "next/image";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { RiShareForwardLine } from "react-icons/ri";
import Loading from "../loading";
import TimeAgo from "javascript-time-ago";
import NewDiscussion from "@/app/(components)/NewDiscussion"
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import ReactTimeAgo from "react-time-ago";
import {useSession} from "@/app/(components)/SessionProvider"
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
const DiscussionDetails = ({ params }) => {
  const router = useRouter()
  const {session}=useSession();
  const { id } = params;
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animationState, setAnimationState] = useState({});
  const [status, setStatus] = useState("");
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [isDislikedByUser, setIsDislikedByUser] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteDiscussionId, setDeleteDiscussionId] = useState('');
  const handleDelete = async () => {
    try {
      console.log(deleteDiscussionId);
      // Call your delete API here
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/mydiscussion?id=${deleteDiscussionId}`,
        {
          method: "DELETE",
        }
      );
      console.log(res);
      const data = await res.json();
      console.log(data.status,data);
      if(res.ok){
        toast.success("delete successfully",{
          autoClose: 4000,
          closeOnClick: true,

        }) 
        router.push('/mydiscussion');
      }
     
      // Handle post-deletion logic, like refreshing the list or navigating away
    } catch (error) {
      console.error('Failed to delete discussion:', error);
      toast.error(error.message,{
        autoClose: 4000,
        closeOnClick: true,

      })
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const handleGetDiscussionId = (id) => {
    console.log("myid", id);
    setShowConfirmDelete(true);
    setDeleteDiscussionId(id);

  }
  const handleEditClick = (discussion) => {
    setSelectedDiscussion(discussion);
  };

  const handleSave = () => {
    setSelectedDiscussion(null);
    // Refresh the list of discussions or handle post-save logic
  };
  useEffect(() => {
    console.log(session.db_id)
    if (id) {
      const fetchDiscussion = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${id}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        console.log(data.discussion.creator._id);
        setDiscussion(data.discussion);
        setStatus(data.status);
        setIsLikedByUser(data.isLikedByUser);
        setIsDislikedByUser(data.isDislikedByUser);
        setLoading(false);
      };

      fetchDiscussion();
    }
  }, [id]);

  const toggleLike = async (discussionId) => {
    setAnimationState((prev) => ({ ...prev, [discussionId]: "like" }));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${discussionId}/like`,
      { method: "PUT" }
    );

    if (response.ok) {
      setDiscussion((prevDiscussion) => ({
        ...prevDiscussion,
        likes: isLikedByUser
          ? prevDiscussion.likes - 1
          : prevDiscussion.likes + 1,

        dislikes: isDislikedByUser
          ? prevDiscussion.dislikes - 1
          : prevDiscussion.dislikes,
      }));
      setIsLikedByUser(!isLikedByUser);
      if (isDislikedByUser) {
        setIsDislikedByUser(false);
      }
    } else {
      toast.error("Action failed due to server error");
    }

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [discussionId]: null }));
    }, 300);
  };

  const toggleDislike = async (discussionId) => {
    setAnimationState((prev) => ({ ...prev, [discussionId]: "dislike" }));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/discussion/${discussionId}/dislike`,
      { method: "PUT" }
    );

    if (response.ok) {
      setDiscussion((prevDiscussion) => ({
        ...prevDiscussion,
        dislikes: isDislikedByUser
          ? prevDiscussion.dislikes - 1
          : prevDiscussion.dislikes + 1,

        likes: isLikedByUser ? prevDiscussion.likes - 1 : prevDiscussion.likes,
      }));
      setIsDislikedByUser(!isDislikedByUser);
      if (isLikedByUser) {
        setIsLikedByUser(false);
      }
    } else {
      toast.error("Action failed due to server error");
    }

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, [discussionId]: null }));
    }, 300);
  };

  const handleButtonClick = async (discussion) => {
    try {
      const toastId = toast.loading("Sending request...");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/join-group?discussionId=${discussion._id}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        toast.update(toastId, {
          render: "Error sending request",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        throw new Error("Error sending request");
      }

      const r = await res.json();
      toast.update(toastId, {
        render: r.message,
        type: r.status === 200 ? "success" : "error",
        isLoading: false,
        autoClose: 5000,
      });

      setStatus(r.status === 200 ? "pending" : "");
    } catch (error) {
      console.error(error);
      toast.error("Error sending request");
    }
  };

  const handleShare = (discussion) => {
    if (navigator.share) {
      navigator
        .share({
          title: discussion.title,
          text: discussion.content,
          url: `${window.location.origin}/discussions/${discussion._id}`,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/discussions/${discussion._id}`
      );
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!discussion) {
    return <div>Discussion not found</div>;
  }

  const handleClickOutside = (event) => {
    if (event.target.classList.contains("fixed")) {
      setSelectedDiscussion(null);
    }
  };
  

  return (
    <>

      <div className={`container mx-auto p-4 ${showConfirmDelete ? 'blur-md' : ''}`}>
        {discussion.coverImage !== "" ? (
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="flex justify-between py-1 px-2 shadow-sm rounded-md md:py-[10px] md:px-4">
              <div className="flex items-center gap-2 rounded-md">
                <Image
                  alt="Avatar"
                  className="w-10 h-10 rounded-full md:w-[54px] md:h-[54px]"
                  height="48"
                  src={discussion.creator.profilePic}
                  style={{ aspectRatio: "54/54", objectFit: "cover" }}
                  width="54"
                />
                <span className="text-gray-500 dark:text-gray-400">
                  {discussion.creator.name}
                </span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <span>
                  <ReactTimeAgo date={new Date(discussion.createdAt)} locale="en-US" />
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6 mt-3 md:flex-row">
              <Image
                alt="Cover"
                className="w-full"
                src={discussion.coverImage}
                style={{ aspectRatio: "1", objectFit: "cover" }}
                width={390}
                height={150}
              />

              <div className="relative flex flex-col items-start justify-between bg-white rounded-lg dark:bg-gray-800">
             
                <div className="flex-col gap-2 md:gap-5">
               
                  
                  {session?.db_id==discussion.creator._id &&(
                    <div className="flex justify-around m-3">
                    <button onClick={() => handleEditClick(discussion)} className="p-3 bg-slate-100 border-2 rounded-lg">
                      <EditIcon className="w-6 h-6" />
                    </button>
                    <button className="p-3 bg-slate-100 border-2 rounded-lg" onClick={() => handleGetDiscussionId(discussion._id)}>
                      <DeleteIcon className="w-6 h-6" />
                    </button>
                    </div>
                   )}
                 
                
                   <h4 className="mt-4 text-base font-semibold">{discussion.title}</h4>
                  <div className="prose max-w-none">
                    <p>{discussion.content}</p>
                  </div>
               </div>
                
                  
             
                 <div className="grid w-full gap-4 md:gap-8 grid-cols-4">
                  <Button className="h-10" size="icon" variant="icon">
                    <ThumbsUpIcon
                      className={`w-4 h-4 cursor-pointer ${isLikedByUser && "text-blue-400"} ${animationState[discussion._id] === "like" && "pop text-blue-400"}`}
                      onClick={() => toggleLike(discussion._id)}
                    />
                    <span className="sr-only">Like</span>
                    <span className="ml-2">{discussion.likes}</span>
                  </Button>
                  <Button className="h-10" size="icon" variant="icon">
                    <ThumbsDownIcon
                      className={`w-4 h-4 cursor-pointer ${isDislikedByUser && "text-red-400"} ${animationState[discussion._id] === "dislike" && "pop text-red-400"}`}
                      onClick={() => toggleDislike(discussion._id)}
                    />
                    <span className="sr-only">Dislike</span>
                    <span className="ml-2">{discussion.dislikes}</span>
                  </Button>
                  <Button className="w-24" variant="secondary" disabled={status === "accepted" || status === "pending"} onClick={() => handleButtonClick(discussion)}>
                    {status === "accepted" ? "Member" : status === "pending" ? "Requested" : "Join"}
                  </Button>
                  <Button className="h-10" size="icon" variant="icon" onClick={() => handleShare(discussion)}>
                    <RiShareForwardLine className="w-5 h-5 cursor-pointer text-gray-800" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto p-4">
            <div className="flex items-start gap-4 p-2 bg-white dark:bg-gray-800 md:p-4">
              <Image
                alt="Avatar"
                className="w-12 h-12 rounded-full md:w-[54px] md:h-[54px]"
                height="48"
                src={discussion.creator.profilePic}
                style={{ aspectRatio: "48/48", objectFit: "cover" }}
                width="48"
              />
              <div className="flex-1 grid gap-2">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {discussion.creator.name}
                    </span>
                    <h4 className="text-base font-semibold">
                      {discussion.title}
                    </h4>
                  </div>
                  {session?.db_id==discussion.creator._id &&(
                    <div className="flex justify-between">
                    <button onClick={() => handleEditClick(discussion)} className="p-3 m-3 bg-slate-100 border-2 rounded-lg">
                      <EditIcon className="w-6 h-6" />
                    </button>
                    <button className="p-3 m-3 bg-slate-100 border-2 rounded-lg" onClick={() => handleGetDiscussionId(discussion._id)}>
                      <DeleteIcon className="w-6 h-6" />
                    </button>
                    </div>
                   )}
                  <div className="flex items-center text-gray-500 dark:text-gray-400 justify-self-start">
                    <span>
                      <ReactTimeAgo date={new Date(discussion.createdAt)} locale="en-US" />
                    </span>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p>{discussion.content}</p>
                </div>
                <div className="grid items-center w-full gap-4 mb-2 text-center md:gap-8 grid-cols-4">
                  <Button className="h-10" size="icon" variant="icon">
                    <ThumbsUpIcon
                      className={`w-4 h-4 cursor-pointer ${isLikedByUser && "text-blue-400"} ${animationState[discussion._id] === "like" && "pop text-blue-400"}`}
                      onClick={() => toggleLike(discussion._id)}
                    />
                    <span className="sr-only">Like</span>
                    <span className="ml-2">{discussion.likes}</span>
                  </Button>
                  <Button className="h-10" size="icon" variant="icon">
                    <ThumbsDownIcon
                      className={`w-4 h-4 cursor-pointer ${isDislikedByUser && "text-red-400"} ${animationState[discussion._id] === "dislike" && "pop text-red-400"}`}
                      onClick={() => toggleDislike(discussion._id)}
                    />
                    <span className="sr-only">Dislike</span>
                    <span className="ml-2">{discussion.dislikes}</span>
                  </Button>
                  <Button className="md:w-24 w-[70px]" variant="secondary" disabled={status === "accepted" || status === "pending"} onClick={() => handleButtonClick(discussion)}>
                    {status === "accepted" ? "Member" : status === "pending" ? "Requested" : "Join"}
                  </Button>
                  <Button className="h-10" size="icon" variant="icon" onClick={() => handleShare(discussion)}>
                    <RiShareForwardLine className="w-5 h-5 cursor-pointer text-gray-800" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      {selectedDiscussion && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm" onClick={handleClickOutside}>
          <div className="p-4 bg-white rounded-lg dark:bg-gray-800 max-w-lg w-full">
            <NewDiscussion
              discussion={selectedDiscussion}
              onSave={handleSave}
              onClose={() => setSelectedDiscussion(null)}
            />
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
          <div className="p-4 bg-white rounded-lg dark:bg-gray-800 max-w-lg w-full">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this discussion?</p>
            <div className="flex justify-end mt-4">
              <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
              <Button className="ml-2" variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>

  );
};

export default DiscussionDetails;

function ThumbsDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function DeleteIcon(props) {
  return (

    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 30 30"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
    </svg>
  );
}
function EditIcon(props) {
  return (

    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="100"
      height="100"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
    </svg>
  );
}
function ThumbsUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}


