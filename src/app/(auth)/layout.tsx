export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className="flex justify-center pt-40">
            {children}
        </section>
    );
}