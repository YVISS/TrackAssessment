export default function loading() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen gap-4">
            <svg className="mr-2 h-25 w-25 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8cv4a4 4 0 0 0-4 4H4z" />
            </svg>
        </div>
    );
}