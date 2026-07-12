import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let mouseX = -100, mouseY = -100;
    let currentX = -100, currentY = -100;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      el.style.left = currentX + "px";
      el.style.top = currentY + "px";
      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    requestAnimationFrame(animate);

    return () => document.removeEventListener("mousemove", onMouseMove);
  }, []);

  return <div id="cursor-glow" ref={glowRef} />;
}
