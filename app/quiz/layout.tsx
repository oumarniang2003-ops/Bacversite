import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz d'orientation",
  description:
    "Découvre les filières et universités qui correspondent à ton profil grâce à notre quiz d'orientation post-bac.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
