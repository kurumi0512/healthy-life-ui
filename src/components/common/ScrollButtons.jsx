import React, { useEffect, useState } from "react";

function ScrollButtons({ bottomRef }) {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showBottomBtn, setShowBottomBtn] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.offsetHeight;

      setShowTopBtn(scrollY > 300);
      setShowBottomBtn(scrollY + windowHeight < bodyHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 flex items-center gap-2 bg-white-600 hover:bg-blue-400 text-black font-bold px-5 py-3 rounded-full shadow-xl animate-[bounce_2s_infinite] z-50"
          title="回到最上方"
        >
          🡹 TOP
        </button>
      )}

      {showBottomBtn && (
        <button
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="fixed bottom-6 left-6 flex items-center gap-2 bg-white-600 hover:bg-blue-400 text-black font-bold px-5 py-3 rounded-full shadow-xl animate-[bounce_2s_infinite] z-50"
          title="滑到底部"
        >
          🡻 BOTTOM
        </button>
      )}
    </>
  );
}

export default ScrollButtons;