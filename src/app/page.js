"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { FileText, Eye, Headphones, FileEdit, FolderOpen } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import Image from 'next/image';

// Add team members data
const teamMembers = [
  {
      "name": "Rithvik A M",
      "role": "Fullstack Developer",
      "description": "Contributed across frontend, backend, and AI integration, ensuring a seamless and accessible user experience through collaborative development.",
      "image": "/Rithvik.jpg"
    },
    {
      "name": "Chatresh Ramasai Gudi",
      "role": "Fullstack Developer",
      "description": "Worked across the technology stack, focusing on building accessible interfaces, integrating AI-driven features, and optimizing application performance.",
      "image": "/Chatresh.jpg"
    },
    {
      "name": "Arvind Kothamangala",
      "role": "Fullstack Developer",
      "description": "Actively contributed to both frontend and backend development, improving usability, accessibility, and overall system design through hands-on collaboration.",
      "image": "/Arvind.jpg"
    },
    {
      "name": "Aamer Khan",
      "role": "Fullstack Developer",
      "description": "Participated in end-to-end development including frontend design, backend architecture, and AI feature implementation, emphasizing user accessibility.",
      "image": "/Aamer.jpg"
    }
];

export default function Home() {
  const { settings } = useAccessibility();
  
  const features = [
    {
      title: "Reading Tests",
      description: "Assess reading speed and comprehension with AI-powered analytics.",
      icon: <FileText className="w-6 h-6" />,
      href: "/reading-test"
    },
    {
      title: "Contrast Test",
      description: "Find the most comfortable text and background color combinations.",
      icon: <Eye className="w-6 h-6" />,
      href: "/contrast-test"
    },
    {
      title: "Dictation Test",
      description: "Practice writing through speech-to-text with instant feedback.",
      icon: <Headphones className="w-6 h-6" />,
      href: "/dictation-test"
    },
    {
      title: "Notes Proofreading",
      description: "AI-powered correction for spelling and grammar.",
      icon: <FileEdit className="w-6 h-6" />,
      href: "/proofreading"
    },
    {
      title: "Open Text File",
      description: "Import and analyze text files with dyslexia-friendly formatting.",
      icon: <FolderOpen className="w-6 h-6" />,
      href: "/open-file"
    }
  ];

  // Define styles for high contrast mode
  const cardStyle = settings?.highContrast 
    ? "bg-black border-2 border-white transition-all duration-300 hover:border-primary"
    : "transition-all duration-300 hover:border-primary/50";
  
  const textStyle = settings?.highContrast ? "text-white" : "";
  const iconContainerStyle = settings?.highContrast ? "p-2.5 w-fit rounded-md bg-black border border-white mb-4" : "p-2.5 w-fit rounded-md bg-primary/5 mb-4";
  const iconStyle = settings?.highContrast ? "text-white" : "";
  const buttonStyle = settings?.highContrast 
    ? "w-full text-base py-3 text-white hover:bg-gray-900"
    : "w-full text-base py-3";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 font-['OpenDyslexic']">
      <div className="max-w-7xl mx-auto px-6">
        <header className="py-12">
          <NavigationMenu className="w-full">
            <NavigationMenuList>
              <NavigationMenuItem>
                {/* Logo placeholder, replace with <Logo /> if you have a component */}
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10">
                    <Image
                      src="/logo.png"
                      alt="DyslexiAssist Logo"
                      width={40}
                      height={40}
                      className="object-contain rounded"
                      priority
                    />
                  </div>
                  <h1 className={`text-3xl font-bold pt-4 ${textStyle}`}>DyslexiAssist</h1>
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </header>

        <main className="space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.title} 
                className={cardStyle}
              >
                <Link href={feature.href}>
                  <CardHeader className="p-6">
                    <div className={iconContainerStyle}>
                      <div className={iconStyle}>{feature.icon}</div>
                    </div>
                    <CardTitle className={`text-xl mb-3 ${textStyle}`}>{feature.title}</CardTitle>
                    <CardDescription className={`text-base leading-relaxed ${settings?.highContrast ? 'text-gray-300' : ''}`}>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Button 
                      variant={settings?.highContrast ? "outline" : "ghost"}
                      className={buttonStyle}
                    >
                      Get Started →
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </section>

          {/* Add Team Section */}
          <section className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <Card 
                  key={member.name}
                  className="text-center transition-all duration-300 hover:border-primary/50"
                >
                  <CardContent className="pt-6">
                    <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-full"
                      />
                    </div>
                    <CardTitle className="text-xl mb-2">{member.name}</CardTitle>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <CardDescription className="text-sm">
                      {member.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-12 text-center text-base">
          <p className={settings?.highContrast ? "text-white" : "text-muted-foreground"}>
            © 2025 DyslexiAssist. Turning Challenges into Confidence.
          </p>
        </footer>
      </div>
    </div>
  );
}
