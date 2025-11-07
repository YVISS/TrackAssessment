import {Poppins} from "next/font/google";
import {Bai_Jamjuree} from "next/font/google";
import { Noto_Sans } from "next/font/google";
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400","700"],
});

export const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["400","700"],
});

export const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400","700"],
});