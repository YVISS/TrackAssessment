import Card from './ui/card/page';
import './globals.css';
export default function page() {
    return (
        <section className="w-full justify-center align-center flex flex-col items-center gap-4">
            <h1 className="">Landing Page</h1>
            <Card />
        </section>
    );
}