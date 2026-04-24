import { Hero } from "@/components/landing/Hero";
import { Logos } from "@/components/landing/Logos";
import { Benefits } from "@/components/landing/Benefits";
import { GlobalScale } from "@/components/GlobalScale";
import { SocialProof } from "@/components/landing/SocialProof";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { ParticleMesh } from "@/components/landing/ParticleMesh";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-kast-teal/30 selection:text-black">
            <ParticleMesh />
            <Hero />
            <Logos />
            <div id="about">
                <Benefits />
            </div>
            <GlobalScale />
            {/* <SocialProof /> */}
            <div id="faq">
                <FAQ />
            </div>
            <Footer />
        </main>
    );
}

