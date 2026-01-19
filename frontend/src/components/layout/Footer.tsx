import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/95">
            <div className="container py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2025 PromptForge AI. Building the future of decentralized AI development.
                    </p>
                    <Link
                        href="/terms"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
}
