// utils/weightFeedback.js
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import { toast } from "react-toastify";

export function handleWeightFeedback(latestWeight, currentWeight) {
  if (latestWeight == null || currentWeight == null) return;

  const diff = latestWeight - currentWeight;

  if (diff > 2) {
    Swal.fire({
      title: "🌟 太厲害了！",
      text: `你減了 ${diff.toFixed(1)} 公斤！太棒了 🎉`,
      icon: "success",
      confirmButtonText: "我要繼續保持！💪",
    });
    confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
  } else if (diff > 0) {
    toast.success("🎉 你進步了！太棒了！");
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  } else if (diff < 0) {
    Swal.fire({
      title: "沒關係 🐢",
      text: "體重有點上升也沒關係，繼續努力就好！💖",
      icon: "info",
      confirmButtonText: "我會繼續加油的！💪",
    });
  }
}