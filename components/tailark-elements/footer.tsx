import Link from "next/link";

const links = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
];

export default function FooterSection() {
  return (
    <footer className="md:pt-16 pt-10 pb-5 w-full flex flex-col gap-2 items-center justify-center">
      <div className="flex items-center justify-between w-full">
        <a
          href={"#"}
          className="rounded-md p-2 hover:bg-accent cursor-pointer shrink-0"
        >
          <span className="font-medium">Chat_With_AI</span>
        </a>

        <div className="flex flex-wrap justify-center gap-16">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="text-muted-foreground hover:text-primary duration-150"
            >
              <span>{link.title}</span>
            </a>
          ))}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6">
          <a
            href="https://www.linkedin.com/in/abid-shah-khan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-blue-500 block"
          >
            <svg
              className="size-8"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
              ></path>
            </svg>
          </a>
          <a
            href="https://github.com/Abid-Khan12"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-primary block"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-7.5"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </div>
      </div>

      <span className="text-muted-foreground block text-center text-sm">
        © {new Date().getFullYear()} Chat_With_AI, All rights reserved
      </span>
    </footer>
  );
}
