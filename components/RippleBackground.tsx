import dynamic from "next/dynamic";

const RippleBackground = dynamic(() => import("./RippleBackgroundClient"), {
  ssr: false,
  loading: () => null,
});

export default RippleBackground;
