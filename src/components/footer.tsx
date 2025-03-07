import React from "react";
import { Button } from "./ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full py-8 sm:py-10 md:py-16 relative overflow-hidden border-t border-border/50">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary),0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Top Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {/* Company Info */}
                        <div className="space-y-3 lg:col-span-1">
                            <h3 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                                Spendix
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Transform your financial journey with AI-powered insights and real-time tracking.
                            </p>
                            <div className="flex gap-2 mt-4">
                                <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                                    <Github className="w-4 h-4 text-primary" />
                                </a>
                                <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                                    <Twitter className="w-4 h-4 text-primary" />
                                </a>
                                <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                                    <Linkedin className="w-4 h-4 text-primary" />
                                </a>
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className="grid grid-cols-3  gap-6 lg:col-span-3 mt-6 sm:mt-0">
                            {/* Product Links */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold">Product</h4>
                                <ul className="space-y-2">
                                    {["Features", "Pricing", "Integrations", "Enterprise", "Security"].map((item) => (
                                        <li key={item}>
                                            <a
                                                href="#"
                                                className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                                            >
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Resources Links */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold">Resources</h4>
                                <ul className="space-y-2">
                                    {["Documentation", "API Reference", "Guides", "Updates", "Community"].map((item) => (
                                        <li key={item}>
                                            <a
                                                href="#"
                                                className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                                            >
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Company Links */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold">Company</h4>
                                <ul className="space-y-2">
                                    {["About", "Blog", "Careers", "Press", "Contact"].map((item) => (
                                        <li key={item}>
                                            <a
                                                href="#"
                                                className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                                            >
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="border-t border-border mt-8 pt-6 sm:pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="w-full md:w-auto max-w-sm">
                                <h4 className="text-sm font-semibold mb-1 sm:mb-2">Stay up to date</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Get the latest updates and news from Spendix.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 mt-4 md:mt-0">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full sm:w-52 md:w-64 px-3 py-2 text-xs sm:text-sm rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                />
                                <Button className="text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-lg h-auto whitespace-nowrap">
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Copyright Section */}
                    <div className="border-t border-border mt-6 pt-6 text-center">
                        <p className="text-xs text-muted-foreground">© 2024 Spendix. All rights reserved.</p>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-primary/10 rounded-full blur-[80px] opacity-10" />
            <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-primary/10 rounded-full blur-[80px] opacity-10" />
        </footer>
    );
};

export default Footer;