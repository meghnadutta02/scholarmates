"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { getSession } from "next-auth/react";
import io from "socket.io-client";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [request, setRequest] = useState();
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const clearUnreadCount = () => {
    setUnreadCount(0);
  };

  const removeConnectionNotification = (currentUserId, requestFromUserId) => {
    setNotifications((prev) => {
      return prev.filter((noti) => {
        return (
          noti.recipientId !== currentUserId &&
          noti.senderId !== requestFromUserId &&
          noti.status !== "requestSend"
        );
      });
    });
    setUnreadCount((prev) => {
      return prev - 1;
    });
  };

  const removeDuplicates = (array) => {
    const uniqueSet = new Map();

    array.forEach((item) => {
      const key = `${item.senderId}-${item.recipientId}-${item.message}`;
      if (
        !uniqueSet.has(key) ||
        uniqueSet.get(key).timestamp < item.timestamp
      ) {
        uniqueSet.set(key, item);
      }
    });

    return Array.from(uniqueSet.values());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        if (session) {
          setSession(session.user);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };
    const getAllNotifications = async () => {
      if (session?.db_id) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/get-notification/${session.db_id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (res.ok) {
            const data = await res.json(); // contains all notifications

            setNotifications(data.notifications);
            setUnreadCount(() => {
              return data.notifications.filter((noti) => !noti.isSeen).length;
            });
          }
        } catch (error) {
          console.error("Failed to fetch notifications", error);
        }
      }
    };

    fetchData();
    getAllNotifications();

    const newSocket = io(`${process.env.NEXT_PUBLIC_NODE_SERVER}`);

    newSocket.on("connect", () => {
      newSocket.emit("setup", session?.db_id);
    });

    setSocket(newSocket);

    const handleNewNotification = (data) => {
      if (data) {
        setNotifications((prev) => {
          const uniqueNotifications = removeDuplicates([data, ...prev]);
          return uniqueNotifications.sort((a, b) => a.timestamp - b.timestamp);
        });
        setUnreadCount((prev) => prev + 1);
      }
    };

    [
      "connectionRequest",
      "receiveRequest",
      "discussionNotification",
      "joinRequestNotification",
      "joinRequestAcceptedNotification",
    ].forEach((event) => {
      newSocket.on(event, handleNewNotification);
    });

    newSocket.on("removeConnectionRequestNotification", (data) => {
      setNotifications((prevNotifications) => {
        const foundNotification = prevNotifications.find(
          (noti) =>
            noti.notificationId === data.notificationId ||
            noti._id === data.notificationId
        );

        if (foundNotification && !foundNotification.isSeen) {
          setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);
        }

        return prevNotifications.filter(
          (noti) =>
            noti.notificationId !== data.notificationId &&
            noti._id !== data.notificationId
        );
      });
    });
    newSocket.off("removeConnectionRequestNotification");

    return () => {
      [
        "connectionRequest",
        "receiveRequest",
        "discussionNotification",
        "joinRequestNotification",
        "joinRequestAcceptedNotification",
      ].forEach((event) => {
        newSocket.off(event, handleNewNotification);
      });

      newSocket.close();
    };
  }, [session?.db_id]);

  return (
    <SessionContext.Provider
      value={{
        session,
        request,
        socket,
        notifications,
        unreadCount,
        setSession,
        setRequest,
        setNotifications,
        setUnreadCount,
        clearUnreadCount,
        removeConnectionNotification,
      }}
    >
      {!loading && children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
