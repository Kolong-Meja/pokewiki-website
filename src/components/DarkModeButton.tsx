import { MouseEventHandler } from "react";

type DarkModeButtonProps = {
  theme: string;
  handler: MouseEventHandler;
};

export default function DarkModeButton(props: DarkModeButtonProps) {
  return (
    <button
      className={`relative m-4 inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        props.theme === "dark"
          ? "bg-gray-600 ring-offset-gray-700 focus:ring-gray-400"
          : "bg-yellow-300 ring-offset-yellow-200 focus:ring-yellow-500"
      }`}
      type="button"
      onClick={props.handler}
    >
      <span className="sr-only">Toggle Dark Mode</span>
      <span
        className={`pointer-events-none relative inline-block h-4 w-4 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
          props.theme === "dark"
            ? "translate-x-0 bg-gray-300"
            : "translate-x-4 bg-white"
        }`}
      >
        {/* Dark icon */}
        <span
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
            props.theme === "dark" ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <svg
            className="h-3 w-3 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </span>
        {/* Light icon */}
        <span
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
            props.theme === "dark" ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-moon-stars-fill h-3 w-3 text-yellow-300"
            viewBox="0 0 16 16"
          >
            <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278" />
            <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
