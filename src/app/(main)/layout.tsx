export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="container mx-auto my-32">
            {children}
        </section>
    );
}