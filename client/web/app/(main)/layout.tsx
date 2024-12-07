import Footer from '@/components/footer';
import Header from '@/components/header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
