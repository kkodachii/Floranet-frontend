import React, { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { ToastContainer, toast, Bounce } from 'react-toastify';

const CustomToast = ({ title, description }) => {
  // trim description to 10 chars + ...
  const shortDesc =
    description.length > 30 ? description.slice(0, 30) + "..." : description;

  return (
    <div>
      <strong>{title}</strong>
      <div style={{ fontSize: "0.9rem", color: "#555" }}>{shortDesc}</div>
    </div>
  );
};


export default function NotificationListener() {
  useEffect(() => {
    window.Pusher = Pusher;

    window.Echo = new Echo({
      broadcaster: "pusher",
      key: "e48e3f31ab5c564487f4",
      cluster: "ap1",
      forceTLS: true,
    });

    //how to use toast
    // toast.info("Lorem ipsum dolor");
    // toast.error("Lorem ipsum dolor")
    // toast.success("Lorem ipsum dolor")
    // toast.success("Lorem ipsum dolor", {
    //   theme: "colored"
    // })
    // toast.warn("Lorem ipsum dolor")
    // toast.warn("Lorem ipsum dolor", {
    //   theme: "dark"
    // })

    // window.Echo.private(`App.Models.User.${user.id}`)
    //   .listen("RequestReceived", (event) => {
    //       addNotification(event, "You have new medicine request!", "success");
    //   });

    window.Echo.channel("notifications")
      .listen(".new-notification", (e) => {
        toast(e.message, {
          toastId: e.message
        });
      });

    window.Echo.channel("admin").listen(".notify-admin", (e) => {
      toast(<CustomToast title={e.title??"Notification Alert"} description={e.message??""} />, {
          toastId: e.id
        });
    });

    window.Echo.channel("cctv-requests")
    .listen(".cctv-followup-admin", (e) => {
      console.log("📡 CCTV followup received:", e);
    });

  }, []);

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
  );
}
